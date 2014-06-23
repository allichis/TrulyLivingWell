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
