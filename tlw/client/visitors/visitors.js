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
	tourOptions: function() {
	    var options = [];
	    var tours = Tours.find({}, {sort: {title:1}}).fetch();
	    for(i=0; i<tours.length; i++){
	    	var title = tours[i].title;
	    	options.push({label: title, value: title})
	    }
	    return options;
	},
	tourAddOnOptions: function() {
	    var options = [];
	    var touraddons = TourAddOns.find({}, {sort: {title:1}}).fetch();
	    for(i=0; i<touraddons.length; i++){
	    	var title = touraddons[i].title;
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

AutoForm.hooks({
	insertVisitorForm: {
		onSuccess: function () {
			// show visitor check-in confirmation modal...
			console.log("form submit success...");
			$('#visitorconfirmation').modal("show");
			return false;
		}
	}
});