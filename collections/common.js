function getMaxDate() {
	var minAge = 18;
	var maxDate = new Date();
	maxDate.setFullYear(maxDate.getFullYear() - minAge);
	return maxDate;
}

var Schema = {};

Schema.EmergencyContact = new SimpleSchema({
	name: {
		type: String,
	},
	phone: {
		type: String,
	},
});

Schema.Volunteers = new SimpleSchema({
	firstname: {
		type: String,
		label: "* First name",
		max: 128
	},
	lastname: {
		type: String,
		label: "* Last name",
		max: 128
	},
	dob: {
		type: Date,
		label: "* Date of birth",
		// some limitations on dob here...
		max: getMaxDate,
	},
	// volunteer contact info
	email: {
		type: String,
		label: "* Email address",
		// schema for matching email addresses...
		regEx: SimpleSchema.RegEx.Email,
	},
	phone: {	
		type: String,
		label: "* Phone number",
		// validate as phone number...
		max: 15,
	},
	isVeteran: {
		type: Boolean,
		label: "Veteran status",
	},
	organization: {
		type: String,
		label: "Organization",
		max: 45,
		optional: true,
	},
	emergencyContact: {
		type: Schema.EmergencyContact,
		optional: true,
	},
	notes: {
		type: String,
		label: "Additional Information (training, limitations, etc)",
		max: 256,
		optional: true,
	},
});

Schema.VolunteerTimecards = new SimpleSchema({
	volId: {
		type: String,
		//regEx: SimpleSchema.RegEx.Id,
	},
	location: {
		type: String,
	},
	tcStatus: {
		type: String,
		allowedValues: ['Open', 'Closed'],
	},
	timeOpened: {
		type: Date,
	},
	timeClosed: {
		type: Date,
		optional: true,
	},
});

Schema.VisitorContact = new SimpleSchema({
	firstname: {
		type: String,
		label: "* First name",
		max: 45
	},
	lastname: {
		type: String,
		label: "* Last name",
		max: 45
	},
	dob: {
		type: Date,
		label: "Date of birth",
		optional: true,
	},
	email: {
		type: String,
		label: "Email address",
		// schema for matching email addresses...
		regEx: SimpleSchema.RegEx.Email,
		optional: true,
	},
	phone: {	
		type: String,
		label: "Phone number",
		// validate as phone number...
		max: 15,
		optional: true,
	},
	isVeteran: {
		type: Boolean,
		label: "Veteran status",
	},
});

Schema.Visitors = new SimpleSchema({
	// *** these are usually groups, not individuals, right?
	// contact person info: fname, lname, phone, email, ...
	// org/group name
	// number in group
	// donation and/or tour type
	// oh yeah, date of visit?
	date: {
		type: Date,
		label: "Date of visit"
	},
	visitType: {
		type: String,
		label: "Type of visit",
		max: 45,
		defaultValue: "Tour",
	},
	tourType: {
		type: String,
		label: "Tour name",
		max: 100,
		optional: true,
		custom: function () {
	      if ((this.field('visitType').value === "Tour") && !this.isSet && (!this.operator || (this.value === null || this.value === ""))) {
	        return "required";
	      }
	    },
	},
	addOns: {
		type: [String],
		defaultValue: [],
		optional: true,
		label: "Tour Add-Ons",
	},
	numChildren: {
		type: Number,
		label: "Number of children",
		defaultValue: 0,
		min: 0,
	},
	numAdults: {
		type: Number,
		label: "Number of adults",
		defaultValue: 0,
		min: 0,
	},
	numSeniors: {
		type: Number,
		label: "Number of seniors",
		defaultValue: 0,
		min: 0,
	},
	numVeterans: {
		type: Number,
		label: "Number of Veterans",
		defaultValue: 0,
		min: 0,
	},
	/*otherVisitType: {
		type: String,
		label: "Other reason for visit",
	},*/
	contact: {
		type: String,
		label: "Contact",
		max: 45,
		optional: true,
	},
	organization: {
		type: String,
		label: "Organization",
		max: 45,
		optional: true,
	},
	comments: {
		type: String,
		label: "Comments",
		max: 256,
		optional: true,
	},
});

Schema.VisitTypes = new SimpleSchema({
	title: {
		type: String,
		max: 100,
	},
	cost: {
		type: Number,
		defaultValue: 0,
		min: 0,
	},
	notes: {
		type: String,
		optional: true,
	},
});

Schema.Tours = new SimpleSchema({
	title: {
		type: String,
		max: 100,
	},
	cost: {
		type: Number,
		defaultValue: 0,
		min: 0,
	},
	notes: {
		type: String,
		optional: true,
	},
});

Schema.TourAddOns = new SimpleSchema({
	title: {
		type: String,
		max: 100,
	},
	cost: {
		type: Number,
		defaultValue: 0,
		min: 0,
	},
	notes: {
		type: String,
		optional: true,
	},
});

Schema.Staff = new SimpleSchema({
	// similar fields to Volunteers as far as contact info
	// also, similar fields to Users as far as User Profile info / login auth stuff like username+pw
});

Schema.StaffTimecards = new SimpleSchema({
	// yikes...
});

