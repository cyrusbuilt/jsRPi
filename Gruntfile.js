'use strict';

module.exports = function(grunt) {
    const APP_VER = JSON.stringify(require('./package.json').version).replace(/\"/g, "");
    const webpack = require("webpack");
    const path = require('path');

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
            // We currently need the force flag so that build will complete on non-native hosts, since the pi-spi module
            // does not properly build the required module when installing on non-raspberry pi hosts. pi-spi is
            // currently only being used by jsrpi.IO.PiFaceGpioDigital. By forcing the build we can still get that class
            // into the final build output. The --force flag is specified in package.json for the 'npm run build'
            // command. So when running a build, either use 'npm run build' or 'grunt default --force' or just
            // 'grunt --force'.
            jsrpi: {
                entry: './src/jsrpi.js',
                output: {
                    path: path.resolve(__dirname, 'build'),
                    filename: 'jsrpi-' + APP_VER + '-bundle.js'
                },
                stats: {
                    colors: true,
                    modules: true,
                    reasons: true
                },
                target: 'node',
                progress: true,
                watch: false,
                keepalive: false,
                inline: false
            }
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
