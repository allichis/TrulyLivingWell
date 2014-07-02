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
		return Volunteers.find({}, {sort: {lastname:1, firstname:1}});
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


var adminEvents = {
	'click .glyphicon-trash': function(event, template) {
		Session.set('itemInScope', this);
    },
    'click .glyphicon-pencil': function(event, template) {
		Session.set('itemInScope', this);
    },
    'keyup .search-input-filter': function(event, template) {
        setProductsFilter(template);
        return false;
    },
};

// REQUESTS
Template.requestsAdmin.helpers({
	requests: function() {
		filter = Session.get("productsFilter");
		if(!!filter)
			return Requests.find({'itemname': {$regex: filter, $options: 'i'}}, {sort: {date: -1, itemname:1}})
		else
			return Requests.find({}, {sort: {date: -1, itemname:1}})
	},
	displaydate: function(date) {
		return moment.utc(date).format("LL");
	},

	searchFilter: function() {
		return Session.get("productsFilter");
	},
});

Template.requestsAdmin.events(
	adminEvents
);

// HARVESTS
Template.harvestAdmin.helpers({
	harvestlogs: function() {
		filter = Session.get("productsFilter");
		if(!!filter)
			return HarvestLog.find({'itemname': {$regex: filter, $options: 'i'}}, {sort: {date: -1, itemname:1}})
		else
			return HarvestLog.find({}, {sort: {date: -1, itemname:1}})
	},
	displaydate: function(date) {
		return moment.utc(date).format("LL");
	},
});

Template.harvestAdmin.events(
	adminEvents
);

