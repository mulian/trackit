import MainObj from './main-obj.js'

export default
class Track extends MainObj {
  constructor(collection,doc={}) {
    super(collection,_.defaults(doc,{
      start: undefined,
      stop: undefined,
      title: "",
      desc:"",
    }));
  }


  timerStart() {
    this.start = new Date();
  }
  timerStop() {
    this.stop = new Date();
  }

  duration(format='HH:mm:ss') {
    if(this.start) {
      let stop = this.stop?moment(this.stop):moment();
      let start = moment(this.start);
      let diff = moment.duration(stop.diff(start));
      diff.subtract(1,'hours');
      // console.log(moment(diff.asMilliseconds()).format('HH:mm:ss'));
      return moment(diff.asMilliseconds()).format(format);
    }
  }
}
