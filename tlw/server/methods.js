Meteor.methods({
	
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
});