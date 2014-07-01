Template.navFarmops.helpers({
	activeIfTemplateIs: function (template) {
		var currentRoute = Router.current();
		return currentRoute &&
			template === currentRoute.lookupTemplate() ? 'active' : '';
	}
});

Template.farmops.helpers({
	today: function (template) {
		var date = new Date;
		//date.setUTCHours(0,0,0,0);
		return date;
	}
});

