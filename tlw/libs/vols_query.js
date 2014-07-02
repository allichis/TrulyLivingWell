filteredVolsQuery = function(filter) {
// TODO: if the volunteer can't be ID'd...

	// TODO: configurable limit and paginiation
	var queryLimit = 25;

	if(!!filter) {
		vols = Volunteers.find({
			$or: [
				// TODO: passing to regex directly could be dangerous
				{'firstname': {$regex: filter, $options: 'i'}},
				{'lastname': {$regex: filter, $options: 'i'}},
				{'phone': {$regex: filter, $options: 'i'}}
			]
		}, {sort: {firstname: 1}, limit: queryLimit});
		if (vols.count() === 1) {
			volSigning = vols.fetch();
			// set volSigning, which indicates a unique volunteer record
			// is found by the query
			Session.set('volSigning', volSigning);
		}
	} else {
		console.log("!filter: " + filter);
		//vols = Volunteers.find({}, {sort: {phone: 1}, limit: queryLimit});
		vols = Volunteers.find();
		Session.set('volSigning', undefined);
	}
	return vols;
};

initTimecard = function(vid) {
	tc = VolunteerTimecards.find({
			'volId': vid,
			'tcStatus': "Open"
	});

	if (tc.count() >= 1) {
		throw new Meteor.Error(444, "Problem");
	}

	// create the new timecard for vid
	var newTc = {
		volId: vid,
		location: "Wheat Street",
		tcStatus: "Open",
		timeOpened: new Date()
	};
	return VolunteerTimecards.insert(newTc);
};