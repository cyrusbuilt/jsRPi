'use strict';

module.exports = function(grunt) {
    const webpackConfig = require('./webpack.config');

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
        jsdoc: {
            dist: {
                src: [
					'README.md',
					'src'
				],
                options: {
					recurse: true,
                    destination: 'docs',
                    template: "node_modules/ink-docstrap/template",
                    configure: "node_modules/ink-docstrap/template/jsdoc.conf.json",
                    debug: true
                }
            }
        },
        webpack: {
            options: {
                progress: true,
                keepalive: false,
                stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            },
            prod: webpackConfig,
            dev: Object.assign({ watch: true }, webpackConfig)
        },
        watch: {
            files: [
                '<%= jshint.gruntfile.src %>',
                '<%= jshint.src.src %>',
                '<%= jshint.test.src %>'
            ],
            tasks: ['jshint'],
            options: {
                spawn: false,
                interrupt: true
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['jshint', 'nodeunit', 'clean', 'jsdoc', 'webpack']);
    grunt.registerTask('test', ['nodeunit']);
};
