import { dbTracks, dbLabels } from '../../../api/db/db.js'
import './tracks.html'

// let dialogDate,dialogTime;
// Template.tracks.onRendered(function() {
// });
let once = true;

function getTracks() {
  let q = {
    stop: { $not: undefined },
    title: {
      $not: "",
    },
  };

  // let query = Session.get('query'), regex;
  // if(query && query!='') q._.title.$regex = new RegExp('.*'+query+'.*','i');
  if (Session.get('filterLabel')) q.label = Session.get('filterLabel');
  if (Session.get('startDate')) q.start = { $gte: Session.get('startDate'), };
  if (Session.get('toDate')) q.stop = { $lte: Session.get('toDate'), };
  // dbTracks.local.find().forEach(function(doc) {
  //   console.log(doc);
  // })
  // console.log(q,dbTracks.find(q).fetch());
  if (snackbarContainer && once) {
    snackbarContainer.MaterialSnackbar.showSnackbar({
      message: 'Currently there is an table bug, maybe you have to refresh this page.',
      timeout: 3000,
    });
    once = false;
  }
  return dbTracks.find(q, {
    sort: { start: -1 },
  });
}
let withoutColumns = ['_id', 'owner'];

function getCSV(withTitle = true) {
  let tracks = getTracks();
  let str = "";
  let title = "";
  let once = true;
  tracks.forEach(function(docOriginal) {
    let doc = docOriginal._;
    if (once && withTitle) {
      for (item in doc) {
        if (!_.contains(withoutColumns, item))
          title +=
          String(item.charAt(0)).toUpperCase() + item.slice(1) + ';';
      }
      title += '\n';
      once = false;
    }
    for (item in doc) {
      // console.log(item);
      if (!_.contains(withoutColumns, item)) {
        let tmp = "";
        if (doc[item] instanceof Date) tmp = moment(doc[item]).format('DD.MM.YY HH:MM:ss');
        else tmp = doc[item];
        str += '"' + tmp + '";'
      }
    }
    str += '\n';
  });
  return title + str;
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
let snackbarContainer;
Template.tracks.onRendered(function() {
  snackbarContainer = document.querySelector('#demo-snackbar-example');
});
Template.tracks.helpers({
  tracks() {
    let tracks = getTracks();
    Session.set('query', this.otherData);
    let i = Template.instance();
    let d = _.reduce(
      tracks.map(function(doc) { console.log(doc.duration(false).asSeconds()); return doc.duration(false).asSeconds(); }),
      function(memo, num) { return memo + num; },
      0
    );
    // console.log(d);
    var hours = parseInt(d / 3600) % 24;
    var minutes = parseInt(d / 60) % 60;
    var seconds = d % 60;
    let mom = moment.utc(d);
    // mom.add(1,'h');
    // let tDuration = mom.format('HH:mm:ss');
    var tDuration = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + Math.round(seconds) : Math.round(seconds));
    // if(!i.totalDuration) i.totalDuration = new ReactiveVar(tDuration);
    // else i.totalDuration.set(tDuration);
    Session.set('totalDuration', tDuration);

    return tracks;
  },
  startDate() {
    let d = Session.get('startDate');
    if (d) return moment(d).format('DD.MM.YY');
  },
  stopDate() {
    let d = Session.get('toDate');
    if (d) return moment(d).format('DD.MM.YY');
  },
  duration() {
    let nowVar = Template.instance().now;
    let start = moment(this.start);
    let diff;
    let stop = moment(this.stop);
    diff = moment.duration(stop.diff(start));
    diff.subtract(1, 'hours');
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
    return Session.get('totalDuration');
    // let totalDuration = Template.instance().totalDuration;
    // if(totalDuration) return totalDuration.get();
    // else return 'jo';
  },
});
Template.tracks.events({
  'click .csvDownload' (e, i) {
    let content = getCSV();
    // console.log(content);
    var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, 'tracks.csv');
  },
  'click .jsonDownload' (e, i) {
    let content = JSON.stringify(getJSON());
    // console.log(content);
    var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, 'tracks.json');
  },

});

Template.filter.helpers({
  getLabels() {
    return dbLabels.find();
  },
  getFilterLabel() {
    let i = Template.instance();
    if (Session.get('filterLabel')) {
      return dbLabels.findOne({ _id: Session.get('filterLabel') });
    }
  }
});
Template.filter.events({
  'click .list' (e, i) {
    let target = $(e.target);
    let val = $(target[0]).attr('value');
    if (val == 'clear') Session.set('filterLabel', undefined);
    else {
      infoCalendarAlso();
      Session.set('filterLabel', $(target[0]).attr('value'));
    }
  },
  'blur .from' (e, i) {
    let v = e.target.value;
    if (v == "") {
      infoCalendarAlso();
      Session.set('startDate', undefined);
    } else Session.set('startDate', moment(v, ["DD.MM.YY", "DD.MM.YY HH:mm"]).toDate());
  },
  'blur .till' (e, i) {
    let v = e.target.value;

    if (v == "") Session.set('toDate', undefined);
    else {
      infoCalendarAlso();
      Session.set('toDate', moment(v, ["DD.MM.YY", "DD.MM.YY HH:mm"]).toDate());
    }
  },
});

function infoCalendarAlso() {
  if (snackbarContainer) snackbarContainer.MaterialSnackbar.showSnackbar({
    message: 'Also the calendar is filtered now.',
    timeout: 3000,
  });
}
