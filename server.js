/*global require: true */
/*global __dirname: true */
/*global setImmediate: true */
/*global process: true */

(function () {
	'use strict';

	/* require */
	var spawn  = require('child_process').spawn,
		exec  = require('child_process').exec,
		colors = require('colors'),
		Q	   = require('q');

	var ps = function (script, name, show_err) {

		if (typeof script === 'undefined')
			throw Error('command must be present for "ps"');
		else
			this.script = script;

		if (typeof name === 'undefined')
			this.name = 'unknown script name';
		else
			this.name = name;

		if (typeof show_err === 'undefined')
			this.show_err = false;
		else
			this.show_err = show_err;
	};

	ps.prototype.run = function () {
		var deferred = Q.defer();

		this.process = spawn(this.script);
    	
    	console.log('spawn : ' + this.name + ' : started'.blue);

		this.process.stdout.on('data', function (data) {
			console.log("stdout: " + this.name + ": ".yellow + data);
		}.bind(this));
		if (this.show_err) {
			this.process.on('exit', function (code) {console.log("exit: " + this.name + " code: ".cyan, code); }.bind(this));
			this.process.stderr.on('data', function (data) {deferred.resolve(); console.log("stderr: " + this.name + " ".red, data.toString())}.bind(this));
		}

		return deferred.promise;
	};

	ps.prototype.exit = function () {
		var deferred = Q.defer(),
			_name = this.name;

    	console.log('process : ' + this.name + ' : started'.blue);

		this.process = exec(this.script, function (error, stdout, stderr) {
			console.log("exit: " + _name + "".cyan);
			deferred.resolve();
		});		

		return deferred.promise;
	};

	/* child processes */
	var	clear_ps = new ps('./stop', 'clear_ps'),
		puredata = new ps('./puredata/start', 'puredata'),
		ffmpeg = new ps('./ffmpeg/start', 'ffmpeg', true),
		ffserver = new ps('./ffserver/start', 'ffserver'),
		jack = new ps('./jack/start', 'jack'),
		jack_ffmpeg_connect = new ps('./jack/connect', 'jack -> ffmpeg', true);

	clear_ps.exit()
		.then(jack.run())
		.then(puredata.run())
		.then(ffmpeg.run())
		.then(function () {
			setTimeout(function () {
				jack_ffmpeg_connect.run();
			}, 1500);
		});

	console.log('intraurban. running...');

}());