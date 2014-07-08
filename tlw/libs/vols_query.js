filteredVolsQuery = function(filter) {
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
			Session.set('volSigning', volSigning);
		}
	} else {
		vols = Volunteers.find();
		Session.set('volSigning', undefined);
	}
	return vols;
};

searchVols = function (searchTerm) {
	var queryLimit = 25;

	if (!!searchTerm) {
		volsFound = Volunteers.find({
			$or: [
				// TODO: passing to regex directly could be dangerous...
		{'name': {$regex: searchTerm, $options: 'i'}},
		{'phone': {$regex: searchTerm, $options: 'i'}},
			]
			// probably change this sorting key...
		}, {sort: {phone: 1}, limit: queryLimit});

	}
};
