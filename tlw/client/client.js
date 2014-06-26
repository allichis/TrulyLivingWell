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

// LOCATIONS
Template.locationsAdmin.helpers({
	locations: function() {
		return Locations.find({}, {sort: {name:1}});
	},

});

Template.locationsAdmin.events({

	'click .glyphicon-trash': function(event, template) {
		Session.set('locationInScope', this);
    },

    'click .glyphicon-info-sign': function(event, template) {
		Session.set('locationInScope', this);
    },

    'click .glyphicon-pencil': function(event, template) {
		Session.set('locationInScope', this);
    },

    'click #btn-addlocation': function(event, template) {
    	var locationname = template.find("#input-locationname").value;
		Meteor.call('insertLocation', locationname, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
		});
		template.find("#input-locationname").value = "";
    }
})

// VOLUNTEERS
Template.volunteersAdmin.helpers({
	volunteers: function() {
		return Volunteers.find();
	}
});

// REQUESTS
Template.requestsAdmin.helpers({
	requests: function() {
		return Requests.find();
	}
});

// PRODUCTS
Template.productsAdmin.helpers({
	products: function() {
		filter = Session.get("productsFilter");
		if(!!filter)
			return Products.find({'itemname': {$regex: filter, $options: 'i'}}, {sort: {itemname:1}})
		else
			return Products.find({}, {sort: {itemname:1}})
	},

	searchFilter: function() {
		return Session.get("productsFilter");
	},
});

Template.productsAdmin.events({

    'keyup .search-input-filter': function(event, template) {
        setProductsFilter(template);
        return false;
    },

    'click .glyphicon-trash': function(event, template) {
		Session.set('productInScope', this);
    },

    'click .glyphicon-info-sign': function(event, template) {
		Session.set('productInScope', this);
    },

    'click .glyphicon-pencil': function(event, template) {
		Session.set('productInScope', this);
    },

    'click #btn-addproduct': function(event, template) {
    	var productname = template.find("#input-productname").value;
		Meteor.call('insertProduct', productname, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
		});
		template.find("#input-productname").value = "";
    }
});


// search no more than 2 times per second
var setProductsFilter = _.throttle(function(template) {
	var search = template.find(".search-input-filter").value;
	Session.set("productsFilter", search);
}, 500);

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
