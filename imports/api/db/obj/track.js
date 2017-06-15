import MainObj from './main-obj.js'
import {dbLabels} from '../db.js'

export default
class Track extends MainObj {
  constructor(collection,doc={}) {
    super(collection,_.defaults(doc,{
      start: undefined,
      stop: undefined,
      title: "",
      desc:"",
      label: undefined,
    }));
  }

  getLabel() {
    if(this.label) return dbLabels.findOne({_id:this.label});
    else return undefined;//{title: ''};
  }

  insert(...args) {
    let tmp = this.collection().findOne({});
    if(!tmp) {
      this.insertSecure('track');
    } else {
      this.groupId = tmp.groupId;
      return super.insert.apply(this,args);
    }
  }

  timerStart() {
    this.start = new Date();
  }
  timerStop() {
    this.stop = new Date();
  }

  duration(format='D HH:MM:ss') {
    if(this.start) {
      let stop = this.stop?moment.utc(this.stop):moment.utc();
      let start = moment.utc(this.start);
      let diff = moment.duration(stop.diff(start));
      // diff.subtract(1,'hours');
      // console.log(moment(diff.asMilliseconds()).format('HH:MM:ss'));
      if(format==false) return diff;
      else return moment.utc(diff.asMilliseconds()).format(format);
    }
  }

  parseToTime(date,format="HH:MM") {
    // console.log(date,moment(date).format);
    // console.log(format);
    return moment(date).format(format);
  }
  parseHourMin(groundDate,setObj={}) {
    let timeSplit = str.split(':');
    let newTime = moment(this.start).set({
      hour: timeSplit[0],
      minute: timeSplit[1],
    });
    return newTime;
  }
  parseHourMin(str) {
    let timeSplit = str.split(':');
    let newTime = moment(this.start).set({
      hour: timeSplit[0],
      minute: timeSplit[1],
    });
    return newTime;
  }
}
