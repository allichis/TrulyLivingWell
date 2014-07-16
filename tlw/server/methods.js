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

	// VISITORS
	deleteVisitor: function(vId) {
		Visitors.remove(vId);
	},

	// VISIT TYPES
	deleteVisitType: function(vId) {
		VisitTypes.remove(vId);
	},

	// REPORTS
	deleteReport: function(id) {
		MonthlyReports.remove(id);
	},
});
