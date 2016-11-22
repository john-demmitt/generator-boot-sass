'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var appName;
var baseDir;
var baseRef;
var generator;

var prepareAppName = function(rawAppName) {
	rawAppName = rawAppName.replace(/(-.)/g, function(letter){return letter.toUpperCase()});
	rawAppName = rawAppName.replace(/(&.)/g, function(letter){return letter.toUpperCase()});
	rawAppName = rawAppName.replace(/(\s.)/g, function(letter){return letter.toUpperCase()});
	return rawAppName.charAt(0).toUpperCase() + rawAppName.slice(1);
};

var getBaseRef = function(path) {
	if (path.indexOf('/var/www/html') > -1) {
  	return path.slice(13)+'/';
  } else if (path.indexOf('/var/www') > -1) {
  	return path.slice(8)+'/';
  }
}

module.exports = yeoman.generators.Base.extend({
	init: function () {
		generator = this;
	},
	prompting: function () {
		var done = this.async();
		// Have Yeoman greet the user.
		this.log(yosay('Welcome to the ' + chalk.red('Bootstrap') + ' website generator!'));

		//  Questions to ask the user
		var prompts = [
			{
				type: 'input',
				name: 'name',
				message: 'What is the title of the website?',
				default: this.appName
			},
			{
				type: 'input',
				name: 'description',
				message: 'How should we decribe the website?',
				default: this.appDescription
			}
		];

		//  Ask questions.
		this.prompt(prompts, function (props) {
			this.props = props;
			// To access props later use this.props.someOption;
			this.appName = this.props.name;
			appName = prepareAppName(this.appName);
			baseDir = this.destinationRoot();
			baseRef = getBaseRef(baseDir)+this.appName+'/';
			this.appDescription = this.props.description;
			this.config.set('appName', this.appName);
			this.config.save();
			done();
		}.bind(this));
	},

	default: function () {
		this.log(yosay('Please wait while your ' + chalk.red('website') + ' is set up!'));
		this.destinationRoot(baseDir+'/'+this.appName);

		generator.fs.copyTpl(
			generator.templatePath('package.json'),
			generator.destinationPath('package.json'),
			{ appName: generator.appName,
			  appDescription: generator.appDescription
			}
		);

		generator.fs.copyTpl(
			generator.templatePath('_index.html'),
			generator.destinationPath('index.html'),
			{ AppName: appName,
			  baseRef: baseRef
			}
		);

		generator.fs.copy(
			generator.templatePath('_main.scss'),
			generator.destinationPath('styles/main.scss')
		);

		//  Fetch front dependencies.
		generator.log(yosay('Fetching ' + chalk.red('dependencies') + '.'));
		var npmInstall = generator.spawnCommand('npm', ['install', '--save-dev',
																   'bootstrap',
																   'time-grunt',
																   'grunt',
																   'grunt-contrib-watch',
																   'grunt-sass',
														]);

		npmInstall.on('close', function(argument) {
			generator.destinationRoot(baseDir+'/'+generator.appName+'/node_modules');
			var gitInstall = generator.spawnCommand('git', ['clone', 'https://github.com/tagawa/bootstrap-without-jquery.git']);

			//  Copy Gruntfile
			generator.log(yosay('Configuring and running ' + chalk.red('grunt') + '.'));
			generator.destinationRoot(baseDir+'/'+generator.appName);
			generator.fs.copy(
				generator.templatePath('Gruntfile.js'),
				generator.destinationPath('Gruntfile.js')
			);

			//  Run Grunt.
			var runGrunt = generator.spawnCommand('grunt');
		}.bind(generator));

	
	}
});