import '../api/db/db.js'
import '../ui/ui.js'

// import { dbProfile } from '../../api/db/db.js'

//Workaround for redirect with replaceState (5.6.17)
RouteController.prototype.redirect = function (routeOrPath, params, options) {
    options = options || {};
    if (!options.hasOwnProperty("replaceState")) {
        options.replaceState = true;
    }
    return this.router.go(routeOrPath, params, options);
};

function subscribers() {
  this.subscribe('db_tracks').wait();
}

/**
 *
 * Ist ein Helfer um für jede Route app, welcome oder loading anzuzeigen
 *
 * @param _this         Argument vom Router
 * @param template      Name des Templates
 * @param data          Daten die an das Template geschickt werden
 */
let isApp = false;
function loginActionWith(_this, appTemplate, welcomeTemplate,otherData) {
  if (_this.ready()) {
    if (Meteor.userId()) {
      _this.render('app',{
        data: {
          template: appTemplate,
          otherData: otherData,
        },
      });
    } else {
      if (welcomeTemplate == undefined) Router.go('/');
      _this.render('welcome',{
        data: {
          template: welcomeTemplate,
        },
      });
    }
  } else { _this.render('loading'); }
}
/* -----------------------------
 // Routen für globale Seiten
 ----------------------------- */

Router.route('/new', {
 name: 'new',
 subscriptions: subscribers,
 action: function() {
  //  this.state.set('trackId', undefined);
   loginActionWith(this, 'new', 'fullPageAtForm');
 },
});
Router.route('/show/:_id',{
  name: 'show',
  subscriptions: subscribers,
  action: function() {
    // this.state.set('trackId', this.params._id);
    loginActionWith(this, 'new', 'fullPageAtForm',this.params._id);
  },
});
Router.route('/tracks', {
  name: 'tracks',
  subscriptions: subscribers,
  action: function() {
    // this.state.set('taskID', undefined);
    // console.log(this.params);
    loginActionWith(this, 'tracks', 'fullPageAtForm',this.params.query.q);
  },
});
Router.route('/calendar', {
  name: 'calendar',
  subscriptions: subscribers,
  action: function() {
    // this.state.set('taskID', undefined);
    // console.log(this.params);
    loginActionWith(this, 'calendar', 'fullPageAtForm',this.params.query.q);
  },
});

Router.route('/', {
  name: 'default',
  subscriptions: subscribers,
  action: function() {
    // this.state.set('taskID', undefined);
    if (Meteor.userId()) this.redirect('tracks',undefined,{ replaceState: true }); //Goto timeline if logged in
    else loginActionWith(this, undefined, 'fullPageAtForm');
  },
});

Router.route('/logout', {
  name: 'logout',
  subscriptions: subscribers,
  action: function() {
    // this.state.set('taskID', undefined);
    Meteor.logout();
    this.redirect('/');
    // loginActionWith(this, 'logout', 'fullPageAtForm');
  },
});
