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
function getTracks(withoutTransform) {
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

  let options = {
    sort: {created:-1},
  }
  if(withoutTransform) options.transform = null;

  return dbTracks.find(q,options);
}
let withoutColumns=['_id','owner'];
function getCSV(withTitle=true) {
  let tracks = getTracks();
  let str = "";
  let title = "";
  let once = true;
  tracks.forEach(function(docOriginal) {
    let doc = docOriginal._;
    if(once && withTitle) {
      for(item in doc) {
        if(!_.contains(withoutColumns,item))
          title+=
            String(item.charAt(0)).toUpperCase()+ item.slice(1)+';';
      }
      title+='\n';
      once=false;
    }
    for(item in doc) {
      // console.log(item);
      if(!_.contains(withoutColumns,item)) {
        let tmp ="";
        if(doc[item] instanceof Date) tmp = moment(doc[item]).format('DD.MM.YY HH:MM:ss');
        else tmp = doc[item];
        str+='"'+tmp+'";'
      }
    }
    str+='\n';
  });
  return title+str;
}
Template.tracks.helpers({
  tracks() {
    Session.set('query',this.otherData);
    return getTracks();
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
    let content = getCSV();
    // console.log(content);
    var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    saveAs(blob,'bla.csv');
  }
});
