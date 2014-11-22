!function($){
	var _fn = {
		activeNav: function(selector) {
			if (selector !== undefined) {
				$('#main-nav li').removeClass('active');
				$(selector).addClass('active');
			}
			return $('#main-nav li.active');
		},

		handleNavClick: function() {
			$('#main-nav.collapse:visible').collapse('hide');
		}
	};

	$.getJSON('table-topics.json', function(result){
		window.Toastmasters = Ember.Application.create();
		Toastmasters.ApplicationAdapter = DS.FixtureAdapter.extend();

		Toastmasters.Router.map(function(){
			this.resource('home', {path: '/'});
			this.resource('timer', {path: '/timer'});
			this.resource('ahCounter', {path: '/ahCounter'});
			this.resource('voteCounter', {path: '/voteCounter'});
			this.resource('tableTopics', {path: '/tableTopics'});
			this.resource('info', {path: '/info'});
		});

		Toastmasters.Timer = DS.Model.extend({
			who: DS.attr('string'),
			start: DS.attr('date'),
			end: DS.attr('date')
		});

		Toastmasters.AhCounter = DS.Model.extend({
			who: DS.attr('string'),
			ahCount: DS.attr('int'),
			crutchCount: DS.attr('int'),
			wotdCount: DS.attr('int')
		});

		Toastmasters.Vote = DS.Model.extend({
			who: DS.attr('string'),
			count: DS.attr('int')
		});

		Toastmasters.TableTopic = DS.Model.extend({
			question: DS.attr('string')
		});

		Toastmasters.HomeRoute = Ember.Route.extend({
			activate: function() {
				_fn.activeNav('.navbar-brand');
			}
		});

		Toastmasters.Timer.FIXTURES = [];
		Toastmasters.TimerRoute = Ember.Route.extend({
			activate: function() {
				_fn.activeNav('#timer-nav');
			},
			model: function() {
				return this.store.find('timer');
			}
		});

		Toastmasters.AhCounter.FIXTURES = [];
		Toastmasters.AhCounterRoute = Ember.Route.extend({
			activate: function() {
				_fn.activeNav('#ah-counter-nav');
			},
			model: function() {
				return this.store.find('ahCounter');
			}
		});

		Toastmasters.Vote.FIXTURES = [];
		Toastmasters.VoteCounterRoute = Ember.Route.extend({
			activate: function() {
				_fn.activeNav('#vote-counter-nav');
			},
			model: function() {
				return this.store.find('vote');
			}
		});

		Toastmasters.TableTopic.FIXTURES = result.tableTopics;
		Toastmasters.TableTopicsRoute = Ember.Route.extend({
			activate: function() {
				_fn.activeNav('#table-topics-nav');
			},
			model: function() {
				return this.store.find('tableTopic', Math.floor(Math.random() * (1 - result.tableTopics.length) + result.tableTopics.length));
			}
		});

		Toastmasters.InfoRoute = Ember.Route.extend({
			activate: function() {
				_fn.activeNav('#info-nav');
			}
		});
	});

	$(document).on('ready', function(){
		$('#navbar-main').on('click', 'a', _fn.handleNavClick);
	})
}(jQuery);
