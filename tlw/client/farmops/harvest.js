var today = function() {
	var date = new Date();
	date.setUTCHours(0,0,0,0);
	return date;
};

var dateHelpers = {
	displaydate: function(date) {
		return moment.utc(date).format("LL");
	},
	today: function() {
		var date = new Date();
		date.setUTCHours(0,0,0,0);
		return date;
	}
};

var optionsHelpers = {
	productOptions: function() {
	    var options = [];
	    var products = Products.find({}, {sort: {itemname:1}}).fetch();
	    for(i=0; i<products.length; i++){
	    	var itemname = products[i].itemname;
	    	options.push({label: itemname, value: itemname})
	    }
	    return options;
	},
	locationOptions: function() {
	    var options = [];
	    var locations = Locations.find().fetch();
	    for(i=0; i<locations.length; i++){
	    	var locname = locations[i].name;
	    	options.push({label: locname, value: locname})
	    }
	    return options;
	},
};

var harvestHelpers = {
	todayrequests: function() {
		var start = today();
		var end = new Date(start);
		end.setUTCHours(24);
		return Requests.find({date: {$gte: start, $lt: end}}, {sort: {itemname:1}});
	},
	futurerequests: function() {
		var start = today();
		var end = new Date(start);
		end.setUTCHours(24);
		return Requests.find({date: {$gte: end}}, {sort: {date:1, itemname:1}});
	},
	requests: function() {
		return Requests.find({}, {sort: {date:1, itemname:1}});
	},
	harvestlog: function() {
		return HarvestLog.find({}, {sort: {date:-1, itemname:1}});
	},
	todayharvestlog: function() {
		var start = today();
		var end = new Date(start);
		end.setUTCHours(24);
		return HarvestLog.find({date: {$gte: start, $lt: end}}, {sort: {itemname:1}});
	},
	displaydate: function(date) {
		return moment.utc(date).format("LL");
	},
};

var modalHelpers = {
	itemInScope: function() {
		return Session.get('itemInScope');
	},
	displaydate: function(date) {
		return moment.utc(date).format("LL");
	},
};

var clickEvents = {
	'click .glyphicon-trash': function(event, template) {
		Session.set('itemInScope', this);
    },
    'click .glyphicon-pencil': function(event, template) {
		Session.set('itemInScope', this);
    },
};

Template.insertRequestModalInner.rendered = function() {
    $('.datetimepicker').datetimepicker({
    	pickTime: false,
    	showToday: true,
    });
};

// HARVEST REQUESTS

Template.insertRequestModalInner.helpers(
	optionsHelpers
);

Template.displayRequests.helpers(
	harvestHelpers
);

Template.displayRequests.events(
	clickEvents
);

Template.deleteRequestModalInner.helpers(
	modalHelpers
);

Template.deleteRequestModalInner.events({
	'click .btn-danger': function(event, template) {
		Meteor.call('deleteRequest', this._id, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
			$("#deleterequestitem").modal("hide");
		});
	}
});

Template.updateRequestModalInner.helpers(
	modalHelpers
);

Template.updateRequestModalInner.events({
	'click .btn-primary': function(event, template) {
		var itemid = this._id;
		var amount = template.find(".request-amount").value;
		var strip = template.find(".request-strip").value;
		var notes = template.find(".request-notes").value;

		Meteor.call('updateRequest', itemid, amount, strip, notes, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}

			$("#updaterequestitem").modal("hide");
		});

	}
});

Template.displayTodayRequests.helpers(
	harvestHelpers
);


// HARVEST LOG

Template.insertHarvestLogModalInner.helpers(
	optionsHelpers
);

Template.displayHarvestLog.helpers(
	harvestHelpers
);

Template.displayHarvestLog.events(
	clickEvents
);

Template.deleteHarvestItemModalInner.helpers(
	modalHelpers
);

Template.deleteHarvestItemModalInner.events({
	'click .btn-danger': function(event, template) {
		Meteor.call('deleteHarvestLogItem', this._id, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
			$("#deleteharvestitem").modal("hide");
		});
	}
});

Template.displayTodayHarvestLog.helpers(
	harvestHelpers
);
