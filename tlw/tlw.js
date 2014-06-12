if (Meteor.isClient) {
  Meteor.startup(function () {
  	  Hooks.init({treatCloseAsLogout: true});
  });

  Hooks.onLoggedIn = function() {
  	  u = Meteor.user();
  	  if (u !== undefined) {
  	  	  console.log("user logged in:");
  	  	  console.log(Meteor.user());
	  }
  }

  /*
  Template.hello.greeting = function () {
    return "Welcome to tlw.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.reqboard.mktrequests = function () {
  	  return Requests.find();
  };
  */

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Requests.find().count() === 0) {
    	Requests.insert({itemname: "ok", amount: 500});
	}
  });

  /*
  Hooks.onLoggedOut = function (userId) {
  	  var u = Meteor.users.findOne({_id: userId});
  	  if (u) {
  	  	  console.log('logged out user: ' + userId);
  	  	  console.log('number of login tokens: ' + u.services.resume.loginTokens.length);
	  }
  }
  */

  /*
  Hooks.onCloseSession = function (userId) {
  	  console.log("wow, a thing");
  	  Meteor.logout();
  }
  */
}
