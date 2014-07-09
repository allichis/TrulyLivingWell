// update search filter no more than 2 times per second
var setVolFilter = _.throttle(function(template) {
	var search = template.find(".vol-phone-input").value;
	Session.set("volSearchFilter", search);
}, 500);

Template.volMatch.helpers({
	showTc: function() {
		return VolunteerTimecards.find({_id: Session.get("volNewTcId")}).fetch();
	},
	timeOpenedReadable: function() {
		var timestamp = VolunteerTimecards.find({_id: Session.get("volNewTcId")}).fetch()[0].timeOpened;
		var readableTimestamp = moment(timestamp).format("MMM Do YYYY");
		return readableTimestamp;
	},
	vols: function() {
		return searchVols(Session.get("volSearchFilter"));
	},
});

Template.signinSuccess.helpers({
	volRecord: function() {
		var vol = Session.get("foundVol");
		return vol;
	},
	foundVol: function() {
		return Session.get("foundVol");
	},
	timecard: function() {

					/*
		var timestamp = VolunteerTimecards.find({_id: Session.get("volNewTcId")}).fetch()[0].timeOpened;
		var readableTime = moment(timestamp).format("h:mm a");
		var readableDate = moment(timestamp).format("MMMM Do, YYYY");
		return readableTime + " on " + readableDate;
		*/
	}
});

Template.volsignin.helpers({
	signedIn: function() {
		if (Session.get("foundVol")) {
			return true;
		}
		return false;
	},
});

Template.volsignin.events({
	'click [type="search"]': function(event, template) {
		var searchResponse = searchVols(Session.get("volSearchFilter"));
		var responseIsNumber = Match.test(searchResponse, Number);
		if (responseIsNumber) {
			// search found 0 or 1+ results, show some messages...
			if (searchResponse === 0)
				console.log("found zero volunteers");
			else
				console.log("found more than one");
		} else {
			// assume search found exactly 1 result...
			console.log("found:");
			console.log(searchResponse.fetch());
			//Session.set("foundVol", searchResponse);
			var foundVid = searchResponse.fetch()[0]._id;
			Session.set("foundVol", foundVid);
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

	searchElement[0].focus();
	searchElement[0].setSelectionRange(pos, pos);
};
