var today = function() {
	var date = new Date();
	date.setUTCHours(0,0,0,0);
	return date;
};

var getMonthString = function(monthIndex) {
	switch(monthIndex) {
		case 0: return "Jan"
		case 1: return "Feb"
		case 2: return "Mar"
		case 3: return "Apr"
		case 4: return "May"
		case 5: return "Jun"
		case 6: return "Jul"
		case 7: return "Aug"
		case 8: return "Sept"
		case 9: return "Oct"
		case 10: return "Nov"
		case 11: return "Dec"
		default: return "Error"
	}
};

Template.adminOverview.helpers({
	usersTotal: function () {
		return Meteor.users.find().count();
	},
	productsTotal: function () {
		return Products.find().count();
	},
	locsTotal: function () {
		return Locations.find().count();
	},
	volsTotal: function () {
		return Volunteers.find().count();
	},
	visitorsTotal: function () {
		return Visitors.find().count();
	},
});

Template.adminThisMonthOverview.helpers({
	volHoursTotal: function () {
		var date = new Date();
		var month = date.getMonth();
		var year = date.getFullYear();
		var start = new Date(year, month, 1);
		var end = new Date(year, month+1, 1);
		var volTimes = VolunteerTimecards.find({timeOpened: {$gte: start, $lt: end}}).fetch();
		var totalHours = 0;
		volTimes.forEach(function(timecard) {
			if(timecard.tcStatus === "Closed") {
				var hours = timecard.timeClosed - timecard.timeOpened;
				totalHours += hours;
			}
		});
		return totalHours;
	},
	visitorsTotal: function () {
		var date = new Date();
		var month = date.getMonth();
		var year = date.getFullYear();
		var start = new Date(year, month, 1);
		var end = new Date(year, month+1, 1);
		var visitors = Visitors.find({date: {$gte: start, $lt: end}}).fetch();
		var total = 0;
		visitors.forEach(function(visit) {
			total += (visit.numChildren + visit.numAdults + visit.numSeniors);
		});
		return total;
	},
	thismonth: function() {
		month = new Date().getMonth();
		return getMonthString(month);
	},
});

Template.adminLastMonthOverview.helpers({
	volHoursTotal: function () {
		var date = new Date();
		var month = date.getMonth();
		var year = date.getFullYear();
		if(month === 0) {
			month = 11;
			year -= 1;
		}
		else {
			month -= 1;
		}
		var start = new Date(year, month, 1);
		var end = new Date(year, month+1, 1);
		var volTimes = VolunteerTimecards.find({timeOpened: {$gte: start, $lt: end}}).fetch();
		var totalHours = 0;
		volTimes.forEach(function(timecard) {
			if(timecard.tcStatus === "Closed") {
				var hours = timecard.timeClosed - timecard.timeOpened;
				totalHours += hours;
			}
		});
		return totalHours;
	},
	visitorsTotal: function () {
		var date = new Date();
		var month = date.getMonth();
		var year = date.getFullYear();
		if(month === 0) {
			month = 11;
			year -= 1;
		}
		else {
			month -= 1;
		}
		var start = new Date(year, month, 1);
		var end = new Date(year, month+1, 1);
		var visitors = Visitors.find({date: {$gte: start, $lt: end}}).fetch();
		var total = 0;
		visitors.forEach(function(visit) {
			total += (visit.numChildren + visit.numAdults + visit.numSeniors);
		});
		return total;
	},
	lastmonth: function() {
		month = new Date().getMonth();
		if(month === 0) {
			month = 11;
		}
		else {
			month -= 1;
		}
		return getMonthString(month);
	},
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
		filter = Session.get("volunteersFilter");
		if(!!filter)
			return Volunteers.find({'lastname': {$regex: filter, $options: 'i'}}, {sort: {lastname:1, firstname:1}})
		else
			return Volunteers.find({}, {sort: {lastname:1, firstname:1}})
	},
	displaydate: function(date) {
		return moment.utc(date).format("LL");
	},
	searchFilter: function() {
		return Session.get("volunteersFilter");
	},
});

Template.volunteersAdmin.events({
	'keyup .search-input-filter': function(event, template) {
        setVolunteersFilter(template);
        return false;
    },
    'click .glyphicon-trash': function(event, template) {
		Session.set('volunteerInScope', this);
    },

    'click .glyphicon-info-sign': function(event, template) {
		Session.set('volunteerInScope', this);
    },

    'click .glyphicon-pencil': function(event, template) {
		Session.set('volunteerInScope', this);
    },
});

// search no more than 2 times per second
var setVolunteersFilter = _.throttle(function(template) {
	var search = template.find(".search-input-filter").value;
	Session.set("volunteersFilter", search);
}, 500);


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

var adminHelpers = {
	requests: function() {
		filter = Session.get("productsFilter");
		if(!!filter)
			return Requests.find({'itemname': {$regex: filter, $options: 'i'}}, {sort: {date: -1, itemname:1}})
		else
			return Requests.find({}, {sort: {date: -1, itemname:1}})
	},
	harvestlogs: function() {
		filter = Session.get("productsFilter");
		if(!!filter)
			return HarvestLog.find({'itemname': {$regex: filter, $options: 'i'}}, {sort: {date: -1, itemname:1}})
		else
			return HarvestLog.find({}, {sort: {date: -1, itemname:1}})
	},
	visitors: function(template) {
		filter = Session.get("visitorsFilter");
		if(!!filter)
			return Visitors.find({'visitType': {$regex: filter, $options: 'i'}}, {sort: {date:-1, visitType:1}});
		else
			return Visitors.find({}, {sort: {date:-1, visitType:1}});
	},
	visittypes: function(template) {
		return VisitTypes.find({}, {sort: {title:1}});
	},
	displaydate: function(date) {
		return moment.utc(date).format("LL");
	},
	searchFilter: function() {
		return Session.get("productsFilter");
	},
	isToday: function(template) {
		var start = today();
		var end = new Date(start);
		end.setUTCHours(24);
		return this.date >= start && this.date < end;
	},
	colorIfIsToday: function(template) {
		var start = today();
		var end = new Date(start);
		end.setUTCHours(24);
		if(this.date >= start && this.date < end) {
			return "color:green; font-weight:bold;";
		}
		return "";
	},
};


// REQUESTS
Template.requestsAdmin.helpers(
	adminHelpers
);

Template.requestsAdmin.events(
	adminEvents
);

// HARVESTS
Template.harvestAdmin.helpers(
	adminHelpers
);

Template.harvestAdmin.events(
	adminEvents
);


// VISITORS
Template.visitorsAdmin.helpers(
	adminHelpers
);

Template.visitorsAdmin.events({
	'keyup .search-input-filter': function(event, template) {
        setVisitorsFilter(template);
        return false;
    },
    'click .glyphicon-trash': function(event, template) {
		Session.set('itemInScope', this);
    },
    'click .glyphicon-pencil': function(event, template) {
		Session.set('itemInScope', this);
    },
});

// search no more than 2 times per second
var setVisitorsFilter = _.throttle(function(template) {
	var search = template.find(".search-input-filter").value;
	Session.set("visitorsFilter", search);
}, 500);

// VISIT TYPES
Template.visitTypesAdmin.helpers(
	adminHelpers
);

Template.visitTypesAdmin.events({
	'click .glyphicon-trash': function(event, template) {
		Session.set('itemInScope', this);
    },
    'click .glyphicon-pencil': function(event, template) {
		Session.set('itemInScope', this);
    },
});
