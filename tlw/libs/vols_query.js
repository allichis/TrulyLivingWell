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

okToOpenTimecard = function(volId) {
	if (VolunteerTimecards.find({'volId': volId, tcStatus: "Open"}).count() > 0) {
		// open timecard exists, so return false
		return false;
	}
	return true;
};

initTimecard = function(volId, volLoc) {
	// use function in harvest.js to select location
	return VolunteerTimecards.insert({volId: volId, location: volLoc, tcStatus: "Open", timeOpened: new Date});
};

closeTimecard = function(vid) {
	return VolunteerTimecards.update({_id:VolunteerTimecards.findOne({volId: vid, tcStatus: "Open"})['_id']}, {$set: {'tcStatus': "Closed", timeClosed: new Date}});
};
