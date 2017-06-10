import './app.html'

import '../components/tracks/tracks.js'
import '../components/new/new.js'
import '../components/calendar/calendar.js'

import {dbTracks} from '../../api/db/db.js'

//Hook to only close the Drawer
MaterialLayout.prototype.closeDrawer = function () {
    var drawerButton = this.element_.querySelector('.' + this.CssClasses_.DRAWER_BTN);
    this.drawer_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
    this.obfuscator_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
    if (!this.drawer_.classList.contains(this.CssClasses_.IS_DRAWER_OPEN)) {
        this.drawer_.setAttribute('aria-hidden','true');
        drawerButton.setAttribute('aria-expanded','false');
    }
};

Template.app.onRendered(function() {
  $('.mdl-navigation__link.menu-close').click(() => {
    document.querySelector('.mdl-layout').MaterialLayout.closeDrawer()
  });
  $('.searchit').keyup((e) => {
    if(e.keyCode==13) {
      // Session.set('search',e.target.value);
      Router.go('tracks',undefined,{query:{q:e.target.value}});
    }
  });
});

Template.app.helpers({
  isSelected(route) {
    // console.log(this,route);
    if(this.template==route) return 'mdl-color-text--primary';
    // console.log(this);
  },
  current() {
    let track = dbTracks.new();
    // console.log(track);
    return track;
  },
  isStarted() {
    return this.start&&!this.stop;
  },
  currentDuration() {
    // console.log(this);

    let i = Template.instance();
    if(!i.now) i.now = new ReactiveVar();
    let nowVar = i.now;
    if(this && this.start)
      setTimeout(function() {
        // console.log("jo");
        nowVar.set(new Date());
      },1*1000);
    nowVar.get(); //for refresh...

    // console.log(this);
    return this.duration('HH:mm:ss');
  },
});

// Template.app.events({
//   'click .mdl-navigation__link.menu-close'(e,i) {
//     console.log("jo");
//   },
//   'keyup .searchit'(e,i) {
//     console.log("jo");
//     // console.log("jo",e.target.value);
//   },
// });
