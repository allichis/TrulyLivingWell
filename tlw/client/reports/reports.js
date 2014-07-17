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
	wholesaleUnitsName: function() {
		return 'productInfo.' + this['index'] + '.wholesaleUnits';
	},
	marketUnitsName: function() {
		return 'productInfo.' + this['index'] + '.marketUnits';
	},
	marketSalesName: function() {
		return 'productInfo.' + this['index'] + '.marketSales';
	},
	productsWithIndex: function() {
	    return getReportProducts(this);
	}
};

var setYearFilter = function(template){
	var year = template.find(".year-filter").value;
	Session.set("yearFilter", year);
	//alert("year filter set to " + year);
};

function getReportProducts(report) {
	var products = report.productInfo;
	products.forEach(function(item) {
		item['index'] = _.indexOf(products, item);
	});
	
    return products;
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

Template.viewReport.events({
	'click #btn-printReport': function(event, tempate) {
		printReport();
	},
	'click #btn-exportReport': function(event, tempate) {
		exportReport();
	},
});

Template.reportForm.helpers(reportHelpers);

Template.reportForm.events({
	'click .btn-primary': function(event, template) {
		// user clicked "submit"
		// get product info data that wasn't part of autoform
		//updateProductInfo();
		// go to "viewReport" template
		//Router.go('viewReport');
	},
});

AutoForm.hooks({
	reportUpdateForm: {
		/*before: {
			//insert: function(doc, template) {},
			//update: function(docId, modifier, template) {},
			//remove: function(docId, template) {},
		},
		after: {
			//insert: function(error, result, template) {},
			//update: function(error, result, template) {},
			//remove: function(error, result, template) {},
		},
		onSubmit: function(insertDoc, updateDoc, currentDoc) {},*/
		onSuccess: function () {
			console.log("autoform submit success...");
			updateProductInfo();
			//Session.set('reportSelected', Session.get('reportSelected'));
			Router.go('viewReport');
			return false;
		},
		onError: function(operation, error, template) {
			if (error) {
				if (typeof Errors === "undefined")
					Log.error(error);
				else {
					//Errors.throw(error.reason);
					console.log(error);
				}
			}
		},
	}
});

function updateProductInfo(template) {
	var report = Session.get('reportSelected');
	var reportId = report['_id'];
	var products = getReportProducts(report);
	var updates = {};
	var form = document.forms["productInfoForm"];
	products.forEach(function(item) {
		var wholesaleUnitsName = 'productInfo.' + item['index'] + '.wholesaleUnits';
		var marketUnitsName = 'productInfo.' + item['index'] + '.marketUnits';
		var marketSalesName = 'productInfo.' + item['index'] + '.marketSales';
		var wu = form.elements[wholesaleUnitsName];
		var mu = form.elements[marketUnitsName];
		var ms = form.elements[marketSalesName];
		if(wu) {
			wu = wu.value;
		} else { wu = 0; }
		if(mu) {
			mu = mu.value;
		} else { mu = 0; }
		if(ms) {
			ms = ms.value;
		} else {ms = 0; }
		var ou = products[item['index']]['harvestedUnits'] - wu - mu;
		updates[wholesaleUnitsName] = wu;
		updates[marketUnitsName] = mu;
		updates[marketSalesName] = ms;
		updates['productInfo.' + item['index'] + '.otherUnits'] = ou;
	});

	//MonthlyReports.update(reportId, {$set: updates});
	Meteor.call('updateReport', reportId, updates , function(error) {
		if (error) {
			// optionally use a meteor errors package
			if (typeof Errors === "undefined")
				Log.error('Error: ' + error.reason);
			else {
				Errors.throw(error.reason);
			}
		}
		else {
			console.log("report update success...");
		}

	});
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
	values['csaNew'] = 0;
	values['volunteerCount'] = getVolunteerCount("all", month,year);
	values['volunteerHours'] = getVolunteerHours("all", month,year);
	values['visitorCount'] = getVisitorTotal(month,year);
	values['veteranCount'] = getVisitorVeterans(month,year);
	values['visitorCount_children'] = getVisitorChildren(month,year);
	values['visitorCount_adults'] = getVisitorAdults(month,year);
	values['visitorCount_seniors'] = getVisitorSeniors(month,year);
	values['tourInfo'] = getTourInfo(month,year);
	// location data
	values['locationInfo'] = getLocationInfo(month,year);
	// product data
	values['productInfo'] = getProductInfo(month,year);
	return values;
}

function getVolunteerCount(locationname, month, year) {
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var volTimes;
	if(locationname === "all") {
		volTimes = VolunteerTimecards.find({$and: [{'timeOpened': {$gte: start, $lt: end}}, 
													{'tcStatus': "Closed"}]});
	}
	else {
		volTimes = VolunteerTimecards.find({$and: [{'timeOpened': {$gte: start, $lt: end}}, 
													{'location': locationname}, 
													{'tcStatus': "Closed"}]});
	}
	var vols = _.uniq(volTimes.fetch().map(function(timecard) { return timecard.volId}));
	var numvols = 0;
	if(!vols.isEmpty) {
		numvols = vols.size;
	}
	return numvols;
}

function getVolunteerHours(locationname, month, year) {
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var volTimes;
	if(locationname === "all") {
		volTimes = VolunteerTimecards.find({$and: [{'timeOpened': {$gte: start, $lt: end}}, 
													{'tcStatus': "Closed"}]}).fetch();
	}
	else {
		volTimes = VolunteerTimecards.find({$and: [{'timeOpened': {$gte: start, $lt: end}}, 
													{'location': locationname}, 
													{'tcStatus': "Closed"}]}).fetch();
	}
	var totalHours = 0;
	volTimes.forEach(function(timecard) {
		var hours = timecard.timeClosed - timecard.timeOpened;
		totalHours += hours;
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
	var toursThisMonth = Visitors.find({$and: [{'date': {$gte: start, $lt: end}}, {'visitType': "Tour"}]}, {fields: {tourType:1, addOns:1}});
	
	var tours = _.uniq(toursThisMonth.fetch().map(function(visit) { return visit.tourType }));
	tours.forEach(function(tour) {
		tourInfo.push(getTourTotals(tour, month, year));
	});

	var tourAddOns = [];
	toursThisMonth.fetch().map(function(visit) {
		if(visit['addOns']) {
			for(i = 0; i < visit['addOns'].length; i++) {
				tourAddOns.push(visit['addOns'][i]); 
			}
		}
	});
	tourAddOns = _.uniq(tourAddOns);

	tourAddOns.forEach(function(addon) {
		tourInfo.push(getTourAddOnTotals(addon, month, year));
	});

	return tourInfo;
}

// gets tour totals for one tour
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
	if(!tour) {
		return 0;
	}
	var cost = tour['cost'];
	if(!cost) {
		cost = 0;
	}
	return cost;
}

// gets tour add-on totals for one tour add-on
function getTourAddOnTotals(addonname, month, year) {
	tourTotals = {};
	tourTotals['title'] = "Add-On: " + addonname;
	tourTotals['totalpeople'] = getTourAddOnPeople(addonname, month, year);
	tourTotals['totalcost'] = tourTotals['totalpeople'] * getTourAddOnCost(addonname);
	return tourTotals;
}

function getTourAddOnPeople(addonname, month, year) {
	var start = new Date(year, month, 1);
	var end = new Date(year, month+1, 1);
	var visitors = Visitors.find({$and: [{'date': {$gte: start, $lt: end}}, {'addOns': addonname}]}).fetch();
	var total = 0;
	visitors.forEach(function(visit) {
		total += (visit.numChildren + visit.numAdults + visit.numSeniors);
	});
	return total;
}

function getTourAddOnCost(addonname, month, year) {
	var tour = TourAddOns.find({'title': addonname}).fetch()[0];
	if(!tour) {
		return 0;
	}
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

function getLocationInfo(month, year) {
	var locationInfo = [];
	
	var locations = Locations.find({}, {fields: {name:1}});
	locations.forEach(function(location) {
		locationInfo.push(getLocationTotals(location['name'], month, year));
	});

	return locationInfo;
}

function getLocationTotals(locationname, month, year) {
	locationTotals = {};
	locationTotals['location'] = locationname;
	locationTotals['volunteerCount'] = getVolunteerCount(locationname, month, year);
	locationTotals['volunteerHours'] = getVolunteerHours(locationname, month, year);
	return locationTotals;
}

function printReport() {
	 window.print();
}

function exportReport() {
	var report = Session.get('reportSelected');
	var csv1 = reportTotalsToCsv(report);
	alert(csv1);
	//var csv2 = reportProductsToCsv(report);
	var filename1 = "TLWReport_" + getMonthString(report.month) + report.year + "_totals.csv";
	//var filename2 = "TLWReport_" + getMonthString(report.month) + report.year + "_products.csv";
	var type = "text/csv;charset=utf-8";

    var blob = new Blob([csv1], {type: "text/plain;charset=utf-8"});
	saveAs(blob, filename1);

	//var blob = new Blob([csv2], {type: "text/plain;charset=utf-8"});
	//saveAs(blob, filename2);

}

function reportTotalsToCsv(report) {
	var csv = '';
	var header = '';

	var excludeHeaders = ["_id", "reportID", "locationInfo", "productInfo", "tourInfo", "csaTotal"];

	_.map(report, function(value, key) {
		if(excludeHeaders.indexOf(key) === -1) {
			if(header === '') {
				header += ('"' + key + '"');
			}
			else {
				header += (',"' + key + '"');
			}
		}
	});
	header += '\n'

	_.map(report, function(value, key) {
		if(excludeHeaders.indexOf(key) === -1) {
			if(csv === '') {
				csv += ('"' + value + '"');
			}
			else {
				csv += (',"' + value + '"');
			}
		}
	});
	csv += '\n'

	return header + csv;
}

function reportProductsToCsv(report) {
	var csv = "";
	var header = "";
	return csv;
}