Schema.Products = new SimpleSchema({
	// this is just a list...? might need tho.
	itemname: {
		type: String,
		label: "Item name",
		max: 100,
	}
});

Schema.Requests = new SimpleSchema({
	// itemname - related to something on product list...
	// not necessarily related, but probably pulled from that list
	itemname: {
		type: String,
		label: "Item",
		max: 45,
	},
	amount: {
		type: Number,
		label: "Amount",
		min: 1,
		/*autoValue: function(){
			if(field(strip).value === false) {
				if(this.isSet && this.value > 0) {
					return this.value;
				}
				else {
					return 1;
				}
			}
		},*/
		optional: true,
	},
	strip: {
		type: Boolean,
		label: "Strip Bed?",
	},
	// location
	location: {
		type: String,
		label: "Location",
		//allowedValues: ["EP", "WS"]
	},
	// required-for date
	date: {
		type: Date,
		label: "Date needed",
	},
	requestedFor: {
		type: String,
		label: "Requested for",
		allowedValues: ["Market","Wholesale","Other"],
		defaultValue: "Market",
	},
	// notes
	notes: {
		type: String,
		label: "Notes",
		max: 256,
		optional: true,
	},
	// timestamp ofc
	// requested_by (staffmember)/initials
	// status
});

Schema.HarvestLog = new SimpleSchema({
	// itemname (products)
	itemname: {
		type: String,
		label: "Item",
		max: 100
	},
	// weighed_amt
	amount: {
		type: Number,
		label: "Amount",
		min: 0
	},
	// strip harvested?
	strip: {
		type: Boolean,
		label: "Strip Bed?",
	},
	// location
	location: {
		type: String,
		label: "Location",
		//allowedValues: ["EP", "WS"]
	},
	// timestamp ofc
	date: {
		type: Date,
		autoValue: function() {
	        var date = new Date;
	        //date.setUTCHours(0,0,0,0);

	        if (this.isInsert) {
	          return date;
	        } else if (this.isUpsert) {
	          return {$setOnInsert: date};
	        } else {
	          this.unset();
	        }
	    },
		label: "Date harvested",
	},
	// notes
	notes: {
		type: String,
		label: "Notes",
		max: 256,
		optional: true,
	},
	// related to a HarvestRequest?
	// harvester - which staff? (maybe)
});

Schema.Locations = new SimpleSchema({
	// location name
	name: {
		type: String,
		label: "Location name",
		max: 45
	},
	// lat/long? (maybe useful for mapping in the future)
});

Schema.Tasks = new SimpleSchema({
	// task title
	// date (to be performed)
	// timestamp of "request", why not
	// requested_by
	// location
	// status
	// (who is performing/will perform?)
	//
	// this one needs a lot more thinking...
});

Schema.MonthYear = new SimpleSchema({
	month: {
		type: Number,
		min: 0,
		max: 11,
		label: "Month"
	},
	year: {
		type: Number,
		min: 2014,
		max: 3000,
		label: "Year"
	},
});

