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
			// probably change this sorting key...
		}, {sort: {phone: 1}, limit: queryLimit});

		// if a unique match is found, just return vols, which should only contain that volunteer record
		if (volsFound.count() === 1) {
			return volsFound;
		} else { 
			return volsFound.count();
		}
	}
	return 0;
};
