module.exports = function(grunt) {

  // Configuration
  grunt.initConfig({
    htmllint: {
      all: ['html-temp/*.html', 'index.html']
    },
    concat: {
      js: {
        src: ['components/*/*.js'],
        dest: 'prod/main.js'
      }
    },
    sass: {
      compile: {
        options: {
          update: true
        },
        files: [{
          src: 'components/main.scss',
          dest: 'prod/main.css'
        }]
      }
    },
    uglify: {
      build: {
        files: [{
          src: ['components/*/*.js'],
          dest: 'prod/main.min.js'
        }]
      }
    },
    watch: {
      css: {
        files: ['components/*/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['components/*/*.js'],
        tasks: ['concat'],
        options: {
          livereload: true
        }
      }
    },
    version: {
      src: ['package.json', 'index.html'],
      options: {
        prefix: '[\?]?version[\'\"]?[=:]\\s*[\'\"]?'
      }
    },
    exec: {
      add: 'git add .',
      commit: {
          cmd: function () {
            var oldPkg = this.config('pkg'),
                pkg = grunt.file.readJSON('package.json'),
                msg = "Updating from ' + oldPkg.version + ' to ' + pkg.version + '",
                cmd = 'git commit -m ' + msg;
            return cmd;
          }
      },
      push: 'git push'
    },
    imagemin: {
        dynamic: {
          files: [{
            expand: true,
            src: ['img/*.{png,jpg,jpeg,gif}'],  // Glob patterns to match
            dest: ''                  // Destination directory
          }]
        }
      }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-html');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  // Register tasks
  grunt.registerTask('build', ['uglify', 'sass', 'imagemin']); // 'grunt build' to run this
  grunt.registerTask('default', ['concat', 'sass', 'watch']); // 'grunt' to run this
  grunt.registerTask('deploy', function (type) {
    type = type || 'patch';
    grunt.task.run(['version::' + type, 'exec:add', 'exec:commit', 'exec:push']);
  });
};

