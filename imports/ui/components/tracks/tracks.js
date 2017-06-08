import {dbTracks} from '../../../api/db/db.js'
import './tracks.html'

Template.tracks.helpers({
  tracks() {
    let query = this.otherData;
    if(query==undefined) query='';
    let exp = new RegExp('.*'+query+'.*','i');
    return dbTracks.find({
      stop: {$not:undefined},
      title: {
        $not:"",
        $regex: exp,
      },
    },{
      sort: {created:-1},
    });
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
