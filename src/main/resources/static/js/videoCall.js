'use strict';

let stompClient;
/* Pass full URL of deployed server*/
// const socket = io("ws://localhost:5000");

/*These are state fields */
let stream;
let me = "";
let users = {};
let call = {};
let callAccepted = false;
let callEnded = false;
let theirName = "";
let iceCandidates = {};
const userID = getCookie("user_id");
let mySrcObject = {};
let theirSrcObject = {};
var connectionRef = {};

const connect = (event) => {
  const socket = new SockJS('/videoCall-video');
  stompClient = Stomp.over(socket);
  /* Get permission for microphone and webcam*/
  navigator.mediaDevices.getUserMedia(
      {video: true, audio: true}) /* returns a promise*/
  .then((currentStream) => {
    stream = currentStream;
    mySrcObject = currentStream;
    document.getElementById("myVideo").srcObject = currentStream
  });
  stompClient.connect({}, onConnected, onError)
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

const onConnected = () => {
  console.log("This is my user ID: " + userID);
  stompClient.subscribe('/topic/video/' + userID + '/incomingCall',
      incomingCall);
  stompClient.subscribe('/topic/video/' + userID + '/username',
      onUsernameReceived);
  stompClient.subscribe('/topic/video/' + userID + '/endCall', leaveCall);
  stompClient.subscribe('/topic/video/' + userID + '/iceCandidates',
      saveIceCandidates);

  stompClient.send("/app/video.getAllUsers", {},
      JSON.stringify({message: userID}));
  stompClient.send("/app/video.iceCandidates", {},
      JSON.stringify({message: userID}))
};

const onError = () => {
  console.log("Error with socket connection!")
};

function findUsersName(id) {
  for (const [k, v] of Object.entries(users)) {
    if (k == id) {
      return v
    }
  }
}

const onUsernameReceived = (payload) => {
  console.log("This is the " + payload);
  const message = JSON.parse(payload.body);
  users = message.data;
  let name;
  for (const [k, v] of Object.entries(message.data)) {
    if (k == userID) {
      name = v;
      break
    }
  }
  me = userID;
  theirName = name;
  console.log(Object.keys(users))
};

const saveIceCandidates = (payload) => {
  console.log("This is the " + payload);
  const message = JSON.parse(payload.body);
  console.log("These are the ice candidates " + message);
  iceCandidates = message;
};

const incomingCall = (payload) => {
  const message = JSON.parse(payload.body);
  console.log("Person calling me " + message.callerName);
  call = {
    isReceivedCall: true,
    from: message.caller,
    name: message.callerName,
    signal: message.signal
  };
  console.log("incoming call " + message)
};

// acceptCall
const answerCall = () => {
  callAccepted = true;
  /*simple peer library usage */
  /* Initiator is who starts call
      stream from earlier getUserMedia
  */
  const peer = new SimplePeer({
    initiator: false, trickle: false, stream: stream,
    config: {
      iceServers: iceCandidates
    }
  });

  peer.on("signal", (data) => {
    stompClient.send("/app/video.acceptCall", {},
        JSON.stringify({signal: data, callee: userID, caller: call.from})) //Since we are returning the message to the caller
  });

  peer.on("stream", (currentStream) => {
    /* This is the other persons stream*/
    theirSrcObject = currentStream;
    const theirVid = document.getElementById("theirVideo")
    theirVid.srcObject = currentStream
  });

  peer.signal(call.signal);

  connectionRef = peer;

};
// CallPeer
const callUser = (id) => {
  /*we are the person calling */
  const peer = new SimplePeer({
    initiator: true, trickle: false,
    reconnectTimer: 100,
    iceTransportPolicy: 'relay',
    config: {
      iceServers: iceCandidates
    }, stream: stream,
  });
  console.log("The user has been called by " + id);
  console.log("Message being sent: ");
  peer.on("signal", (data) => {
    console.log(JSON.stringify({callee: id, caller: userID, signal: data}));
    stompClient.send("/app/video.callUser", {},
        JSON.stringify({callee: id, caller: userID, signal: data}))
  });

  peer.on("stream", (currentStream) => {
    theirSrcObject = currentStream;
    const theirVid = document.getElementById("theirVideo")
    theirVid.srcObject = currentStream
  });

  const onCallAccepted = (signal) => {
    callAccepted = true;
    const message = JSON.parse(signal.body);
    call = {name: findUsersName(id), from: id};
    peer.signal(message.signal)
  };
  stompClient.subscribe('/topic/video/' + userID + '/callAccepted',
      onCallAccepted);

  connectionRef = peer;
};

function resetCall() {
  callAccepted = false;
  callEnded = false;
  call = {}
}

const leaveCall = () => {
  console.log("LEAVING THE CALL " + call.from);
  stompClient.send("/app/video.endCall", {},
      JSON.stringify({message: call.from}));
  callEnded = true;
  // connectionRef.current.destroy(); /*Stop receiving input from user camera and microphone */
  // window.location.reload();
  resetCall()
};

window.onload = function () {
  connect({})
};