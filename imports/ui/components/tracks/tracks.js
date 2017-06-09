import {dbTracks} from '../../../api/db/db.js'
import './tracks.html'

import mdDateTimePicker from 'md-date-time-picker'
import 'md-date-time-picker/dist/css/mdDateTimePicker.min.css'
// import mdDateTimePicker from 'md-date-time-picker/src/js/mdDateTimePicker';

let dialogDate,dialogTime;
Template.tracks.onRendered(function() {
  dialogDate = new mdDateTimePicker({
    type: 'date',
    // future: moment().add(3,'years'),
    mode: true,
  });
  // dialogTime = new mdDateTimePicker({
  //   type: 'time',
  //   // future: moment().add(3,'years'),
  //   mode: true,
  // });
  // this.$('.clockpicker').clockpicker();
});
function getTracks(onlyQuery=false) {
  let q = {
    stop: {$not:undefined},
    title: {
      $not:"",
    },
  };

  let query = Session.get('query');
  if(query) q.title.$regex = new RegExp('.*'+query+'.*','i');

  if(Session.get('startDate')) q.start = { $gte: Session.get('startDate'), };
  if(Session.get('toDate')) q.stop = { $lte: Session.get('toDate'), };

  if(onlyQuery) return q;
  else return dbTracks.find(q,{
      sort: {created:-1},
    });
}
Template.tracks.helpers({
  tracks(onlyQuery) {
    Session.set('query',this.otherData);
    return getTracks(onlyQuery);
  },
  startDate() {
    return moment(Session.get('startDate')).format('DD.MM.YY');
  },
  stopDate() {
    return moment(Session.get('toDate')).format('DD.MM.YY');
  },
  duration() {
    let nowVar = Template.instance().now;
    let start = moment(this.start);
    let diff;
    let stop = moment(this.stop);
    diff = moment.duration(stop.diff(start));
    diff.subtract(1,'hours');
    // console.log(moment(diff.asMilliseconds()).format('HH:mm:ss'));
    return moment(diff.asMilliseconds()).format('HH:mm:ss');
  },
  timeStart() {
    return moment(this.start).format('DD.MM.YY HH:mm:ss');
  },
  timeStop() {
    return moment(this.stop).format('DD.MM.YY HH:mm:ss');
  },
});
Template.tracks.events({
  'focus .datepicker'(e,i) {
    dialogDate.toggle();
    dialogDate.trigger = e.target;
  },
  // 'focus .datepickerTime'(e,i) {
  //   dialogTime.toggle();
  //   dialogTime.trigger = e.target;
  // },
  'onOk .from'(e,i) {
    // e.target.value = dialogDate.time.format('DD.MM.YY');

    Session.set('startDate',dialogDate.time.set({
      hour: 0,
      minute: 0,
    }).toDate());
  },
  'onOk .till'(e,i) {
    // e.target.value = dialogDate.time.format('DD.MM.YY');
    Session.set('toDate',dialogDate.time.set({
      hour: 23,
      minute: 59,
    }).toDate());
  },
  'click .csvDownload'(e,i) {
    // console.log(this,i);
    var nameFile = 'fileDownloaded.csv';
    Meteor.call('download',getTracks(true),Session.get('query'), function(err, fileContent) {
      if(fileContent){
        // console.log(fileContent);
       var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
       saveAs(blob, nameFile);
      }
   });
  }
});
