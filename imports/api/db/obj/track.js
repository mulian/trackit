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
}
