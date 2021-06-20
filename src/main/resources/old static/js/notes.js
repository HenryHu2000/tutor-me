let stompClient;
const userId = getCookie("user_id");
let username; // Name of current user
let index = 0; // global note index
let html = "";
let nothingTag = true;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

const addHTML = (element, id) => {

  console.log("Making note");
  const note = document.createElement('div');
  note.id = ("Note " + id);
  note.classList.add("noteCard");
  note.classList.add("my-2");
  note.classList.add("mx-2");
  note.classList.add("card");

  note.style = ("width: 18rem;");

  console.log("Making inner note");
  const innerNote = document.createElement('div');
  innerNote.classList.add("card-body");

  const header = document.createElement('h5');
  header.innerText = ('Note ' + (++index));

  const paragraph = document.createElement('p');
  paragraph.id = "Paragraph " + id
  paragraph.classList.add("card-text");
  paragraph.innerText = (element);

  const editBox = document.createElement("textarea");
  editBox.classList.add("form-control")
  editBox.id = "editNoteBox " + id
  editBox.style.display = 'none'

  const deleteButton = document.createElement('button');
  deleteButton.id = "Delete " + id;
  deleteButton.onclick = function () {
    deleteNote(id)
  };
  deleteButton.classList.add("btn");
  deleteButton.classList.add("btn-primary");
  deleteButton.innerText = ('Delete Note');

  const editButton = document.createElement('button');
  editButton.id = (id);
  editButton.onclick = function () {
    editNote(id)
  };
  editButton.classList.add("btn");
  editButton.classList.add("btn-primary");
  editButton.innerText = ('Edit Note');

  const saveButton = document.createElement('button');
  saveButton.id = "Save " + id;
  saveButton.onclick = function () {
    saveNote(id)
  };
  saveButton.classList.add("btn");
  saveButton.classList.add("btn-primary");
  saveButton.innerText = ('Save Note');
  // saveButton.style.display = 'none'

  console.log("putting it togetehr");
  innerNote.appendChild(header);
  innerNote.appendChild(paragraph);
  innerNote.appendChild(editBox)
  innerNote.appendChild(editButton);
  innerNote.appendChild(deleteButton);
  innerNote.appendChild(saveButton)

  note.appendChild(innerNote);

  const notesDraw = document.getElementById("notes");
  notesDraw.appendChild(note)
};

//make button id the note id
const connect = (event) => {

  username = getCookie("user_id");
  if (username != null) {
    const socket = new SockJS('/notes-note');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError)
  }

};

// subscribe is what we hear back on
// send is what we are sending.
const onConnected = () => {
  console.log("got here");

  // stompClient.subscribe('/notes-' + userId + '-allNotes', saveNote)
  document.getElementById("addButton").addEventListener("click", addNote);

  stompClient.subscribe('/topic/notes-' + userId + '-receiveNotes',
      receiveNotesAndDisplay);
  stompClient.subscribe('/topic/notes-' + userId + '-newNoteId', getNewNoteId);

  stompClient.send('/app/notes.getNotes', {},
      JSON.stringify({message: userId}));

  console.log("Connecting")
};

const onError = (error) => {
  console.log("Something went wrong")
};

const addNote = () => {
  const addText = document.getElementById("addText");
  const noteContent = addText.value.trim();

  console.log("adding a new note with context" + noteContent);

  if (noteContent !== null) {
    const noteMessage = {
      content: noteContent,
      sender: username
    };
    stompClient.send("/app/notes.addNote", {}, JSON.stringify(noteMessage))
  }
}

const getNewNoteId = (payload) => {
  const addText = document.getElementById("addText");
  const noteContent = addText.value.trim();

  const message = JSON.parse(payload.body);

  const noteId = message.message;

  let notesElm = document.getElementById("notes");

  if (nothingTag) {
    notesElm.innerHTML = '';
    nothingTag = false;
  }

  // addHTML(noteContent)
  addHTML(noteContent, noteId);
  document.getElementById("Save " + noteId).style.display = 'none'

  if (notes.length == 0) {
    notesElm.innerHTML = `Nothing to show!
      Use "Add a Note" section above to add notes.`;
    nothingTag = true;
  }

  notesElm.value = ''

};

const receiveNotesAndDisplay = (payload) => {

  console.log("Displaying notes" + payload.body);
  const notes = JSON.parse(payload.body);

  let notesElm = document.getElementById("notes");

  if (nothingTag) {
    notesElm.innerHTML = '';
    nothingTag = false;
  }

  notes.map(note => addHTML(note.content, note.id));

  // noteContents.forEach(function(element) { addHTML(element)});

  //add noteid to addhtml function

  if (notes.length == 0) {
    notesElm.innerHTML = `Nothing to show!
          Use "Add a Note" section above to add notes.`;
    nothingTag = true;
  }
};

// Function to delete a note
const deleteNote = (noteId) => {
  //get notes from database
  var elem = document.getElementById("Note " + noteId);
  elem.parentNode.removeChild(elem);

  console.log(noteId);
  stompClient.send('/app/notes.deleteNote', {},
      JSON.stringify({name: userId, status: noteId}));

  // var button = document.getElementById(noteId)
  // button.parentNode.removeChild(button);

  return false;
};

// Function to edit a note
const editNote = (noteId) => {
  // //get notes from database
  var elem = document.getElementById("Paragraph " + noteId);
  elem.style.display = 'none'

  var editBox = document.getElementById("editNoteBox " + noteId);
  editBox.style.display = 'block'
  editBox.innerText = elem.innerText

  var saveButton = document.getElementById("Save " + noteId);
  saveButton.style.display = 'block'

  var deleteButton = document.getElementById("Delete " + noteId);
  deleteButton.style.display = 'none'

  //text = elem.content

  // console.log(noteId);
  // stompClient.send('/app/notes.deleteNote', {},
  //     JSON.stringify({name: userId, status: noteId}));

  // // var button = document.getElementById(noteId)
  // // button.parentNode.removeChild(button);

  // return false;

  // const addText = document.getElementById("addText");
  // const noteContent = addText.value.trim();

  // console.log("adding a new note with context" + noteContent);

  // if (noteContent !== null) {
  //   const noteMessage = {
  //     content: noteContent,
  //     sender: username
  //   };
  //   stompClient.send("/app/notes.addNote", {}, JSON.stringify(noteMessage))
  // }
};
const saveNote = (noteId) => {

  var elem = document.getElementById("Paragraph " + noteId);
  elem.style.display = 'block'

  var editBox = document.getElementById("editNoteBox " + noteId);
  var editedText = editBox.value.trim();
  editBox.style.display = 'none'
  elem.innerText = editedText

  var deleteButton = document.getElementById("Delete " + noteId);
  deleteButton.style.display = 'block'

  var saveButton = document.getElementById("Save " + noteId);
  saveButton.style.display = 'none'

  if (editedText !== null) {
    const noteMessage = {
      content: editedText,
      sender: noteId
    };
    stompClient.send("/app/notes.editNote", {}, JSON.stringify(noteMessage))
    // update database
  }
}

connect({});

//send a message

//subscribe to channel