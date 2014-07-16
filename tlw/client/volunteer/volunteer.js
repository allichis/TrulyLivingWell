Session.setDefault("uniqueVolFound", false);
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

Template.volunteer.helpers({
	searchResults: function() {
		return Volunteers.search(Session.get('volsSearchQuery'));
				   },
	volsSearchQuery: function() {
		return Session.get('volsSearchQuery');
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
		}
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
			vid = response.fetch()[0]._id;
			Session.set("uniqueVolId", vid);
			Session.set("uniqueVolFound", true);
		}
	},
	'keyup .vol-phone-input': function(event, template) {
		setVolFilter(template);
		return false;
	},
	'click [type="submit"]': function(event, template) {
		if (!okToOpenTimecard(Session.get("uniqueVolId"))) {
			console.log("already an open timecard.");
		} else {
			// should be ok, so create a new timecard
			var tcId = initTimecard(Session.get("uniqueVolId"));
			Session.set("volNewTcId", tcId);
			Router.go('volSigninSuccess');
			Session.set("uniqueVolId", null);
			Session.set("uniqueVolFound", false);
		}
	},
	'click [type="tryagain"]': function(event, template) {
		Session.set("uniqueVolId", null);
		Session.set("uniqueVolFound", false);
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

	searchElement[0].focus();
	searchElement[0].setSelectionRange(pos, pos);
};

Template.volSigninSuccess.helpers({
	timeLogged: function() {
		var timestamp = VolunteerTimecards.find({_id: Session.get("volNewTcId")}).fetch()[0].timeOpened;
		var readableTime = moment(timestamp).format("h:mm a");
		var readableDate = moment(timestamp).format("MMMM Do, YYYY");
		return readableTime + " on " + readableDate;
	}
});
