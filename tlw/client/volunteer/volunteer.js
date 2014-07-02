// update search filter no more than 2 times per second
var setVolFilter = _.throttle(function(template) {
	var search = template.find(".vol-phone-input").value;
	console.log("search term: " + search);
	Session.set("volSearchFilter", search);
}, 500);

Template.volMatch.helpers({
	showTc: function() {
		return VolunteerTimecards.find({_id: Session.get("volNewTcId")}).fetch();
	},
	timeOpenedReadable: function() {
		var timestamp = VolunteerTimecards.find({_id: Session.get("volNewTcId")}).fetch()[0].timeOpened;
		var readableTimestamp = moment(timestamp).format("MMM Do YY");
		return readableTimestamp;
	},
	vols: function() {
		return filteredVolsQuery(Session.get("volSearchFilter"));
	},
});

Template.volsignin.helpers({
	uniqueVolFound: function() {
		var n = filteredVolsQuery(Session.get("volSearchFilter"));
		if (n.count() === 1) {
			return true;
		} else {
			return false;
		}
	},
	/* 3 functions used for development: */
	volFoundTest: function() {
		var n = filteredVolsQuery(Session.get("volSearchFilter"));
		return n.count();
	},
	vols: function() {
		return filteredVolsQuery(Session.get("volSearchFilter"));
	},
});

Template.volsignin.events({
	'click .glyphicon-search': function(event, template) {
		console.log("ugh");
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
