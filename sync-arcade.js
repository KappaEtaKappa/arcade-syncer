var fs = require('fs');

var watch = require('node-watch');
var util = require('util');
var exec = require('child_process').exec;

var deltaPath = '/mnt/delta1/arcade';
var arcadePath = '/home/player/RetroPie';
var jobCounter =0;
var currentJobs = 0;
var maxJobs = 5;

watch(deltaPath, function(filename){
	var file = filename.split(deltaPath)[1];
	file = file.replace(/ /g, '\\ ').replace(/\)/g, '\\)').replace(/\(/g, '\\(')
		   .replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\$/g, '\\$');
	var fileExists = fs.existsSync(filename);
	var cmd = "";
	var job = ++jobCounter;

	if(fileExists){ //not a deletion
		cmd = 'scp -pr "' + filename + '" ' + 'player@10.0.0.13:"' + arcadePath + file + '"';
		console.log('Job:'+job+'\('+currentJobs+'//'+maxJobs+'\) Add/Sync: ', cmd);
	}else{ //is a deletion
		cmd = 'ssh player@10.0.0.13 "rm -r ' + arcadePath + file + '"';
		console.log('Job:'+job+'\('+currentJobs+'//'+maxJobs+'\) Delete: ', cmd);
	}
	checkThenRun(cmd, job);
});

function checkThenRun(cmd, job){
	if(currentJobs >= maxJobs){
		console.log("Warning: Max number of current jobs met, waiting 200ms");
		setTimeout(function(){checkThenRun(cmd, job);}, 200);
	}else{
		currentJobs++;
		var child = exec(cmd, function(error, stdout, stderr){ 
                	if(error) console.log('Job:'+job+' Error: ' + error);
                	else console.log('Job:'+job+' Synced! ' + stdout);
        		currentJobs--;
		});
	}
}
