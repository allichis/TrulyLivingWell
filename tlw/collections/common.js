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
		optional: true,
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
		min: 0,
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
		max: 45
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
	        date.setUTCHours(0,0,0,0);

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

// Requests
Requests = new Meteor.Collection("requests");
Requests.attachSchema(Schema.Requests);

// Harvest Log
HarvestLog = new Meteor.Collection("harvestlog");
HarvestLog.attachSchema(Schema.HarvestLog);

// contexts for validation...
var vContext = Schema.Volunteers.namedContext("newVolForm");
