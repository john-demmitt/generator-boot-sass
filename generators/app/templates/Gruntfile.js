"use strict";

//  grunt is a module exporting a single function
module.exports = function (grunt) {

    //  shows detailed time information about tasks for optimizing build times
    require('time-grunt')(grunt);

    //  configuration of all tasks
    grunt.initConfig({
		sass: {                                                             //    sass compiler - automatically creates sourcemaps
			dist: {
				options: {
					style: 'compressed'
				},
				files: [{
					expand: true,
					cwd: 'styles',
					src: ['main.scss'],
					dest: 'styles',
					ext: '.min.css'
				}]
			}
		},
        watch: {                                                            //  watch files for changes and run tasks
            styles: {
                files: ['styles/*.scss'],
                tasks:['sass']
            }
        }
    });

    /**********************************************/

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('ghost', ['watch']);

    //	define default tasks to be run when calling 'grunt'
    grunt.registerTask('default', ['sass']);
};