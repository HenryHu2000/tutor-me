(this["webpackJsonptutor-me"]=this["webpackJsonptutor-me"]||[]).push([[0],{128:function(e,t){},130:function(e,t){},182:function(e,t,a){},183:function(e,t,a){"use strict";a.r(t);var n,c=a(0),i=a(11),r=a.n(i),l=a(23),s=a(223),o=a(218),d=a(213),j=a(216),u=a(184),b=a(15),m=a(56),p=a.n(m),O=a(87),f=a.n(O),g=a(88),x=a.n(g),h=a(4),v=Object(c.createContext)(),C=function(e){var t=e.children,a=Object(c.useState)(),i=Object(b.a)(a,2),r=i[0],l=i[1],s=Object(c.useState)(""),o=Object(b.a)(s,2),d=o[0],j=o[1],u=Object(c.useState)({}),m=Object(b.a)(u,2),O=m[0],g=m[1],C=Object(c.useState)({}),y=Object(b.a)(C,2),N=y[0],w=y[1],k=Object(c.useState)(!1),S=Object(b.a)(k,2),I=S[0],A=S[1],J=Object(c.useState)(!1),D=Object(b.a)(J,2),E=D[0],B=D[1],T=Object(c.useState)(""),V=Object(b.a)(T,2),R=V[0],W=V[1],U=function(e){var t="; ".concat(document.cookie).split("; ".concat(e,"="));if(2===t.length)return t.pop().split(";").shift()}("user_id"),z=Object(c.useRef)(),L=Object(c.useRef)(),P=Object(c.useRef)();Object(c.useEffect)((function(){var e=new f.a("/videoCall-video");n=x.a.over(e),navigator.mediaDevices.getUserMedia({video:!0,audio:!0}).then((function(e){l(e),z.current.srcObject=e})),n.connect({},M,F)}),[]);var M=function(){console.log("This is my user ID: "+U),n.subscribe("/topic/video/"+U+"/incomingCall",Y),n.subscribe("/topic/video/"+U+"/username",H),n.subscribe("/topic/video/"+U+"/endCall",_),n.send("/app/video.getAllUsers",{},JSON.stringify({message:U}))},F=function(){console.log("Error with socket connection!")};function G(e){for(var t=0,a=Object.entries(O);t<a.length;t++){var n=Object(b.a)(a[t],2),c=n[0],i=n[1];if(c==e)return i}}var H=function(e){console.log("This is the "+e);var t,a=JSON.parse(e.body);g(a.data);for(var n=0,c=Object.entries(a.data);n<c.length;n++){var i=Object(b.a)(c[n],2),r=i[0],l=i[1];if(r==U){t=l;break}}j(U),W(t),console.log(Object.keys(O))},Y=function(e){var t=JSON.parse(e.body);console.log("Person calling me "+t.callerName),w({isReceivedCall:!0,from:t.caller,name:t.callerName,signal:t.signal}),console.log("incoming call "+t)};var _=function(){console.log("LEAVING THE CALL "+N.from),n.send("/app/video.endCall",{},JSON.stringify({message:N.from})),B(!0),A(!1),B(!1),w({})};return Object(h.jsx)(v.Provider,{value:{call:N,callAccepted:I,myVideo:z,userVideo:L,stream:r,name:R,setName:W,callEnded:E,me:d,users:O,callUser:function(e){var t=new p.a({initiator:!0,trickle:!1,stream:r});console.log("The user has been called by "+e),console.log("Message being sent: "),t.on("signal",(function(t){console.log(JSON.stringify({callee:e,caller:U,signal:t})),n.send("/app/video.callUser",{},JSON.stringify({callee:e,caller:U,signal:t}))})),t.on("stream",(function(e){L.current.srcObject=e}));n.subscribe("/topic/video/"+U+"/callAccepted",(function(a){A(!0);var n=JSON.parse(a.body);w({name:G(e),from:e}),t.signal(n.signal)})),P.current=t},leaveCall:_,answerCall:function(){A(!0);var e=new p.a({initiator:!1,trickle:!1,stream:r});e.on("signal",(function(e){n.send("/app/video.acceptCall",{},JSON.stringify({signal:e,callee:U,caller:N.from}))})),e.on("stream",(function(e){L.current.srcObject=e})),e.signal(N.signal),P.current=e}},children:t})},y=Object(d.a)((function(e){return{video:Object(l.a)({width:"550px"},e.breakpoints.down("xs"),{width:"300px"}),gridContainer:Object(l.a)({justifyContent:"center"},e.breakpoints.down("xs"),{flexDirection:"column"}),paper:{padding:"10px",border:"2px solid black",margin:"10px"}}})),N=function(){var e=Object(c.useContext)(v),t=e.name,a=e.callAccepted,n=e.myVideo,i=e.userVideo,r=e.callEnded,l=e.stream,s=e.call,d=y();return Object(h.jsxs)(j.a,{container:!0,className:d.gridContainer,children:[l&&Object(h.jsx)(u.a,{className:d.paper,children:Object(h.jsxs)(j.a,{item:!0,xs:12,md:6,children:[Object(h.jsx)(o.a,{variant:"h5",gutterBottom:!0,children:t}),Object(h.jsx)("video",{playsInline:!0,muted:!0,ref:n,autoPlay:!0,className:d.video})]})}),a&&!r&&Object(h.jsx)(u.a,{className:d.paper,children:Object(h.jsxs)(j.a,{item:!0,xs:12,md:6,children:[Object(h.jsx)(o.a,{variant:"h5",gutterBottom:!0,children:s.name}),Object(h.jsx)("video",{playsInline:!0,ref:i,autoPlay:!0,className:d.video})]})})]})},w=a(225),k=function(){var e=Object(c.useContext)(v),t=e.answerCall,a=e.call,n=e.callAccepted;return Object(h.jsx)(h.Fragment,{children:a.isReceivedCall&&!n&&Object(h.jsxs)("div",{styles:{display:"flex",justifyContent:"center"},children:[Object(h.jsxs)("h1",{children:[a.name," is calling: "]}),Object(h.jsx)(w.a,{variant:"contained",color:"primary",onClick:t,children:"Answer"})]})})},S=a(219),I=a(224),A=a(94),J=a(220),D=a(221),E=a(222),B=Object(d.a)((function(e){return{root:{display:"flex",flexDirection:"column"},gridContainer:Object(l.a)({width:"100%"},e.breakpoints.down("xs"),{flexDirection:"column"}),container:Object(l.a)({width:"600px",margin:"35px 0",padding:0},e.breakpoints.down("xs"),{width:"80%"}),margin:{marginTop:20},padding:{padding:20},paper:{padding:"10px 20px",border:"2px solid black"}}})),T=function(e){var t=e.children,a=Object(c.useContext)(v),n=a.me,i=a.users,r=a.callAccepted,l=a.name,s=a.setName,d=a.callEnded,m=a.leaveCall,p=a.callUser,O=Object(c.useState)(""),f=Object(b.a)(O,2),g=f[0],x=f[1],C=B();return Object(h.jsx)(S.a,{className:C.container,children:Object(h.jsxs)(u.a,{elevation:10,className:C.paper,children:[Object(h.jsxs)("form",{className:C.root,noValidate:!0,autoComplete:"off",children:[Object(h.jsxs)(j.a,{container:!0,className:C.gridContainer,children:[Object(h.jsxs)(j.a,{item:!0,xs:12,md:6,className:C.padding,children:[Object(h.jsx)(o.a,{gutterBottom:!0,variant:"h6",children:"Account Info"}),Object(h.jsx)(I.a,{label:"Name",value:l,onChange:function(e){return s(e.target.value)},fullWidth:!0}),Object(h.jsx)(A.CopyToClipboard,{text:n,className:C.margin,children:Object(h.jsx)(w.a,{variant:"contained",color:"primary",fullWidth:!0,startIcon:Object(h.jsx)(J.a,{fontSize:"large"}),children:"Copy Your ID"})})]}),Object(h.jsxs)(j.a,{item:!0,xs:12,md:6,className:C.padding,children:[Object(h.jsx)(o.a,{gutterBottom:!0,variant:"h6",children:"Make a call"}),Object(h.jsx)(I.a,{label:"ID to call",value:g,onChange:function(e){return x(e.target.value)},fullWidth:!0}),r&&!d?Object(h.jsx)(w.a,{variant:"contained",color:"secondary",fullWidth:!0,startIcon:Object(h.jsx)(D.a,{fontSize:"large"}),onClick:m,className:C.margin,children:"End call"}):Object(h.jsx)(w.a,{variant:"contained",color:"primary",fullWidth:!0,startIcon:Object(h.jsx)(E.a,{fontSize:"large"}),onClick:function(){return p(g)},className:C.margin,children:"Call"})]})]}),Object(h.jsx)(j.a,{children:Object.entries(i).map((function(e){var t=Object(b.a)(e,2),a=t[0],c=t[1];return console.log("This is me "+a+"-"+c),a===n?null:Object(h.jsxs)(w.a,{variant:"contained",color:"primary",fullWidth:!0,startIcon:Object(h.jsx)(E.a,{fontSize:"large"}),onClick:function(){return p(a)},className:C.margin,children:["Call ",c]})}))})]}),t]})})},V=Object(d.a)((function(e){return{appBar:Object(l.a)({borderRadius:15,margin:"30px 100px",display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",width:"600px",border:"2px solid black"},e.breakpoints.down("xs"),{width:"90%"}),image:{marginLeft:"15px"},wrapper:{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}})),R=function(){var e=V();return Object(h.jsxs)("div",{className:e.wrapper,children:[Object(h.jsx)(s.a,{className:e.appBar,position:"static",color:"inherit",children:Object(h.jsx)(o.a,{variant:"h4",align:"center",children:"Video Chat App"})}),Object(h.jsx)(N,{}),Object(h.jsx)(T,{children:Object(h.jsx)(k,{})})]})};a(182);r.a.render(Object(h.jsx)(C,{children:Object(h.jsx)(R,{})}),document.getElementById("root"))}},[[183,1,2]]]);
//# sourceMappingURL=main.b14c6b83.chunk.js.map