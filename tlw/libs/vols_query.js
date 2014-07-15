searchVols = function (searchTerm) {
	var queryLimit = 25;

	if (!!searchTerm) {
		volsFound = Volunteers.find({
			$or: [
				// TODO: passing to regex directly could be dangerous...
		{'firstname': {$regex: searchTerm, $options: 'i'}},
		{'lastname': {$regex: searchTerm, $options: 'i'}},
		{'phone': {$regex: searchTerm, $options: 'i'}},
			]
		}, {sort: {firstname: 1}, limit: queryLimit});
		if (vols.count() === 1) {
			volSigning = vols.fetch();
			Session.set('volSigning', volSigning);
		}
	} else {
		vols = Volunteers.find();
		//Session.set('volSigning', undefined);
	}
	return vols;
};