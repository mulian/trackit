import {dbTracks} from '../../../api/db/db.js'
import './tracks.html'

// let dialogDate,dialogTime;
// Template.tracks.onRendered(function() {
// });
function getTracks() {
  let q = {
    stop: { $not:undefined },
    title: {
      $not:"",
    },
  };

  // let query = Session.get('query'), regex;
  // if(query && query!='') q._.title.$regex = new RegExp('.*'+query+'.*','i');

  if(Session.get('startDate')) q.start = { $gte: Session.get('startDate'), };
  if(Session.get('toDate')) q.stop = { $lte: Session.get('toDate'), };
  // dbTracks.local.find().forEach(function(doc) {
  //   console.log(doc);
  // })
  console.log(q,dbTracks.find(q).fetch());
  return dbTracks.find(q,{
    sort: {start:-1},
  });
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
function getJSON() {
  let tracks = getTracks();
  let arr = [];
  tracks.forEach(function(docOriginal) {
    let doc = docOriginal._;
    delete doc.groupId;
    delete doc.owner;
    delete doc.groupUsers;
    delete doc.groupAdmins;
    delete doc._id;
    delete doc.encrypted;
    arr.push(doc);
  });
  return arr;
}
Template.tracks.helpers({
  tracks() {
    let tracks = getTracks();
    Session.set('query',this.otherData);
    let i = Template.instance();
    let d = _.reduce(
      tracks.map(function(doc) { return doc.duration(false).asMilliseconds(); }),
      function(memo,num) { return memo+num; },
      0
    );
    let tDuration = moment(d).format('HH:mm');
    if(!i.totalDuration) i.totalDuration = new ReactiveVar(tDuration);
    else i.totalDuration.set(tDuration);
    console.log(tracks.fetch());
    return tracks;
  },
  startDate() {
    let d = Session.get('startDate');
    if(d) return moment(d).format('DD.MM.YY');
  },
  stopDate() {
    let d = Session.get('toDate');
    if(d) return moment(d).format('DD.MM.YY');
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
  totalDuration() {
    let totalDuration = Template.instance().totalDuration;
    if(totalDuration) return totalDuration.get();
  }
});
Template.tracks.events({
  'blur .from'(e,i) {
    let v = e.target.value;
    if(v=="") Session.set('startDate',undefined);
    else Session.set('startDate',moment(v,["DD.MM.YY","DD.MM.YY HH:mm"]).toDate());
  },
  'blur .till'(e,i) {
    let v = e.target.value;

    if(v=="") Session.set('toDate',undefined);
    else Session.set('toDate',moment(v,["DD.MM.YY","DD.MM.YY HH:mm"]).toDate());
  },
  'click .csvDownload'(e,i) {
    let content = getCSV();
    // console.log(content);
    var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    saveAs(blob,'tracks.csv');
  },
  'click .jsonDownload'(e,i) {
    let content = JSON.stringify(getJSON());
    // console.log(content);
    var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    saveAs(blob,'tracks.json');
  },
});
