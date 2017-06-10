// import '../api/db/db.js'
import './router.js'

Meteor.startup(() => {
  navigator.serviceWorker.register('/sw.js')
    .then().catch((err) =>
      console.log('ServiceWorker registration failed: ', err)
    );

  // window.addEventListener('online',function(e) {
  //   // console.log("Already subscribed: ",window.subscribed);
  //   if(!window.subscribed) {
  //     console.log("load subscribers!");
  //     // window.subscribed();
  //     Meteor.subscribe('db_tracks');
  //     window.subscribed = true;
  //   } else {
  //     console.log("nothing to load");
  //   }
  // });
});
