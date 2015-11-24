'use strict';

module.exports = function(grunt) {
  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config.js");
	
  //  Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> -' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration
    clean: {
      src: ['build', 'docs']
    },
    nodeunit: {
      all: ['tests/**/*-tests.js'],
      options: {
        reporter: 'default'
      }
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'tests/.jshintrc'
        },
        src: ['tests/**/*.js']
      },
    },
    'jsdoc-ng' : {
      'dist' : {
        template : 'default',
        dest: 'docs',
        src: ['src/**/*.js']
      }
    },
	 webpack: {
		 options: webpackConfig,
		 jsrpi: {
			 stats: {
				 colors: true,
				 modules: true,
				 reasons: true
			 },
			 progress: true,
			 faileOnError: true,
			 watch: false,
			 keepalive: false,
			 inline: false,
			 hot: false
		 }
	 }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc-ng');
  grunt.loadNpmTasks('grunt-webpack');

  // Default task.
  grunt.registerTask('default', ['jshint', 'clean', 'jsdoc-ng', 'nodeunit', 'webpack']);
};
