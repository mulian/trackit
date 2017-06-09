import './new.html'
import {dbTracks} from '../../../api/db/db.js'

import '../../css/clockpicker.css'

Template.new.onCreated(function() {
  // this.now = new ReactiveVar();

});
Template.new.onRendered(function() {
  this.$('.searchit').val('');
  this.$('.clockpicker').clockpicker();
});

Template.new.helpers({
  newTracker() {
    let trackId = this.otherData;
    if(trackId) return dbTracks.findOne({_id:trackId});
    else return dbTracks.new();
  },
  time() {
    // console.log(this);
    let i = Template.instance();
    if(!i.now) i.now = new ReactiveVar();
    let nowVar = i.now;
    if(!this.stop)
      setTimeout(function() {
        // console.log("jo");
        nowVar.set(new Date());
      },1*1000);
    nowVar.get(); //for refresh...

    return this.duration('HH:mm:ss');
  },
  startDisabled() {
    if(this.start) return 'disabled';
  },
  stopDisabled() {
    if(!this.start || this.stop) return 'disabled';
  },
  isTrackReady() {
    return this.start && this.stop && this.title!="";
  }
});

Template.new.events({
  'click .start'(e,i) {
    this.timerStart();
  },
  'click .stop'(e,i) {
    this.timerStop();
  },
  'blur .title'(e,i) {
    this.title = e.target.value;
  },
  'blur .desc'(e,i) {
    this.desc = e.target.value;
  },
  'blur .from'(e,i) {
    setTimeout(() => {
      this.start = this.parseHourMin(e.target.value).toDate();
    },500);
  },
  'blur .till'(e,i) {
    setTimeout(() => {
      this.stop = this.parseHourMin(e.target.value).toDate();
    },500);
  },
})
