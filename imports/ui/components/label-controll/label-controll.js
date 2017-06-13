import './label-controll.html'

import { dbTracks , dbLabels } from '../../../api/db/db.js'

Template.labels.helpers({
  labels() {
    dbLabels.find();
  }
});
