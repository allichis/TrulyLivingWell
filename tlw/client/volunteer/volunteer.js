Session.setDefault("uniqueVolFound", false);
// update search filter no more than 2 times per second
var setVolFilter = _.throttle(function(template) {
	var search = template.find(".vol-phone-input").value;
	Session.set("volSearchFilter", search);
}, 500);

Template.signinSuccess.helpers({
	timeLogged: function() {
		var timestamp = VolunteerTimecards.find({_id: Session.get("volNewTcId")}).fetch()[0].timeOpened;
		var readableTime = moment(timestamp).format("h:mm a");
		var readableDate = moment(timestamp).format("MMMM Do, YYYY");
		return readableTime + " on " + readableDate;
	}
});

Template.volsignin.helpers({
	volFound: function() {
		if (Session.get("uniqueVolFound")) {
			return true;
		}
		return false;
	},
});

Template.volsignin.events({
	'click [type="search"]': function(event, template) {
		var response = searchVols(Session.get("volSearchFilter"));
		if (Match.test(response, Match.Integer)) {
			if (response === 0) {
				console.log("couldn't find any volunteers.");
			} else {
				//assume response >1
				console.log("found more than one volunteer");
			}
		} else {
			volSigningIn = response;
			console.log(volSigningIn);
			Session.set("uniqueVolFound", true);
		}
	},
	'keyup .vol-phone-input': function(event, template) {
		setVolFilter(template);
		return false;
	},
	'click [type="submit"]': function(event, template) {
		var vid = Session.get("volSigning")[0]._id;
		var result = initTimecard(vid);	
		if (result) {
			Session.set('volNewTcId', result);
			Session.set("doneSigning", true);
		}
	}
});

Template.volsignin.rendered = function() {
	var searchElement = document.getElementsByClassName('vol-phone-input');
	if(!searchElement)
		return;
	var filterValue = Session.get("volSearchFilter");

	var pos = 0;
	if (filterValue)
		pos = filterValue.length;

	//searchElement[0].focus();
	//searchElement[0].setSelectionRange(pos, pos);
};
