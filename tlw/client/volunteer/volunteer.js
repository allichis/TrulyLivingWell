Session.setDefault("uniqueVolFound", false);
Session.setDefault("searchError", -1);
Session.setDefault("openTcProblem", false);
Session.setDefault("volLocation", "Wheat Street");

// update search filter no more than 2 times per second
var setVolFilter = _.throttle(function(template) {
	var search = template.find(".vol-phone-input").value;
		Session.set("volSearchFilter", search);
		}, 500);

Deps.autorun(function() {
	Meteor.subscribe('volsSearch', Session.get('volsSearchQuery'));
});

Template.volunteer.events({
	'keyup input[type="text"]': function(event, template) {
		Session.set('volsSearchQuery', event.target.value);
	}
});

Template.volsignin.helpers({
		volFound: function() {
			if (Session.get("uniqueVolFound")) {
				return true;
			}
			return false;
		},
		vol: function() {
			var v = Session.get("uniqueVolId");
			return Volunteers.find(v);
		},
		signedIn: function() {
			if (Session.get("doneSigning", true)) {
				return true;
			}
			return false;
		},
		showSearchError: function() {
			if (Session.get("searchError") == 0) {
				return "No matching volunteers found. Please try another search term.";
			} else if (Session.get("searchError") == 2) {
				return "Found more than one matching volunteer record. Please try a different search term.";
			} else {
				return null;
			}
		},
		openTcMessage: function() {
			if (Session.get("openTcProblem")) {
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
				Session.set("searchError", 0);
			} else {
				Session.set("searchError", 2);
			}
		} else {
			// assume unique vol match found
			Session.set("searchErrorMsg", null);
			vid = response.fetch()[0]._id;
				Session.set("uniqueVolId", vid);
				Session.set("uniqueVolFound", true);

			// if got a unique vol, check their timecards to prompt for 
			// either signin or signout, depending.
			if (okToOpenTimecard(vid)) {
			} else {
				Session.set("uniqueVolId", vid);
				Router.go("volSignout");
			}
		}
	},
	'keyup .vol-phone-input': function(event, template) {
		setVolFilter(template);
		return false;
	},
	'change select': function(event, template) {
		Session.set("volLocation", $("#location option:selected").text()); 
	},
	'click [type="submit"]': function(event, template) {
		// open timecard with the selected location
		var tcId = initTimecard(Session.get("uniqueVolId"), Session.get("volLocation"));
		Session.set("volNewTcId", tcId);
		Router.go('volSigninSuccess');
		Session.set("uniqueVolId", null);
		Session.set("uniqueVolFound", false);
	},
	'click [type="tryagain"]': function(event, template) {
		Session.set("uniqueVolId", null);
		Session.set("uniqueVolFound", false);
		Session.set("searchError", null);
	},
});

Template.volSignout.events({
	'click [type="signout"]': function(event, template) {
		// get the open timecard and update it
		vid = Session.get("uniqueVolId");
		closeTimecard(vid);
		Session.set("uniqueVolId", null);
		Session.set("uniqueVolFound", false);
		Session.set("searchError", null);
		Router.go("volunteer");
	}
});

Template.volsignin.locations = function() {
	return Locations.find();
};

Template.volsignin.rendered = function() {
	var searchElement = document.getElementsByClassName('vol-phone-input');
	if(!searchElement)
		return;
	var filterValue = Session.get("volSearchFilter");

	var pos = 0;
	if (filterValue)
		pos = filterValue.length;

	searchElement[0].focus();
	searchElement[0].setSelectionRange(pos, pos);
};

Template.volSigninSuccess.helpers({
	timeLogged: function() {
		var timestamp = VolunteerTimecards.find({_id: Session.get("volNewTcId")}).fetch()[0].timeOpened;
		var readableTime = moment(timestamp).format("h:mm a");
		var readableDate = moment(timestamp).format("MMMM Do, YYYY");
		return readableTime + " on " + readableDate;
	},
	locLogged: function() {
		return VolunteerTimecards.find({_id: Session.get("volNewTcId")}).fetch()[0].location;
	}
});
