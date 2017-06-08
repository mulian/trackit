import './new.html'
import {dbTracks} from '../../../api/db/db.js'

Template.new.onCreated(function() {
  // this.now = new ReactiveVar();
  $('.searchit').val('');
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
})
