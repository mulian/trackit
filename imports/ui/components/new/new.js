import './new.html'
import {dbTracks} from '../../../api/db/db.js'

Template.new.onCreated(function() {
  this.now = new ReactiveVar();
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
    // console.log(moment);
    if(this.start) {
      let nowVar = Template.instance().now;
      let start = moment(this.start);
      let diff;
      if(!this.stop) {
        let now = moment(nowVar.get());
        setTimeout(function() {
          nowVar.set(new Date());
        },1*1000);

        diff = moment.duration(now.diff(start));
      } else if(this.stop) {
        let stop = moment(this.stop);
        diff = moment.duration(stop.diff(start));
      }
      diff.subtract(1,'hours');
      // console.log(moment(diff.asMilliseconds()).format('HH:mm:ss'));
      return moment(diff.asMilliseconds()).format('HH:mm:ss');
    }
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
