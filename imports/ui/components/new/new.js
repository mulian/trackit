import './new.html'
import { dbTracks, dbLabels } from '../../../api/db/db.js'

import '../../css/clockpicker.css'
import 'mdl-select-component/mdl-selectfield.min.js'
import 'mdl-select-component/mdl-selectfield.min.css'

Template.new.onCreated(function() {
  // this.now = new ReactiveVar();

});
var snackbarContainer;
Template.new.onRendered(function() {
  this.$('.searchit').val('');
  this.$('.clockpicker').clockpicker({
    donetext: 'Fertig',
    vibrate: true,
  });
  // this.$('.title').focus();
  snackbarContainer = document.querySelector('#demo-snackbar-example');
});

let currentTrack;
Template.new.helpers({
  newTracker() {
    let trackId = this.otherData;
    if (trackId)
      currentTrack = dbTracks.findOne({ _id: trackId });
    else
      currentTrack = dbTracks.new(function() {
        let i = Template.instance();
        i.find('.title').value = '';
      });

    return currentTrack;
  },
  time() {
    // console.log(this);
    let i = Template.instance();
    if (!i.now) i.now = new ReactiveVar();
    let nowVar = i.now;
    if (!this.stop)
      setTimeout(function() {
        // console.log("jo");
        nowVar.set(new Date());
      }, 1 * 1000);
    nowVar.get(); //for refresh...

    return this.duration('HH:mm:ss');
  },
  startDisabled() {
    if (this.start) return 'disabled';
  },
  stopDisabled() {
    if (!this.start || this.stop) return 'disabled';
  },
  isTrackReady() {
    return this.start && this.stop && this.title != "";
  },

  getLabels() {
    return dbLabels.find();
  }
});

Template.new.events({
  'click .start' (e, i) {
    this.timerStart();
  },
  'click .stop' (e, i) {
    this.timerStop();
    if (!this.title || this.title == '') {
      var data = {
        message: 'Add a title for save this track!',
        timeout: 10000,
        // actionHandler: handler,
        // actionText: 'Undo'
      };
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
      $('#sample3').focus();
    }
  },
  'click .remove' (e, i) {
    this.remove();
    Router.go('new');
  },
  'focus .clockpicker' (e, i) {
    e.preventDefault();
  },
  'blur .title' (e, i) {
    this.title = e.target.value;
  },
  'blur .desc' (e, i) {
    this.desc = e.target.value;
  },
  'blur .from' (e, i) {
    setTimeout(() => {
      let date = i.find('#fromDate');
      this.start = moment(date.value + e.target.value, 'DD.MM.YYHH:mm').toDate();
    }, 500);
  },
  'blur .till' (e, i) {
    setTimeout(() => {
      let date = i.find('#tillDate');
      this.stop = moment(date.value + e.target.value, 'DD.MM.YYHH:mm').toDate();
    }, 500);
  },
  'blur .fromDate' (e, i) {
    let time = i.find('#from');
    this.start = moment(e.target.value + time.value, 'DD.MM.YYHH:mm').toDate();
  },
  'blur .tillDate' (e, i) {
    let time = i.find('#till');
    this.stop = moment(e.target.value + time.value, 'DD.MM.YYHH:mm').toDate();
  },
  'click .list' (e, i) {
    let target = $(e.target);
    if (target.hasClass('new')) {
      dialog.showModal();
    } else {
      this.label = $(target[0]).attr('labelId');
    }
  },
  'click .changeLabel'(e,i) {
    console.log($(e.target.parentElement.parentElement).attr('value'));
    editLabel.set($(e.target.parentElement.parentElement).attr('value'));
    dialog.showModal();
  },
});
let dialog,editLabel;
Template.newLabel.onCreated(function() {
  editLabel = new ReactiveVar();
});
Template.newLabel.onRendered(function() {
   dialog = this.find('dialog');
});
Template.newLabel.helpers({
  newLabelObj() {
    let label;
    if(editLabel.get()!=undefined) label=dbLabels.findOne({_id:editLabel.get()});
    else label=dbLabels.new();
    return label;
  },
  isNew() {
    return this._id?false:true;
  }
});
Template.newLabel.events({
  'click .removeLabel'(e,i) {
    if(currentTrack.label==this._id) currentTrack.label = undefined;
    this.remove();
    dialog.close();
  },
  'click .close'(e,i) {
    editLabel.set(undefined);
    dialog.close();
  },
  'click .create'(e,i) {
    if(!this.label)
      this.color = Template.instance().find('#colorpicker').value;
    if(!this._id) {
      currentTrack.label = this.insert();
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: 'New label inserted!',
        timeout: 3000,
      });
    }
    editLabel.set(undefined);
    dialog.close();
  },
  'change #colorpicker'(e,i) {
    this.color = e.target.value;
  },
  'blur #labelTitle'(e,i) {
    this.title = e.target.value;
  }
});
