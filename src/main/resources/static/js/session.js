let username; // Name of current user

username = getCookie("user_id")

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

function addSession(name, startDate, endDate) {
  console.log(
      "inside addsession with-" + name + "-" + startDate + "-" + endDate)
  console.log("array " + JSON.stringify([name]))
  console.log("message " + JSON.stringify({
    tutor: username,
    tutees: name,
    // tutees: JSON.stringify([name]),
    dateTime: startDate,
    duration: 5
  }))

  fetch("/addSession", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tutor: username,
      tutees: name,
      dateTime: startDate,
      duration: 5
    })
  }).then(rsp => console.log(rsp))
}

document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      initialView: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    selectable: true,
    selectMirror: true,
    businessHours: true,
    select: function (arg) {
      var title = prompt('Event Title:');
      if (title) {
        calendar.addEvent({
          title: title,
          start: arg.start,
          end: arg.end,
          allDay: false
        })
      }
      console.log("Clicked on event")
      addSession(title, arg.start, arg.end)
      calendar.unselect()
    },
    eventClick: function (arg) {
      if (confirm('Are you sure you want to delete this event?')) {
        arg.event.remove()
      }
    },
  });
  calendar.render();
});


