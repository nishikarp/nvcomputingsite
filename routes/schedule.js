let tz = require('timezone/loaded');

let timeStr = '%A, %B %d, %Y - %I:%M %p';
let schedule = require('../upcomingevents.json');

module.exports.set = (app) => {
	app.get('/schedule', (req, res) => {
		let data = schedule.upcomingEvents.sort((a, b) => {
			return a.time - b.time;
		}).map((o) => {
			let obj = JSON.parse(JSON.stringify(o));
			if(Date.now() / 1000 >= obj.time) {
				obj.pastDue = true;
				obj.notPastDue = false;
			}
			obj.time = tz(obj.time * 1000, timeStr, 'en_EN', 'America/Chicago');
			return obj;
		});

		let data2 = schedule.deadlines.sort((a, b) => {
			return a.time - b.time;
		}).map((o) => {
			let obj = JSON.parse(JSON.stringify(o));
			obj.time = tz(obj.time * 1000, timeStr, 'en_EN', 'America/Chicago');
			return obj;
		});

		res.render('schedule', {
			upcomingEvents: data,
			deadlines: data2,
			title: "Upcoming Events | Neuqua Valley Computing Team",
			schedulePage: true
		});
	})
}
