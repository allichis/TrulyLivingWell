// PRODUCTS

Template.deleteProductModalInner.helpers({
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

Template.deleteProductModalInner.events({
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

Template.updateProductModalInner.helpers({
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

Template.updateProductModalInner.events({
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

Template.deleteLocationModalInner.helpers({
	name: function () {
		if (this.name && this.name.length)
			return this.name;
		return "";
	},
	locationInScope: function() {
		return Session.get('locationInScope');
	}
});

Template.deleteLocationModalInner.events({
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

Template.updateLocationModalInner.helpers({
	name: function () {
		if (this.name && this.name.length)
			return this.name;
		return "";
	},
	locationInScope: function() {
		return Session.get('locationInScope');
	}
});

Template.updateLocationModalInner.events({
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
};

// REQUESTS

Template.deleteRequestModalInnerAdmin.helpers(
	modalHelpers
);

Template.deleteRequestModalInnerAdmin.events({
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

Template.updateRequestModalInnerAdmin.helpers(
	modalHelpers
);

// HARVEST LOG

Template.deleteHarvestModalInnerAdmin.helpers(
	modalHelpers
);

Template.deleteHarvestModalInnerAdmin.events({
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

Template.updateHarvestModalInnerAdmin.helpers(
	modalHelpers
);


