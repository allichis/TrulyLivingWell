if (Meteor.isClient) {
	Meteor.startup(function () {
		// event-hooks' 'treatCloseAsLogout' does not seem to 
		// be doing anything rn...
		Hooks.init({treatCloseAsLogout: true});

		// config settings for accounts-entry
		AccountsEntry.config({
			dashboardRoute: '/dashboard'
		});
	});

	// do something any time a user logs in...
	Hooks.onLoggedIn = function() {
		u = Meteor.user();
		if (u !== undefined) {
			console.log("user logged in:");
			console.log(Meteor.user());
		}
	}

	Template.navbar.helpers({
		activeIfTemplateIs: function (template) {
			var currentRoute = Router.current();
			return currentRoute &&
				template === currentRoute.lookupTemplate() ? 'active' : '';
		}
	});

	Template.navAdmin.helpers({
		activeIfTemplateIs: function (template) {
			var currentRoute = Router.current();
			return currentRoute &&
				template === currentRoute.lookupTemplate() ? 'active' : '';
		}
	});

	// this is for accounts-admin-ui-bootstrap-3:
	Template.admin.helpers({
		// check if user is an admin
		isAdminUser: function() {
			return Roles.userIsInRole(Meteor.user(), ['admin']);
		}
	});

	Template.locationsAdmin.helpers({
		locations: function() {
			return Locations.find();
		}
	});

	Template.volunteersAdmin.helpers({
		volunteers: function() {
			return Volunteers.find();
		}
	});

	Template.requestsAdmin.helpers({
		requests: function() {
			return Requests.find();
		}
	});

	// need a generic kind of template helper...
	// since we'll want to fetch/display all the documents
	// for most Collections via the admin interface
	
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
		// add some records to the Requests collection:
		if (Requests.find().count() === 0) {
			Requests.insert({itemname: "Apples", amount: 500});
			Requests.insert({itemname: "Broccoli", amount: 200});
			Requests.insert({itemname: "Canteloupe", amount: 30});
		}

		// for accounts-admin-ui-bootstrap-3:
		// bootstrap the admin user if they exist
		if (Meteor.users.findOne("vxGz3xxv3FpnR5aPs"))
			Roles.addUsersToRoles("vxGz3xxv3FpnR5aPs", ['admin']);

		// create a couple of roles if they don't already exist
		// (not required, just optional/demo)
		if (!Meteor.roles.findOne({name: "staff"}))
			Roles.createRole("staff");
		// etc...
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
