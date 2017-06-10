// Accounts.createUser = _.wrap(Accounts.createUser, function(createUser) {
//   console.log("createUser");
//   // Store the original arguments
//   var args = _.toArray(arguments).slice(1),
//     user = args[0];
//   origCallback = args[1];
//
//   var newCallback = function(error) {
//     // do my stuff
//
//     origCallback.call(this, error);
//   };
//
//   createUser(user, newCallback);
// });
if(Meteor.isServer) {
  Accounts.onCreateUser(function(options, user) {
    // Todos.insert({
    //   owner: user._id,
    //   text: "First todo to cross off!",
    // });
    //
    // // We still want the default hook's 'profile' behavior.
    // if (options.profile)
    //   user.profile = options.profile;
    console.log("onCreate",options,user);
    SecureLayer.user.create(user);

    return user;
  });
} else {
  Accounts.onLogin(function(...args) {
    let usrObj = SecureLayer.DBUserKey.findOne({_id:Meteor.userId()});
    let pw = $('#at-field-password').val();
    SecureLayer.user.setPassword(pw);
    if(!usrObj) {
      SecureLayer.DBUserKey.create();
    }
  });
  // SecureLayer.user.setPassword(obj.password);
}
