/*global require: true */
/*global __dirname: true */
/*global setImmediate: true */
/*global process: true */

(function () {
	'use strict';

	/* require */
	var spawn  = require('child_process').spawn,
		exec   = require('child_process').exec,
		colors = require('colors'),
		Q	   = require('q');

	/* child processes */
	var	applications   = ['puredata', 'ffmpeg', 'ffserver', 'jack'],
		puredata,
		ffmpeg,
		ffserver,
		jack,
		jack_ffmpeg_connect = null;

	// load all processes
	puredata = spawn('./puredata/start');
	puredata.loaded = false;

	puredata.stdout.on('data', function (data) {
		if ((data.toString().indexOf('jackd')) === 0 && !puredata.loaded) {

			ffmpeg = spawn('./ffmpeg/start');
			ffmpeg.loaded = false;

			ffmpeg.stdout.on('data', function (data) {
				if (!ffmpeg.loaded) {
			    	ffmpeg.loaded = true;

			    	console.log('streaming to ffmpeg'.blue);

			    	jack = spawn('./jack/start');
			    	jack.loaded = false;

					jack.stdout.on('data', function (data) {
						console.log("stdout: jack: ".yellow + data);
						
						if (jack_ffmpeg_connect === null) {
							console.log('jack connected');
							jack_ffmpeg_connect = spawn('./jack/connect');
							jack_ffmpeg_connect.stdout.on('data', function (data) {console.log("stdout: jack_ffmpeg_connect: ".yellow + data); });
							jack_ffmpeg_connect.on('exit', function (code) {console.log("exit: jack_ffmpeg_connect: code: ".cyan, code); });
							jack_ffmpeg_connect.stderr.on('data', function (data) {console.log("stderr: jack_ffmpeg_connect: ".red, data.toString())});
						}
					});
					jack.on('exit', function (code) {console.log("exit: jack: code: ".cyan, code); });
					jack.stderr.on('data', function (data) {console.log("stderr: jack: ".red, data.toString())});

					// ffserver = spawn('./ffserver/start');
					// ffserver.loaded = false;
					// ffserver.stdout.on('data', function (data) {console.log("stdout: ffserver: ".yellow + data); });
					// ffserver.on('exit', function (code) {console.log("exit: ffserver: code: ".cyan, code); });
					// ffserver.stderr.on('data', function (data) {"stderr: ffserver: ".red, data});
			    }
			});
			ffmpeg.on('exit', function (code) {console.log("exit: ffmpeg: code: ".cyan, code); });
			ffmpeg.stderr.on('data', function (data) {});
		}
	});
	puredata.on('exit', function (code) {console.log("exit: puredata: code: ".cyan, code); });
	puredata.stderr.on('data', function (data) {});

	console.log('intraurban. running...');

}());