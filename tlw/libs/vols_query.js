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
		} 
		// if 0 found, return 0
		else if (volsFound.count() === 0) {
			return 0;
		}
		// if 1+ found, return the count
		else {
			return volsFound.count();
		}
	}
	//idk...
	return false;
};
