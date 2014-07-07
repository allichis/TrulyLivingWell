// VOLUNTEERS
Template.updateVolunteerModal.helpers({
	volunteerInScope: function() {
		return Session.get('volunteerInScope');
	}
});

Template.updateVolunteerModal.events({

});

Template.deleteVolunteerModal.helpers({
	volunteerInScope: function() {
		return Session.get('volunteerInScope');
	}
});

Template.deleteVolunteerModal.events({
	'click .btn-danger': function(event, template) {
		Meteor.call('deleteVolunteer', this._id, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
			$("#deletevolunteer").modal("hide");
		});
	}
});


// PRODUCTS

Template.deleteProductModal.helpers({
	itemname: function () {
		if (this.itemname && this.itemname.length)
			return this.itemname;

		/*if (this.services) {
			//Iterate through services
			for (var serviceName in this.services) {
				var serviceObject = this.services[serviceName];
				//If an 'id' isset then assume valid service
				if (serviceObject.id) {
					if (serviceObject.email) {
						return serviceObject.email;
					}
				}
			}
		}*/
		return "";
	},
	productInScope: function() {
		return Session.get('productInScope');
	}
});

Template.deleteProductModal.events({
	'click .btn-danger': function(event, template) {
		Meteor.call('deleteProduct', this._id, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
			$("#deleteproduct").modal("hide");
		});
	}
});

Template.updateProductModal.helpers({
	itemname: function () {
		if (this.itemname && this.itemname.length)
			return this.itemname;

		/*if (this.services) {
			//Iterate through services
			for (var serviceName in this.services) {
				var serviceObject = this.services[serviceName];
				//If an 'id' isset then assume valid service
				if (serviceObject.id) {
					if (serviceObject.email) {
						return serviceObject.email;
					}
				}
			}
		}*/
		return "";
	},
	productInScope: function() {
		return Session.get('productInScope');
	}
});

Template.updateProductModal.events({
	'click .btn-primary': function(event, template) {
		var productname = template.find(".admin-product-info").value;
		var productid = this._id;

		Meteor.call('updateProduct', productid, productname, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}

			$("#updateproduct").modal("hide");
		});
	}
});


// LOCATIONS

Template.deleteLocationModal.helpers({
	name: function () {
		if (this.name && this.name.length)
			return this.name;
		return "";
	},
	locationInScope: function() {
		return Session.get('locationInScope');
	}
});

Template.deleteLocationModal.events({
	'click .btn-danger': function(event, template) {
		Meteor.call('deleteLocation', this._id, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
			$("#deletelocation").modal("hide");
		});
	}
});

Template.updateLocationModal.helpers({
	name: function () {
		if (this.name && this.name.length)
			return this.name;
		return "";
	},
	locationInScope: function() {
		return Session.get('locationInScope');
	}
});

Template.updateLocationModal.events({
	'click .btn-primary': function(event, template) {
		var locationname = template.find(".admin-location-info").value;
		var locationid = this._id;

		Meteor.call('updateLocation', locationid, locationname, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}

			$("#updatelocation").modal("hide");
		});
	}
});


var modalHelpers = {
	itemInScope: function() {
		return Session.get('itemInScope');
	},
	displaydate: function(date) {
		return moment.utc(date).format("LL");
	},
	locationOptions: function() {
	    var options = [];
	    var locations = Locations.find().fetch();
	    for(i=0; i<locations.length; i++){
	    	var locname = locations[i].name;
	    	options.push({label: locname, value: locname})
	    }
	    return options;
	},
	productOptions: function() {
	    var options = [];
	    var products = Products.find({}, {sort: {itemname:1}}).fetch();
	    for(i=0; i<products.length; i++){
	    	var itemname = products[i].itemname;
	    	options.push({label: itemname, value: itemname})
	    }
	    return options;
	},
	visitTypeOptions: function() {
	    var options = [];
	    var visittypes = VisitTypes.find({}, {sort: {title:1}}).fetch();
	    for(i=0; i<visittypes.length; i++){
	    	var title = visittypes[i].title;
	    	options.push({label: title, value: title})
	    }
	    return options;
	},
};

// REQUESTS

Template.deleteRequestModalAdmin.helpers(
	modalHelpers
);

Template.deleteRequestModalAdmin.events({
	'click .btn-danger': function(event, template) {
		Meteor.call('deleteRequest', this._id, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
			$("#deleterequestadmin").modal("hide");
		});
	}
});

Template.updateRequestModalAdmin.helpers(
	modalHelpers
);

// HARVEST LOG

Template.deleteHarvestModalAdmin.helpers(
	modalHelpers
);

Template.deleteHarvestModalAdmin.events({
	'click .btn-danger': function(event, template) {
		Meteor.call('deleteHarvestLogItem', this._id, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
			$("#deleteharvestadmin").modal("hide");
		});
	}
});

Template.updateHarvestModalAdmin.helpers(
	modalHelpers
);


// VISITORS
Template.deleteVisitorModal.helpers(
	modalHelpers
);

Template.deleteVisitorModal.events({
	'click .btn-danger': function(event, template) {
		Meteor.call('deleteVisitor', this._id, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
			$("#deletevisitor").modal("hide");
		});
	}
});

Template.updateVisitorModal.helpers(
	modalHelpers
);

// VISIT TYPES

Template.deleteVisitTypeModal.helpers(
	modalHelpers
);

Template.deleteVisitTypeModal.events({
	'click .btn-danger': function(event, template) {
		Meteor.call('deleteVisitType', this._id, function(error) {
			if (error) {
				// optionally use a meteor errors package
				if (typeof Errors === "undefined")
					Log.error('Error: ' + error.reason);
				else {
					Errors.throw(error.reason);
				}
			}
			$("#deletevisittype").modal("hide");
		});
	}
});

Template.updateVisitTypeModal.helpers(
	modalHelpers
);