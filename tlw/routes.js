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
	this.route('dashboard');
	this.route('vols');
	this.route('newvol');
	this.route('volsignin');
	this.route('volsignout');
	this.route('newVolunteer', {
		path: '/newvolunteer',
		template: 'newVolunteerForm'
	});
	this.route('sign-in', {
		path: '/sign-in',
		template: 'entrySignIn',
	});
});

// BeforeHooks
var IR_BeforeHooks = {
	isLoggedIn: function(pause) {
		if (!(Meteor.loggingIn() || Meteor.user())) {
			//Notify.setError(__('Please log in.'));
			console.log('ERROR: need to be logged in.');
			/* so, the difference between 
			 *		this.render
			 *	and
			 *		Router.go
			 * mostly has to do with whether the route/URL
			 * will be changed. so, using this.render will not
			 * redirect to a different URL the way that Router.go
			 * will, I think. Plus, this.render takes a TEMPLATE
			 * name and Router.go takes a ROUTE.
			 * also, a thing that happens (?) is that after
			 * logging in, the 'farmops' template briefly renders
			 * before getting re-routed to /dashboard
			 * ...
			 * obvs, just need to get IR to take different actions
			 * at /dashboard, eventually for different 'roles'?
			 */
			this.render('entrySignIn');
			//Router.go('sign-in');
			pause();
		}
	}
}

// global before hooks, for any route
//Router.onBeforeAction(IR_BeforeHooks.somethingForAnyRoute);

// use these before hooks on specific routes:
Router.onBeforeAction(IR_BeforeHooks.isLoggedIn, {
	only: ['admin', 'farmops']
});
