Template.volsignin.events({
	'click .glyphicon-search': function(event, template) {
		var lookupPhone = template.find(".search-input-filter").value;

		if (!lookupPhone)
			return;
		var resultCount = Volunteers.find({'phone': lookupPhone}).count();
		switch (resultCount) {
			case 1:
				console.log("success! found 1 record.");
				break;
			default:
				console.log("fail, did not find 1 record.");
		}
	}
});
