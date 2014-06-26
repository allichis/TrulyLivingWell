Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	yieldTemplates: {
		'navbar': {to: 'header'},
		'navAdmin': {to: 'headerAdmin'}
	}
});

Router.map(function() {
	this.route('home', {
		path: '/',
	});
	this.route('volunteer');	
	this.route('newvol');	
	this.route('volsignin');	
	this.route('volsignout');	

	this.route('farmops');
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
	this.route('volunteersAdmin', {
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
			'newvol',
			'volsignin',
			'volsignout',
	]
});
