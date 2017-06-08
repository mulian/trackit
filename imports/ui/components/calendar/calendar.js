import './calendar.html'
import {dbTracks} from '../../../api/db/db.js'

function resize() {
  // $('#asd').css({
  //   height: window.innerHeight-150,
  // })
  $('#calendar').fullCalendar('option', 'height', window.innerHeight-70);
};

Template.calendar.onRendered(function() {
  $('#calendar').fullCalendar({
    lang: 'de',
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,basicWeek,agendaDay'
    },
    defaultView: 'basicWeek',
    events: dbTracks.getFullCalendar(),
    eventClick: function(calEvent,jsEvent,view) {
      // console.log(calEvent);
      Router.go('show',{_id:calEvent.id});
    },
  });
  resize();
  $(window).on( "resize", resize )
});

Template.calendar.onDestroyed(function() {
  $(window).off( "resize" );
});
