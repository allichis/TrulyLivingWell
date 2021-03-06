Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	yieldTemplates: {
		'navbar': {to: 'header'},
		'navAdmin': {to: 'headerAdmin'},
		'navFarmops': {to: 'headerFarmops'}
	}
});

Router.map(function() {
	this.route('home', {
		path: '/',
	});
	this.route('volunteer');	
	this.route('volAbout');
	this.route('newvol');	
	this.route('volsignin');	
	this.route('volSigninSuccess');
	this.route('volSignout');

	this.route('visitorCheckIn');
	this.route('visitorForm');
	this.route('visitors');
	this.route('visitorConfirmation');	

	this.route('reports');
	this.route('selectReport');
	this.route('updateReport');
	this.route('viewReport');

	this.route('farmops', {
		layoutTemplate: 'layoutFarmops',
	});
	this.route('harvestRequests', {
		layoutTemplate: 'layoutFarmops',
	});
	this.route('harvestLog', {
		layoutTemplate: 'layoutFarmops',
	});

	this.route('admin', {
		layoutTemplate: 'layoutAdmin',
	});
	this.route('accountsAdmin', {
		layoutTemplate: 'layoutAdmin',
	});
	this.route('locationsAdmin', {
		layoutTemplate: 'layoutAdmin',
	});
	this.route('requestsAdmin', {
		layoutTemplate: 'layoutAdmin',
	});
	this.route('harvestAdmin', {
		layoutTemplate: 'layoutAdmin',
	});
	this.route('volunteersAdmin', {
		layoutTemplate: 'layoutAdmin',
	});
	this.route('volunteerTimecardsAdmin', {
		layoutTemplate: 'layoutAdmin',
	});
	this.route('visitorsAdmin', {
		layoutTemplate: 'layoutAdmin',
	});
	this.route('visitTypesAdmin', {
		layoutTemplate: 'layoutAdmin',
	});
	this.route('productsAdmin', {
		layoutTemplate: 'layoutAdmin',
	});
	this.route('dashboard');
	this.route('sign-in', {
		path: '/sign-in',
		template: 'loginPlease',
	});
});

// BeforeHooks
var IR_BeforeHooks = {
	isLoggedIn: function(pause) {
		if (!(Meteor.loggingIn() || Meteor.user())) {
			console.log('ERROR: need to be logged in.');
			//this.render('loginPlease');
			Router.go('sign-in');
			pause();
		}
	}
}

// global before hooks, for any route
//Router.onBeforeAction(IR_BeforeHooks.somethingForAnyRoute);

// use these before hooks on specific routes:
Router.onBeforeAction(IR_BeforeHooks.isLoggedIn, {
	//only: ['admin', 'farmops']
	except: ['home', 
			'sign-in', 
			'volunteer',
			'volAbout',
			'newvol',
			'volsignin',
			'volSigninSuccess',
			'volSignout',
			'visitorCheckIn',
			'visitorForm',
			'visitors',
			'visitorConfirmation',	
	]
});
