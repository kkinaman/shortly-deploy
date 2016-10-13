module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['public/client/**/*.js', 'public/lib/**/*.js'],
        dest: 'public/dist/build.js',
      },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      target: {
        files: {
          'public/dist/build.min.js': ['public/dist/build.js']
        }
      }
    },

    gitpush: {
      target: {
        options: {
          remote: 'live', branch: 'master'
        }
      }
    },

    eslint: {
      target: [
        // Add list of files to lint here
        'app/**/*.js', 'lib/**/*.js', 'public/client/**/*.js', 'server.js', 'server-config.js'
      ]
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'eslint',
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////
  grunt.registerTask('default', [
    
  ]);

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  //elint should be first so that if it fails, the rest won't run
  grunt.registerTask('build', [
    'eslint', 'test'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run(['deploy', 'gitpush']);
    } else {
      grunt.task.run([ 'build', 'concat', 'uglify']);
    }
  });


};
