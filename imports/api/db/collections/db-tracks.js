import Main from './main.js'

// import {dbLocalTracks} from '../db.js'

export default
class DBTracks extends Main {
  constructor(Tracks) {
    super('tracks',['desc','title'],Tracks);
  }
  getFullCalendar() {
    let q = {
      title: {$not:""},
      stop: {$not:undefined},
    };
    if(Session.get('filterLabel')) q.label = Session.get('filterLabel');
    if(Session.get('startDate')) q.start = { $gte: Session.get('startDate'), };
    if(Session.get('toDate')) q.stop = { $lte: Session.get('toDate'), };
    return this.find(q).map(function(doc) {
       let item = {
        id: doc._id,
        title: doc.title,
        start: moment(doc.start),
        end: moment(doc.stop),
      };
      if(doc.getLabel()) item.color = doc.getLabel().color;
      return item;
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
