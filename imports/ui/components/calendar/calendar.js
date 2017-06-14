import './calendar.html'
import {dbTracks} from '../../../api/db/db.js'

function resize() {
  // $('#asd').css({
  //   height: window.innerHeight-150,
  // })
  $('#calendar').fullCalendar('option', 'height', window.innerHeight-70-40);
};

Template.calendar.onRendered(function() {
  $('#calendar').fullCalendar({
    nowIndicator: true,
    scrollTime: moment().subtract(3,'hours').format('HH:mm:ss'),
    lang: 'de',
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,basicWeek,agendaDay'
    },
    defaultView: 'agendaDay',
    events: dbTracks.getFullCalendar(),
    eventClick: function(calEvent,jsEvent,view) {
      Router.go('show',{_id:calEvent.id});
    },
  });
  resize();
  $(window).on( "resize", resize )
});

Template.calendar.onDestroyed(function() {
  $(window).off( "resize" );
});
