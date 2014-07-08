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
	timeLogged: function() {
		var timestamp = VolunteerTimecards.find({_id: Session.get("volNewTcId")}).fetch()[0].timeOpened;
		var readableTime = moment(timestamp).format("h:mm a");
		var readableDate = moment(timestamp).format("MMMM Do, YYYY");
		return readableTime + " on " + readableDate;
	}
});

Template.volsignin.helpers({
	signedIn: function() {
		if (Session.get("doneSigning")) {
			return true;
		}
		return false;
	},
	uniqueVolFound: function() {
		var n = filteredVolsQuery(Session.get("volSearchFilter"));
		var sc = Session.get("searchClicked");
		if (n.count() === 1 && sc) {
			return true;
		} else {
			return false;
		}
	},
});

Template.volsignin.events({
	'click [type="search"]': function(event, template) {
		//fire some event to look up a volunteer based on what's in the search field...
		console.log("ok, trying to search...");
		var output = searchVols(Session.get("volSearchFilter"));
		if (output === 0) {
			console.log("couldn't find any volunteers.");
		} else {
			console.log("ok...");
		}
		Session.set("searchClicked", true);
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
