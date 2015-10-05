'use strict';

module.exports = function(grunt) {
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
      src: ['dist', 'docs']
    },
    // concat: {
    //   options: {
    //     banner: '<%= banner %>',
    //     stripBanners: true,
    //     separator: ';'
    //   },
    //   dist: {
    //     src: ['src/<%= pkg.name %>.js', 'src/lib/**/*.js'],
    //     dest: 'dist/ba-<%= pkg.name %>.js'
    //   },
    // },
    // uglify: {
    //   options: {
    //     banner: '<%= banner %>'
    //   },
    //   dist: {
    //     src: '<%= concat.dist.dest %>',
    //     dest: 'dist/ba-<%= pkg.name %>.min.js'
    //   },
    // },
    qunit: {
      files: ['tests/**/*.html']
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
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
    },
    'jsdoc-ng' : {
      'dist' : {
        template : 'default',
        dest: 'docs',
        src: ['src/**/*.js']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  //grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc-ng');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'jsdoc-ng']);
};
