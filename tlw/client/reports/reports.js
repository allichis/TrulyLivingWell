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

var reportHelpers = {
	reports: function(template) {
		var filter = Number(Session.get('yearFilter'));
		if(!filter) {
			filter = Number(new Date().getFullYear());
			Session.set('yearFilter', filter);
		}
		//note: filter has to be a Number for this query to work
		return MonthlyReports.find({'year': filter}, {sort: {year:-1, month:-1}});
		//return MonthlyReports.find();
	},
	reportSelected: function() {
		return Session.get('reportSelected');
	},
	displayMonth: function(month) {
		return getMonthString(month);
	},
	years: function() {
		var years = _.uniq(MonthlyReports.find({}, {fields: {year:1}})
			.fetch()
			.map(function(x){return x.year;}));
		return years;
	},
	yearFilter: function() {
		return Session.get('yearFilter');
	},
	wholesaleUnitsInputId: function(item) {
		return "wholesaleUnitsInput_" + item['itemname'];
	},
	marketUnitsInputId: function(item) {
		return "marketUnitsInput_" + item['itemname'];
	},
	marketSalesInputId: function(item) {
		return "marketSalesInput_" + item['itemname'];
	},
};

var setYearFilter = function(template){
	var year = template.find(".year-filter").value;
	Session.set("yearFilter", year);
	//alert("year filter set to " + year);
};

Template.selectReport.helpers({
	monthOptions: function() {
		options = [];
		options.push({label: "January", value: 0});
		options.push({label: "February", value: 1});
		options.push({label: "March", value: 2});
		options.push({label: "April", value: 3});
		options.push({label: "May", value: 4});
		options.push({label: "June", value: 5});
		options.push({label: "July", value: 6});
		options.push({label: "August", value: 7});
		options.push({label: "September", value: 8});
		options.push({label: "October", value: 9});
		options.push({label: "November", value: 10});
		options.push({label: "December", value: 11});
		return options;
	},

	thisYear: function() {
		return new Date().getFullYear();
	},
});

Template.selectReport.events({
	'click .btn-warning': function(event, template) {
		var reportmonth = Number(template.find("#selectMonth").value);
		var reportyear = Number(template.find("#selectYear").value);
		var report = MonthlyReports.find({$and: [{'month': reportmonth}, {'year': reportyear}]}).fetch()[0];
		if(!report) {
			var reportValues = getReportValues(reportmonth, reportyear);
			var newreportid = MonthlyReports.insert(reportValues);
			report = MonthlyReports.find({'_id': newreportid}).fetch()[0];
		}
		Session.set('reportSelected', report);
    },
});

Template.viewReport.helpers(reportHelpers);

Template.reportForm.helpers(reportHelpers);

Template.reportForm.events({
	'click .btn-primary': function(event, template) {
		// user clicked "submit"
		// get product info data that wasn't part of autoform
		updateProductInfo(template);
		// go to "viewReport" template
		Router.go('viewReport');
	}
});

function updateProductInfo(template) {
	var report = Session.get('reportSelected');
	var reportId = report['_id'];
	var productInfo = report['productInfo'];
	var updates = {};
	var i = 0;
	productInfo.forEach(function(item) {
		updates['productInfo.' + i + '.wholesaleUnits'] = template.find("#wholesaleUnitsInput_" + item['itemname']).value;
		updates['productInfo.' + i + '.marketUnits'] = template.find("#marketUnitsInput_" + item['itemname']).value;
		updates['productInfo.' + i + '.marketSales'] = template.find("#marketSalesInput_" + item['itemname']).value;
		i++;
	});
	
	MonthlyReports.update(reportId, {$set: updates});
	/*Meteor.call('updateReport', reportId, updates , function(error) {
		if (error) {
			// optionally use a meteor errors package
			if (typeof Errors === "undefined")
				Log.error('Error: ' + error.reason);
			else {
				Errors.throw(error.reason);
			}
		}}
	);*/
	/*updates = {};
	productInfo.forEach(function(index, item) {
		updates['productInfo.' + index + '.otherUnits'] = report['productInfo.' + index + '.harvestedUnits'] - report['productInfo.' + index + '.wholesaleUnits'] - report['productInfo.' + i + '.marketUnits'];
	});
	MonthlyReports.update(reportId, {$set: updates});*/
}

Template.adminViewMonthlyReports.helpers(reportHelpers);

Template.adminViewMonthlyReports.events({
	'click .glyphicon-trash': function(event, template) {
		Session.set('reportSelected', this);
    },
    'click .glyphicon-pencil': function(event, template) {
		Session.set('reportSelected', this);
    },
    'click .glyphicon-info-sign': function(event, template) {
		Session.set('reportSelected', this);
    },
    'click .year-filter': function(event, template) {
		setYearFilter(template);
    },
});

Template.deleteReportModal.helpers(reportHelpers);

Template.deleteReportModal.events({
	'click .btn-danger': function(event, template) {
		Meteor.call('deleteReport', this._id, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
			$("#deletereport").modal("hide");
		});
    },
});



function getReportValues(month, year) {
	var values = {};
	values['month'] = month;
	values['year'] =  year;
	values['employeeCount'] = 0;
	values['employeeHours'] = 0;
	values['volunteerCount'] = getVolunteerCount(month,year);
	values['volunteerHours'] = getVolunteerHours(month,year);
	values['visitorCount'] = getVisitorTotal(month,year);
	values['veteranCount'] = getVisitorVeterans(month,year);
	values['visitorCount_children'] = getVisitorChildren(month,year);
	values['visitorCount_adults'] = getVisitorAdults(month,year);
	values['visitorCount_seniors'] = getVisitorSeniors(month,year);
	values['tourInfo'] = getTourInfo(month,year);
	// location data
	// product data
	values['productInfo'] = getProductInfo(month,year);
	return values;
}

