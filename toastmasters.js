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
	},

	elapsedMinutesAndSeconds: function(start, end) {
		var diff = Math.abs(end.getTime() - start.getTime()),
			dDiff = new Date(),
			s = new Date(0);

		dDiff.setTime(diff);

		var minutes = dDiff.getMinutes() - s.getMinutes();
		var seconds = dDiff.getSeconds() - s.getSeconds();
		return {minutes: minutes, seconds: seconds};
	},

	formatStamp: function(stamp) {
		if (stamp.seconds < 10) {
			stamp.seconds = '0' + stamp.seconds;
		}
		return stamp.minutes + ':' + stamp.seconds;
	},

	startTiming: function(id, name) {
		var $stopBtn = $('#stop-btn');
		$('#current-timer-who').text(name);
		$stopBtn.data('timer', id);
		$('#timer').addClass('timing');

		tm.timing = true;
		var start = new Date(),
			onTick = function() {
				var now = new Date(),
					stamp = _fn.elapsedMinutesAndSeconds(start, now),
					stampStr = _fn.formatStamp(stamp);

				$('#current-timer-time').text(stampStr);
				$stopBtn.data('time', stampStr);

				if (tm.timing) {
					setTimeout(onTick, 1000);
				}
			};
		onTick();
	},

	stopTiming: function() {
		tm.timing = false;
		var $this = $(this);
		console.log($this.data('time'));
		$('#timer')
			.removeClass('timing')
			.removeClass('red')
			.removeClass('yellow')
			.removeClass('green');
	}
},

tm = {
	timer_range: {
		one_two		:	{green: 1, yellow:1.5, red: 2},
		two_three	:	{green: 2, yellow:2.5, red: 3},
		five_seven	:	{green: 5, yellow:6,   red: 7}
	},
	timing: false
};

Ember.Handlebars.helper('elapsedTime', function(start, end){
	if (start !== null && end !== null && start !== undefined && end !== undefined) {
		var elapsed = _fn.elapsedMinutesAndSeconds(start, end),
			minutes = elapsed.minutes,
			seconds = elapsed.seconds;

		if (seconds < 10) {
			seconds = '0' + seconds;
		}

		return new Ember.Handlebars.SafeString(minutes + ':' + seconds);
	} else {
		return new Ember.Handlebars.SafeString("0:00");
	}
});

$.getJSON('table-topics.json', function(result){
	window.Toastmasters = Ember.Application.create();
	Toastmasters.ApplicationAdapter = DS.FixtureAdapter.extend();

	Toastmasters.Router.map(function(){
		this.resource('home', {path: '/'});
		this.resource('timer', {path: '/timer'});
		this.route('refreshTableTopics', {path: '/tableTopics/refresh'});
		this.resource('ahCounter', {path: '/ahCounter'});
		this.resource('voteCounter', {path: '/voteCounter'});
		this.resource('tableTopics', {path: '/tableTopics'});
		this.resource('info', {path: '/info'});
	});

	Toastmasters.Timer = DS.Model.extend({
		who: DS.attr('string'),
		start: DS.attr('date'),
		end: DS.attr('date'),
		green: DS.attr('number'),
		yellow: DS.attr('number'),
		red: DS.attr('number'),
		listGroupItemClass: function() {
			var start = this.get('start'), end = this.get('end'), red = this.get('red');
			if (start !== null && end !== null && start !== undefined && end !== undefined) {
				var minutes = _fn.elapsedMinutesAndSeconds(start, end).minutes;
				if (minutes + 0.5 > red) {
					return new Handlebars.SafeString("list-group-item-danger");
				} else {
					return new Handlebars.SafeString("list-group-item-success");
				}
			} else {
				return new Handlebars.SafeString("");
			}
		}.property('start', 'end', 'range')
	});

	Toastmasters.AhCounter = DS.Model.extend({
		who: DS.attr('string'),
		ahCount: DS.attr('number'),
		crutchCount: DS.attr('number'),
		wotdCount: DS.attr('number')
	});

	Toastmasters.Vote = DS.Model.extend({
		who: DS.attr('string'),
		count: DS.attr('number')
	});

	Toastmasters.TableTopic = DS.Model.extend({
		question: DS.attr('string')
	});

	Toastmasters.HomeRoute = Ember.Route.extend({
		activate: function() {
			_fn.activeNav('.navbar-brand');
		}
	});

	Toastmasters.Timer.FIXTURES = [
		{
			id: 1,
			who: "Judy",
			start: null,
			end: null,
			green: tm.timer_range.five_seven.green,
			yellow: tm.timer_range.five_seven.yellow,
			red: tm.timer_range.five_seven.red
		},
		{
			id: 2,
			who: "Steve",
			start: new Date("2014", "11", "22", "14", "22", "01"),
			end: new Date("2014", "11", "22", "14", "29", "04"),
			green: tm.timer_range.five_seven.green,
			yellow: tm.timer_range.five_seven.yellow,
			red: tm.timer_range.five_seven.red
		},
		{
			id: 3,
			who: "Dave",
			start: new Date("2014", "11", "22", "14", "22", "01"),
			end: new Date("2014", "11", "22", "14", "23", "27"),
			green: tm.timer_range.one_two.green,
			yellow: tm.timer_range.one_two.yellow,
			red: tm.timer_range.one_two.red
		}
	];
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

	Toastmasters.RefreshTableTopicsRoute = Ember.Route.extend({
		activate: function() {
			this.transitionTo('tableTopics');
		}
	});

	Toastmasters.InfoRoute = Ember.Route.extend({
		activate: function() {
			_fn.activeNav('#info-nav');
		}
	});
});

$(document).on('ready', function(){
	$(document)
		.on('click', _fn.handleNavClick)
		.on('click', '.start-btn:visible', function(){
			var $this = $(this);
			_fn.startTiming($this.attr('id'), $this.data('name'));
		})
		.on('click', '#stop-btn', _fn.stopTiming);

});
