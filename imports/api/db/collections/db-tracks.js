import Main from './main.js'

export default
class DBTracks extends Main {
  constructor(Tracks) {
    super('tracks',Tracks);
  }
  getFullCalendar() {
    return this.find({
      title: {$not:""},
      stop: {$not:undefined},
    }).map(function(doc) {
      return {
        id: doc._id,
        title: doc.title,
        start: moment(doc.start),
        end: moment(doc.stop),
      }
    });
  }
  new(onNew) {
    let already = this.findOne({
      $or: [
        {title: "",},
        {stop: undefined,}
      ],
    });
    if(already) return already;
    else {
      if(onNew) onNew();
      let n = new this.obj(this);
      let value = n.insert();
      return this.findOne({_id:value});
    }
  }
}
