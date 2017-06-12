import './new.html'
import { dbTracks } from '../../../api/db/db.js'

import '../../css/clockpicker.css'

Template.new.onCreated(function() {
  // this.now = new ReactiveVar();

});
Template.new.onRendered(function() {
  this.$('.searchit').val('');
  this.$('.clockpicker').clockpicker({
    donetext: 'Fertig',
    vibrate: true,
  });
  // this.$('.title').focus();
});

Template.new.helpers({
  newTracker() {
    let trackId = this.otherData;
    if (trackId) return dbTracks.findOne({ _id: trackId });
    else return dbTracks.new(function() {
      let i = Template.instance();
      i.find('.title').value='';
    });
  },
  time() {
    // console.log(this);
    let i = Template.instance();
    if (!i.now) i.now = new ReactiveVar();
    let nowVar = i.now;
    if (!this.stop)
      setTimeout(function() {
        // console.log("jo");
        nowVar.set(new Date());
      }, 1 * 1000);
    nowVar.get(); //for refresh...

    return this.duration('HH:mm:ss');
  },
  startDisabled() {
    if (this.start) return 'disabled';
  },
  stopDisabled() {
    if (!this.start || this.stop) return 'disabled';
  },
  isTrackReady() {
    return this.start && this.stop && this.title != "";
  },
});

Template.new.events({
  'click .start' (e, i) {
    this.timerStart();
  },
  'click .stop' (e, i) {
    this.timerStop();
  },
  'click .remove' (e, i) {
    this.remove();
    Router.go('new');
  },
  'focus .clockpicker' (e, i) {
    e.preventDefault();
  },
  'blur .title' (e, i) {
    this.title = e.target.value;
  },
  'blur .desc' (e, i) {
    this.desc = e.target.value;
  },
  'blur .from' (e, i) {
    setTimeout(() => {
      let date = i.find('#fromDate');
      this.start = moment(date.value+e.target.value,'DD.MM.YYHH:mm').toDate();
    }, 500);
  },
  'blur .till' (e, i) {
    setTimeout(() => {
      let date = i.find('#tillDate');
      this.stop = moment(date.value+e.target.value,'DD.MM.YYHH:mm').toDate();
    }, 500);
  },
  'blur .fromDate' (e, i) {
    let time = i.find('#from');
    this.start = moment(e.target.value+time.value,'DD.MM.YYHH:mm').toDate();
  },
  'blur .tillDate' (e, i) {
    let time = i.find('#till');
    this.stop = moment(e.target.value+time.value,'DD.MM.YYHH:mm').toDate();
  },
})
