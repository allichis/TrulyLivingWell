var today = function() {
	var date = new Date();
	date.setUTCHours(0,0,0,0);
	return date;
};

var dateToDateString = function(date) {
  var m = (date.getMonth() + 1);
  if (m < 10) {
    m = "0" + m;
  }
  var d = date.getDate();
  if (d < 10) {
    d = "0" + d;
  }
  return date.getFullYear() + '/' + m + '/' + d;
};

var dateHelpers = {
	displaydate: function(date) {
		return moment.utc(date).format("LL");
	},
	today: function() {
		return today();
	},
	todayString: function() {
		return dateToDateString(today());
	},
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
	yesterdayrequests: function() {
		var start = today();
		start.setUTCHours(-24);
		var end = today();
		return Requests.find({date: {$gte: start, $lt: end}}, {sort: {date:1, itemname:1}});
	},
	tomorrowrequests: function() {
		var start = today();
		start.setUTCHours(24);
		var end = new Date(start);
		end.setUTCHours(24);
		return Requests.find({date: {$gte: start, $lt: end}}, {sort: {date:1, itemname:1}});
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

var modalHelpers = {
	itemInScope: function() {
		return Session.get('itemInScope');
	},
	displaydate: function(date) {
		return moment.utc(date).format("LL");
	},
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
	todayString: function() {
		return dateToDateString(today());
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
	modalHelpers
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

Template.displayTodayRequests.helpers(
	harvestHelpers
);

Template.display3DayRequests.helpers(
	harvestHelpers
);


// HARVEST LOG

Template.insertHarvestLogModalInner.helpers(
	modalHelpers
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

Template.updateHarvestItemModalInner.helpers(
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
