import './app.html'

import '../components/tracks/tracks.js'
import '../components/new/new.js'

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
  // getTemplate() {
  //   // return this.remplate;
  //   console.log(this)
  //   console.log(Iron.controller().state.get('template'));
  //   return Iron.controller().state.get('template');
  // }
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
