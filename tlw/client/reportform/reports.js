Template.selectMonth.helpers({
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

Template.selectMonth.events({
	'click .btn-warning': function(event, template) {
		var month = template.find("#selectMonth").value;
		var year = template.find("#selectYear").value;
		// TO DO: check for valid month and year
		var report = MonthlyReports.findOne({reportID: {month: month, year: year}});
		if(!report) {
			report = MonthlyReports.insert({reportID: {month: month, year: year}});
		}
		Session.set('reportSelected', report);
    },
});

Template.reportForm.helpers({
	reportSelected: function() {
		return Session.get('reportSelected');
	}
});