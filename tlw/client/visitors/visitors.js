Template.visitorCheckIn.helpers({
	visitTypeOptions: function() {
	    var options = [];
	    var visittypes = VisitTypes.find({}, {sort: {title:1}}).fetch();
	    for(i=0; i<visittypes.length; i++){
	    	var title = visittypes[i].title;
	    	options.push({label: title, value: title})
	    }
	    return options;
	},
});

Template.visitorForm.helpers({
	visitTypeOptions: function() {
	    var options = [];
	    var visittypes = VisitTypes.find({}, {sort: {title:1}}).fetch();
	    for(i=0; i<visittypes.length; i++){
	    	var title = visittypes[i].title;
	    	options.push({label: title, value: title})
	    }
	    return options;
	},
});