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
	var	applications   = ['puredata', 'ffmpeg', 'jack'],
		puredata,
		ffmpeg,
		jack;

	puredata = spawn('./puredata/start');
	puredata.loaded = false;
	puredata.stdout.on('data', function (data) {console.log("stdout: puredata: ".yellow + data); });
	puredata.on('exit', function (code) {console.log("exit: puredata: code: ".cyan, code); });

	puredata.stderr.on('data', function (data) {

	    if ((data.toString().indexOf('error: complete')) === 0 && !puredata.loaded) {

	    	puredata.loaded = true;

	    	ffmpeg = spawn('./ffmpeg/start');
			ffmpeg.loaded = false;
			ffmpeg.stdout.on('data', function (data) {console.log("stdout: ffmpeg: ".yellow + data); });
			ffmpeg.on('exit', function (code) {console.log("exit: ffmpeg: code: ".cyan, code); });

			ffmpeg.stderr.on('data', function (data) {
			    if ((data.toString().indexOf('size=')) === 0 && !ffmpeg.loaded) {
			    	ffmpeg.loaded = true;
			    	
			    	jack = spawn('./jack/start');
					jack.loaded = false;
					jack.stdout.on('data', function (data) {console.log("stdout: jack: ".yellow + data); });
					jack.on('exit', function (code) {console.log("exit: jack: code: ".cyan, code); });
					jack.stderr.on('data', function (data) {});

			    }
			});

	    }
	    
	});

	/* run all stop scripts */
	// Q.all(applications.map(function (app) {

	// 	var deferred = Q.defer();

	// 	setImmediate(function () {
	// 		exec('./' + app + '/stop', function (err, stdout, stderr) {
	// 			return deferred.resolve(stdout, stderr);
	// 		});
	// 	});

	// 	return deferred.promise;

	// })).then(function (e) {

	// 	console.log('stop scripts :'.yellow, e);

	// 	// create/run all spawn applications
		
		
	// });


	console.log('intraurban. running...');

}());