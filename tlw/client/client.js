Meteor.startup(function () {
	// event-hooks' 'treatCloseAsLogout' does not seem to 
	// be doing anything rn...
	Hooks.init({treatCloseAsLogout: true});

	// config settings for accounts-entry
	AccountsEntry.config({
		dashboardRoute: '/dashboard'
	});
});

AutoForm.hooks({
	insertVolunteer: {
		onSuccess: function () {
			// redirect to volunteer page...
			Alerts.add('Thanks for signing up to volunteer!', 'success');
			console.log("form submit success...");
			Router.go('volunteer');
			return false;
		}
	}
});

Meteor.subscribe("allProducts");
Meteor.subscribe("locations");
Meteor.subscribe("volunteers");
Meteor.subscribe("visitors");
Meteor.subscribe("requests");
Meteor.subscribe("harvests");
Meteor.subscribe("visittypes");
Meteor.subscribe("tours");
Meteor.subscribe("touraddons");

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
