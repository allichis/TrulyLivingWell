Meteor.methods({
	
	// HARVEST REQUESTS
	deleteRequest: function(itemId) {
		Requests.remove(itemId);
	},
	updateRequest: function(itemid, amount, strip, location, notes) {
		// update existing location
		obj = {};
		obj['amount'] = amount;
		obj['strip'] = strip;
		obj['location'] = location;
		obj['notes'] = notes;
		Requests.update({_id: itemid}, {$set: obj});
	},

	// HARVEST LOG
	deleteHarvestLogItem: function(itemId) {
		HarvestLog.remove(itemId);
	},

	// PRODUCTS
	insertProduct: function(productName) {
		// insert new product
		Products.insert({itemname: productName});
	},
	deleteProduct: function(productId) {
		// remove the product
		Products.remove(productId);
	},
	updateProduct: function(productId, productName) {
		// update existing product
		obj = {};
		obj['itemname'] = productName;
		Products.update({_id: productId}, {$set: obj});
	},

	// LOCATIONS
	insertLocation: function(locationName) {
		// insert new location
		Locations.insert({name: locationName});
	},
	deleteLocation: function(locationId) {
		// remove the location
		Locations.remove(locationId);
	},
	updateLocation: function(locationId, locationName) {
		// update existing location
		obj = {};
		obj['name'] = locationName;
		Locations.update({_id: locationId}, {$set: obj});
	},

	// VOLUNTEERS
	deleteVolunteer: function(vId) {
		Volunteers.remove(vId);
	},

	// VOLUNTEER TIMECARDS
	openVolTimecard: function(vphone) {
		var tcVolId = null;
		var volOpenTimecardCount = -1;
		
		// set tcVolId given a phone number
		if (vphone==undefined || vphone.length <= 0) {
			throw new Meteor.Error(404, "Blank or invalid phone number.");
		} else if (Volunteers.find({'phone': vphone}).count() === 0) {
			throw new Meteor.Error(404, "No volunteer with that phone number found.");
		} else if (Volunteers.find({'phone': vphone}).count() > 1) {
			throw new Meteor.Error(404, "Found more than one volunteer with that phone number.");
		} else if (Volunteers.find({'phone': vphone}).count() === 1) {
			tcVolId = Volunteers.findOne({'phone': vphone})._id;
		} else {
			// mysterious error occurred
			throw new Meteor.Error(404, "Something else went wrong.");
		}

		// get the number of currently Open timecards for this vol
		if (tcVolId) {
			volOpenTimecardCount = VolunteerTimecards.find({'volId': tcVolId, tcStatus: 'Open'}).count();
		}

		if (volOpenTimecardCount === 0) {
			VolunteerTimecards.insert({'volId': tcVolId, tcStatus: 'Open', timeOpened: new Date});
			return tcVolId;
		} else if (volOpenTimecardCount > 0) {
			throw new Meteor.Error(99, "Already an open timecard for this volunteer!");
		}
		// VTC: volId, status, timeOpened, timeClosed
	},

	// VISITORS
	deleteVisitor: function(id) {
		Visitors.remove(id);
	},

	// VISIT TYPES
	deleteVisitType: function(id) {
		VisitTypes.remove(id);
	},

	// TOURS
	deleteTour: function(id) {
		Tours.remove(id);
	},

	// TOUR ADD-ONS
	deleteTourAddOn: function(id) {
		TourAddOns.remove(id);
	},

	// REPORTS
	deleteReport: function(id) {
		MonthlyReports.remove(id);
	},

	updateReport: function(id, updates) {
		MonthlyReports.updates(id, {$set: updates});
	},
});