Schema.MonthlyReports = new SimpleSchema({
	reportID: {
		type: String,
		unique: true,
		autoValue: function() {
			if (this.isInsert) {
				var month = this.field('month').value;
				var year = this.field('year').value;
				var monthyearstring = month + "" + year;
	          	return monthyearstring;
	        } else if (this.isUpsert) {
	        	var month = this.field('month').value;
				var year = this.field('year').value;
				var monthyearstring = month + "" + year;
          		return {$setOnInsert: monthyearstring};
        	} else {
        		this.unset();
        	}
		}
	},
	month: {
		type: Number,
		min: 0,
		max: 11,
		label: "Month"
	},
	year: {
		type: Number,
		min: 2014,
		max: 9999,
		label: "Year"
	},
	employeeCount: {
		type: Number,
		label: "Employees this month",
		defaultValue: 0,
		min: 0,
		optional: true,
	},
	employeeHours: {
		type: Number,
		label: "Employee hours worked",
		defaultValue: 0,
		min: 0,
		optional: true,
	},
	csaTotal: {
		type: Number,
		label: "Total CSA Subscriptions",
		defaultValue: 0,
		min: 0,
		optional: true,
	},
	csaNew: {
		type: Number,
		label: "New CSA Subscriptions",
		defaultValue: 0,
		min: 0,
		//optional: true,
	},
	veteranCount: {
		type: Number,
		label: "Veterans",
		defaultValue: 0,
		min: 0,
		//optional: true,
	},
	visitorCount: {
		type: Number,
		label: "Total Visitors",
		defaultValue: 0,
		min: 0,
		//optional: true,
	},
	visitorCount_children: {
		type: Number,
		label: "Child visitors",
		defaultValue: 0,
		min: 0,
		//optional: true,
	},
	visitorCount_adults: {
		type: Number,
		label: "Adult visitors",
		defaultValue: 0,
		min: 0,
		//optional: true,
	},
	visitorCount_seniors: {
		type: Number,
		label: "Senior visitors",
		defaultValue: 0,
		min: 0,
		//optional: true,
	},
	volunteerCount: {
		type: Number,
		label: "Volunteers this month",
		defaultValue: 0,
		min: 0,
		//optional: true,
	},
	volunteerHours: {
		type: Number,
		label: "Volunteer hours worked",
		defaultValue: 0,
		min: 0,
		//optional: true,
	},
	tourInfo: {
		type: [Object],
		//optional: true,
	},
	"tourInfo.$.title": {
		type: String,
		max: 100,
		label: "Tour name"
	},
	"tourInfo.$.totalpeople": {
		type: Number,
		defaultValue: 0,
		min: 0,
		label: "Total people"
	},
	"tourInfo.$.totalcost": {
		type: Number,
		defaultValue: 0,
		min: 0,
		label: "Total $"
	},
	locationInfo: {
		type: [Object],
		optional: true,
	},
	"locationInfo.$.location": {
		type: String,
		label: "Location",
	},
	"locationInfo.$.volunteerCount": {
		type: Number,
		label: "Volunteers this month",
		defaultValue: 0,
		min: 0,
		optional: true,
	},
	"locationInfo.$.volunteerHours": {
		type: Number,
		label: "Volunteer hours worked",
		defaultValue: 0,
		min: 0,
		optional: true,
	},
	productInfo: {
		type: [Object],
		//optional: true,
	},
	"productInfo.$.itemname": {
		type: String,
		label: "Item",
		defaultValue: "item"
	},
	"productInfo.$.harvestedUnits": {
		type: Number,
		label: "Harvested units",
		defaultValue: 0,
		min: 0,
		//optional: true,
	},
	"productInfo.$.wholesaleUnits": {
		type: Number,
		label: "Wholesale units",
		defaultValue: 0,
		min: 0,
		//optional: true,
	},
	"productInfo.$.marketUnits": {
		type: Number,
		label: "Market units",
		defaultValue: 0,
		min: 0,
		//optional: true,
	},
	"productInfo.$.marketSales": {
		type: Number,
		label: "Market sales",
		defaultValue: 0,
		min: 0,
		//optional: true,
	},
	"productInfo.$.otherUnits": {
		type: Number,
		label: "Other units (= Harvested - Market - Wholesale)",
		defaultValue: 0,
		//optional: true,
	},
	"productInfo.$.index": {
		type: Number,
		optional: true,
	}

});

/*Schema.LocationTotals = new SimpleSchema({
	location: {
		type: Schema.Locations,
		label: "Location",
	},
	volunteerCount: {
		type: Number,
		label: "Volunteers this month",
		defaultValue: 0,
		min: 0,
		optional: true,
	},
	volunteerHours: {
		type: Number,
		label: "Volunteer hours worked",
		defaultValue: 0,
		min: 0,
		optional: true,
	},
});*/

/*Schema.ProductTotals = new SimpleSchema({
	itemname: {
		type: String,
		label: "Item",
		defaultValue: "item"
	},
	harvestedUnits: {
		type: Number,
		label: "Harvested units",
		defaultValue: 0,
		min: 0,
		optional: true,
	},
	wholesaleUnits: {
		type: Number,
		label: "Wholesale units",
		defaultValue: 0,
		min: 0,
		optional: true,
	},
	marketUnits: {
		type: Number,
		label: "Market units",
		defaultValue: 0,
		min: 0,
		optional: true,
	},
	marketSales: {
		type: Number,
		label: "Market sales",
		defaultValue: 0,
		min: 0,
		optional: true,
	},
	otherUnits: {
		type: Number,
		label: "Other units (= Harvested - Market - Wholesale)",
		defaultValue: 0,
		optional: true,
	},
});*/


// set up Collections and relate them to some Schema

// Products
Products = new Meteor.Collection("products");
Products.attachSchema(Schema.Products);

// Locations
Locations = new Meteor.Collection("locations");
Locations.attachSchema(Schema.Locations);

// Volunteers
Volunteers = new Meteor.Collection("volunteers");
Volunteers.attachSchema(Schema.Volunteers);

// Volunteer Timecards
VolunteerTimecards = new Meteor.Collection("volTimecards");
VolunteerTimecards.attachSchema(Schema.VolunteerTimecards);

// Visitors
Visitors = new Meteor.Collection("visitors");
Visitors.attachSchema(Schema.Visitors);

// Visit Types
VisitTypes = new Meteor.Collection("visittypes");
VisitTypes.attachSchema(Schema.VisitTypes);

// Tours
Tours = new Meteor.Collection("tours");
Tours.attachSchema(Schema.Tours);

// Tour Add-Ons
TourAddOns = new Meteor.Collection("touraddons");
TourAddOns.attachSchema(Schema.TourAddOns);

// Requests
Requests = new Meteor.Collection("requests");
Requests.attachSchema(Schema.Requests);

// Harvest Log
HarvestLog = new Meteor.Collection("harvestlog");
HarvestLog.attachSchema(Schema.HarvestLog);

// REPORTS
MonthlyReports = new Meteor.Collection("monthlyreports");
MonthlyReports.attachSchema(Schema.MonthlyReports);

// contexts for validation...
var vContext = Schema.Volunteers.namedContext("newVolForm");
