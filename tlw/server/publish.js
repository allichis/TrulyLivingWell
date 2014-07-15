Meteor.publish('allProducts', function () {
	return Products.find();
});

Meteor.publish("locations", function () {
	return Locations.find();
});

Meteor.publish("volunteers", function () {
	return Volunteers.find();
});

Meteor.publish("visitors", function () {
	return Visitors.find();
});

Meteor.publish("requests", function () {
	return Requests.find();
});

Meteor.publish('filteredVols', function(filter) {
	return filteredVolsQuery(filter);
});

_.each([Volunteers, Products], function (collection) {
	collection.allow({
		insert: function() {
			return true;
		},
		update: function() {
			return true;
		},
		remove: function() {
			return true;
		},
		fetch: []
	});
});
