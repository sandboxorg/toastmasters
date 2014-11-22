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

	Toastmasters.TableTopic.FIXTURES = result.tableTopics;
	Toastmasters.TableTopicsRoute = Ember.Route.extend({
		model: function() {
			return this.store.find('tableTopic', Math.floor(Math.random() * (1 - result.tableTopics.length) + result.tableTopics.length));
		}
	});
});
