var fs = require('fs');

var watch = require('node-watch');
var util = require('util');
var exec = require('child_process').exec;

var deltaPath = '/mnt/delta1/arcade';
var arcadePath = '/home/pi/RetroPie/roms';

watch(deltaPath, function(filename){
	var file = filename.split(deltaPath)[1];
	file = file.replace(/ /g, '\\ ').replace(/\)/g, '\\)').replace(/\(/g, '\\(')
		   .replace(/\'/g, "\\'").replace(/\"/g, '\\"').replace(/\$/g, '\\$');
	var fileExists = fs.existsSync(filename);
	var cmd = "";

	if(fileExists){ //not a deletion
		cmd = 'scp -pr "' + filename + '" ' + 'pi@10.0.0.39:"' + arcadePath + file + '"';
		console.log('Add/Sync: ', cmd);
	}else{ //is a deletion
		cmd = 'ssh pi@10.0.0.39 "rm -r ' + arcadePath + file + '"';
		console.log('Delete: ', cmd);
	}
	var child = exec(cmd, function(error, stdout, stderr){
		if(error) console.log("Error: " + error);
		else console.log('Synced! ' + stdout);
	});
});
