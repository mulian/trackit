import Main from './main.js'

import {dbTracks} from '../db.js'

export default
class DBLabels extends Main {
  constructor(Label) {
    super('label',['title'],Label);
  }

  new() {
    let track = dbTracks.findOne();
    let label = new this.obj(this);
    label.groupId = track.groupId;
    return label;
  }
}
