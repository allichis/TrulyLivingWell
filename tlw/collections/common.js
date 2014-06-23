var Schema = {};

Schema.Volunteers = new SimpleSchema({
	name: {
		type: String,
		label: "Name",
		max: 256
	},
	dob: {
		type: Date,
		label: "Date of birth",
		// some limitations on dob here...
	},
	// volunteer contact info
	email: {
		type: String,
		label: "Email address",
		// schema for matching email addresses...
	},
	phone: {	
		type: String,
		label: "Phone number",
		// validate as phone number...
	},
	// still to come:
	// emergency contact info
	// ...
	// isVeteran
});

Schema.VolunteerTimecards = new SimpleSchema({
	// relate to Volunteers?...
	// timestamp of entry event
	// date/time of clockin/clockout
	// in/out var
	// location - choose from set...
});

Schema.Visitors = new SimpleSchema({
	// *** these are usually groups, not individuals, right?
	// contact person info: fname, lname, phone, email, ...
	// org/group name
	// number in group
	// donation and/or tour type
	// oh yeah, date of visit?
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
});

Schema.Requests = new SimpleSchema({
	// itemname - related to something on product list...
	// not necessarily related, but probably pulled from that list
	itemname: {
		type: String,
		label: "Item name",
		max: 256
	},
	amount: {
		type: Number,
		label: "Amount of item",
		min: 0
	}
	// required-for date
	// timestamp ofc
	// requested_by (staffmember)/initials
	// location
	// status
	// notes
});

Schema.HarvestLogs = new SimpleSchema({
	// itemname (products)
	// weighed_amt
	// strip harvested?
	// timestamp ofc
	// related to a HarvestRequest?
	// location
	// harvester - which staff? (maybe)
	// notes/purpose?
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

Schema.Locations = new SimpleSchema({
	// location name
	name: {
		type: String,
		label: "Location name",
		max: 256
	},
	// lat/long? (maybe useful for mapping in the future)
});

// set up the Collections and relate to a Schema

// Locations
Locations = new Meteor.Collection("locations");
Locations.attachSchema(Schema.Locations);

// Volunteers
Volunteers = new Meteor.Collection("volunteers");
Volunteers.attachSchema(Schema.Volunteers);

Requests = new Meteor.Collection("requests");
Requests.attachSchema(Schema.Requests);

// contexts for validation...
var vContext = Schema.Volunteers.namedContext("newVolForm");
