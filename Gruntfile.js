module.exports = function(grunt) {

    grunt.initConfig({

        /**
         * @property pkg
         * @type {Object}
         */
        pkg: grunt.file.readJSON('package.json'),

        /**
         * @property jshint
         * @type {Object}
         */
        jshint: {
            all: 'module/*.js',
            options: {
                jshintrc: '.jshintrc',
                reporterOutput: ''
            }
        },

        /**
         * @property uglify
         * @type {Object}
         */
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> by <%= pkg.author %> created on <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: ['dist/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },

        /**
         * @property compress
         * @type {Object}
         */
        compress: {
            main: {
                options: {
                    archive: 'releases/<%= pkg.version %>.zip'
                },
                files: [
                    { flatten: true, src: 'dist/<%= pkg.name %>.js', dest: './', filter: 'isFile' }
                ]
            }
        },

        /**
         * @property concat
         * @type {Object}
         */
        concat: {
            options: {
                separator: '\n\n'
            },
            dist: {
                src: ['module/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        /**
         * @property copy
         * @type {Object}
         */
        copy: {
            vendor: {
                expand: true,
                flatten: true,
                src: ['module/*'],
                dest: 'example/js/vendor/ng-contextmenu',
                filter: 'isFile'
            },
            release: {
                src: 'releases/<%= pkg.version %>.zip',
                dest: 'releases/master.zip'
            }

        },

        /**
         * @property jasmine
         * @type {Object}
         */
        jasmine: {
            pivotal: {
                src: ['module/*.js'],
                options: {
                    specs: 'tests/spec.js',
                    helpers: [
                                'example/js/vendor/angular/angular.js',
                                'example/js/vendor/angular-mocks/angular-mocks.js'
                             ]
                }
            }
        },

        /**
         * @property watch
         * @type {Object}
         */
        watch: {
            scripts: {
                files: ['module/*.js'],
                tasks: ['build'],
                options: {
                    spawn: false
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('build', ['concat', 'uglify', 'copy', 'compress']);
    //grunt.registerTask('test', ['jshint', 'jasmine']);
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['test', 'build']);

};