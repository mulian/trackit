import Main from './main.js'

export default
class DBTracks extends Main {
  constructor(Tracks) {
    super('tracks',Tracks);
  }
  new() {
    let already = this.findOne({
      $or: [
        {title: "",},
        {stop: undefined,}
      ],
    });
    if(already) return already;
    else {
      let n = new this.obj(this);
      let value = n.insert();
      return this.findOne({_id:value});
    }
  }
}
