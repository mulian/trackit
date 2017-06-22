import './app.html'
import './app.sass'

import '../components/tracks/tracks.js'
import '../components/new/new.js'
import '../components/calendar/calendar.js'
import '../components/label-controll/label-controll.js'

import { dbTracks } from '../../api/db/db.js'

//Hook to only close the Drawer
MaterialLayout.prototype.closeDrawer = function() {
  var drawerButton = this.element_.querySelector('.' + this.CssClasses_.DRAWER_BTN);
  this.drawer_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
  this.obfuscator_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
  if (!this.drawer_.classList.contains(this.CssClasses_.IS_DRAWER_OPEN)) {
    this.drawer_.setAttribute('aria-hidden', 'true');
    drawerButton.setAttribute('aria-expanded', 'false');
  }
};
function rebind() {
  Meteor.setTimeout(function() {
    bind(); //Thanks to mdl workaround
  },500);
}
function bind() {
  $('.stopTimer').click(function(e) {
    let track = dbTracks.new();
    console.log(track);
    track.timerStop();
    if(!track.title || track.title=="") Router.go('new');
    rebind();
  });
  $('.startTimer').click(function(e) {
    let track = dbTracks.new();
    if(track.stop) {
      Router.go('new');
    } else {
      track.timerStart();
    }
    rebind();
  });
  $('.mdl-navigation__link.menu-close').click(() => {
    document.querySelector('.mdl-layout').MaterialLayout.closeDrawer()
    rebind();
  });
}
Template.app.onRendered(function() {
  console.log("hier1");
  $('.searchit').keyup((e) => {
    if (e.keyCode == 13) {
      // Session.set('search',e.target.value);
      Router.go('tracks', undefined, { query: { q: e.target.value } });
    }
  });
  bind();

});

Template.app.helpers({
  isSelected(route) {
    // console.log(this,route);
    if (this.template == route) return 'mdl-color-text--primary';
    // console.log(this);
  },
  current() {
    let track = dbTracks.new();
    // console.log(track);
    return track;
  },
  isStarted() {
    return this.start && !this.stop;
  },
  currentDuration() {
    // console.log(this);

    let i = Template.instance();
    if (!i.now) i.now = new ReactiveVar();
    let nowVar = i.now;
    if (this && this.start)
      setTimeout(function() {
        // console.log("jo");
        nowVar.set(new Date());
      }, 1 * 1000);
    nowVar.get(); //for refresh...

    // console.log(this);
    return this.duration('HH:mm:ss');
  },
});

// Dosnt work, mdl will modify the html and the meteormapping is not present
// Template.app.events({});
