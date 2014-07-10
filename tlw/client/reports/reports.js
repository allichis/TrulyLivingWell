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
		var reports = MonthlyReports.find().fetch();
		var years = [2014,2015];
		/*for(r in reports) {
			var y = r.year;
			if(!years.contains(y)) {
				years.push(y);
			}
		}*/
		return years;
	},
	yearFilter: function() {
		return Session.get('yearFilter');
	},
};

var setYearFilter = function(template){
	var year = template.find(".year-filter").value;
	Session.set("yearFilter", year);
	alert("year filter set to " + year);
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
		var reportmonth = template.find("#selectMonth").value;
		var reportyear = template.find("#selectYear").value;
		// TO DO: check for valid month and year
		var report = MonthlyReports.find({$and: [{month: reportmonth}, {year: reportyear}]}).fetch()[0];
		if(!report) {
			alert("Report not found. Creating new report for " + reportmonth + " " + reportyear + ".");
			var newreportid = MonthlyReports.insert({month: reportmonth, year: reportyear});
			report = MonthlyReports.find({_id: newreportid}).fetch()[0];
			alert("Report created: ID=" + newreportid);
		}
		Session.set('reportSelected', report);
    },
});

Template.reportForm.helpers(reportHelpers);


Template.adminViewMonthlyReports.helpers(reportHelpers);

Template.adminViewMonthlyReports.events({
	'click .glyphicon-trash': function(event, template) {
		Session.set('reportSelected', this);
    },
    'click .glyphicon-pencil': function(event, template) {
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