function getVolunteerCount(month, year) {
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var volTimes = VolunteerTimecards.find({timeOpened: {$gte: start, $lt: end}});
	var vols = _.uniq(volTimes.fetch().map(function(timecard) { return timecard.volId}));
	var numvols = vols.size;
	return numvols;
}

function getVolunteerHours(month, year) {
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
}

function getVisitorTotal(month, year) {
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var visitors = Visitors.find({date: {$gte: start, $lt: end}}).fetch();
	var total = 0;
	visitors.forEach(function(visit) {
		total += (visit.numChildren + visit.numAdults + visit.numSeniors);
	});
	return total;
}

function getVisitorChildren(month, year) {
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var visitors = Visitors.find({date: {$gte: start, $lt: end}}, {fields: {numChildren:1}}).fetch();
	var total = 0;
	visitors.forEach(function(visit) {
		total += visit.numChildren;
	});
	return total;
}

function getVisitorAdults(month, year) {
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var visitors = Visitors.find({date: {$gte: start, $lt: end}}, {fields: {numAdults:1}}).fetch();
	var total = 0;
	visitors.forEach(function(visit) {
		total += visit.numAdults;
	});
	return total;
}

function getVisitorSeniors(month, year) {
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var visitors = Visitors.find({date: {$gte: start, $lt: end}}, {fields: {numSeniors:1}}).fetch();
	var total = 0;
	visitors.forEach(function(visit) {
		total += visit.numSeniors;
	});
	return total;
}

function getVisitorVeterans(month, year) {
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var visitors = Visitors.find({date: {$gte: start, $lt: end}}, {fields: {numVeterans:1}}).fetch();
	var total = 0;
	visitors.forEach(function(visit) {
		total += visit.numVeterans;
	});
	return total;
}

// gets tour totals for all the tours this month
function getTourInfo(month, year) {
	var tourInfo = [];
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var toursThisMonth = Visitors.find({$and: [{'date': {$gte: start, $lt: end}}, {'visitType': "Tour"}]}, {fields: {tourType:1}});
	var tours = _.uniq(toursThisMonth.fetch().map(function(visit) { return visit.tourType }));
	tours.forEach(function(tour) {
		tourInfo.push(getTourTotals(tour, month, year));
	});
	return tourInfo;
}

// gets product totals for one product
function getTourTotals(tourname, month, year) {
	tourTotals = {};
	tourTotals['title'] = tourname;
	tourTotals['totalpeople'] = getTourPeople(tourname, month, year);
	tourTotals['totalcost'] = tourTotals['totalpeople'] * getTourCost(tourname);
	return tourTotals;
}

function getTourPeople(tourname, month, year) {
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var visitors = Visitors.find({$and: [{'date': {$gte: start, $lt: end}}, {'tourType': tourname}]}).fetch();
	var total = 0;
	visitors.forEach(function(visit) {
		total += (visit.numChildren + visit.numAdults + visit.numSeniors);
	});
	return total;
}

function getTourCost(tourname, month, year) {
	var tour = Tours.find({'title': tourname}).fetch()[0];
	var cost = tour['cost'];
	if(!cost) {
		cost = 0;
	}
	return cost;
}

// gets product totals for all the products harvested this month
function getProductInfo(month, year) {
	var productInfo = [];
	/*var allproducts = Products.find();
	allproducts.forEach(function(product) {
		productInfo.push(getProductTotals(productname, month, year));
	});*/
	var products = getProductsHarvested(month,year);
	products.forEach(function(productname) {
		productInfo.push(getProductTotals(productname, month, year));
	});
	return productInfo;
}

// gets a list of the products harvested this month
function getProductsHarvested(month, year) {
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var harvestsInDateRange = HarvestLog.find({'date': {$gte: start, $lt: end}}, {fields: {itemname:1}});
	var products = _.uniq(harvestsInDateRange.fetch().map(function(log) { return log.itemname}));
	return products;
}

// gets product totals for one product
function getProductTotals(productname, month, year) {
	productTotals = {};
	productTotals['itemname'] = productname;
	productTotals['harvestedUnits'] = getHarvestedUnits(productname, month, year);
	productTotals['wholesaleUnits'] = getWholesaleUnits(productname, month, year);
	productTotals['marketUnits'] = getMarketUnits(productname, month, year);
	productTotals['marketSales'] = getMarketSales(productname, month, year);
	productTotals['otherUnits'] = productTotals['harvestedUnits'] 
									- productTotals['wholesaleUnits'] 
									- productTotals['marketUnits'];
	//var newid = ProductTotals.insert(productTotals);
	//var object = ProductTotals.findOne({'_id': newid});
	//return object;
	return productTotals;
}

function getHarvestedUnits(productname, month, year) {
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var harvestsInDateRange = HarvestLog.find({$and: [{'date': {$gte: start, $lt: end}}, {'itemname': productname}]}, {fields: {amount:1}}).fetch();
	var total = 0;
	harvestsInDateRange.forEach(function(log) {
		total += log.amount;
	});
	return total;
}

function getWholesaleUnits(productname, month, year) {
	return 0;
}

function getMarketUnits(productname, month, year) {
	return 0;
}

function getMarketSales(productname, month, year) {
	return 0;
}
