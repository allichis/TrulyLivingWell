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

Meteor.publish("harvests", function () {
	return HarvestLog.find();
});

Meteor.publish("visittypes", function () {
	return VisitTypes.find();
});

Meteor.publish("tours", function () {
	return Tours.find();
});

Meteor.publish("touraddons", function () {
	return TourAddOns.find();
});

Meteor.publish('filteredVols', function(filter) {
	return filteredVolsQuery(filter);
});

_.each([Volunteers, Products, Visitors, VisitTypes, Tours, TourAddOns, Requests, HarvestLog], function (collection) {
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

/*VisitTypes.allow({
    insert: function(userId, doc){
    	return true;
    },
    update: function(userId, doc){
    	return true;
    },
});

Tours.allow({
    insert: function(userId, doc){
    	return true;
    },
    update: function(userId, doc){
    	return true;
    },
});

TourAddOns.allow({
    insert: function(userId, doc){
    	return true;
    },
    update: function(userId, doc){
    	return true;
    },
});*/