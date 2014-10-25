'use strict';
var serverRootUri = 'http://127.0.0.1:8000';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mochaPhantomJsTestRunner = serverRootUri + '/test/index.html';
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        distdir: './public/dist',
        libsdir: './public/lib',
        jshint: {
            fast: [
                   'app/**/*.js',
                   'Gruntfile.js',
               ],
            test: [
                    'app/**/*.js',
                    'test/**/*.js',
                    '!test/browserified_tests.js', //ignore this file
                    'Gruntfile.js'
                ],
            options: {
                jshintrc: '.jshintrc',
                jshintignore: '.jshintignore'
            }
        },
        // run the mocha tests via Node.js
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    run: true,
                    force: true
                },
                src: ['test/**/*.js', '!test/casper/**/*.js']
            }
        },
        // remove all previous browserified builds
        clean: {
            app: ['<%= distdir %>/app.js'],
            libs: ['<%= distdir %>/libs.js'],
            tests: ['./test/browserified_tests.js'],
        },
        browserify: {
            options: {
                transform: ['hbsfy'] //need to find a proper way to shim this
            },
            app: {
                src: ['./app/app.js'],
                dest: '<%= distdir %>/app.js',
                options: {
                    standalone: 'Bullpen',
                    debug: true,
                    alias: [
                        '<%= libsdir %>/jquery.js:jquery',
                        '<%= libsdir %>/underscore.js:underscore',
                        '<%= libsdir %>/backbone.js:backbone',
                        '<%= libsdir %>/jquery.validate.js:jquery_validate'

                    ],
                    external: [
                        '<%= libsdir %>/jquery.js',
                        '<%= libsdir %>/underscore.js',
                        '<%= libsdir %>/backbone.js',
                        '<%= libsdir %>/jquery_validate.js'
                    ]
                }
            },

            libs: {
                options: {
                    shim: {
                        jquery: {
                            path: '<%= libsdir %>/jquery.js',
                            exports: '$'
                        },
                        underscore: {
                            path: '<%= libsdir %>/underscore.js',
                            exports: '_',
                            depends: {
                                jquery: '$'
                            }
                        },
                        backbone: {
                            path: '<%= libsdir %>/backbone.js',
                            exports: 'Backbone',
                            depends: {
                                underscore: '_',
                                jquery: '$'
                            }
                        },
                        jquery_validate: {
                            path: '<%= libsdir %>/jquery.validate.js',
                            exports: 'jquery_validate',
                            depends: {
                                jquery: 'jQuery'
                            }
                        },
                        hbsfy: {
                            path: './node_modules/hbsfy/index.js',
                            exports: 'hbsfy'
                        }
                    },
                },
                src: [
                    '<%= libsdir %>/*.js'
                ],
                dest: '<%= distdir %>/libs.js'
            },

            tests: {
                src: ['./test/suite.js'],
                dest: './test/browserified_tests.js',
            }

        },
        uglify: {
            dist: {
                files: {
                    '<%= distdir %>/app.min.js': ['<%= distdir %>/app.js']
                }
            },
            lib: {
                files: {
                    '<%= distdir %>/libs.min.js': ['<%= distdir %>/libs.js']
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    './public/dist/css/minified.css' : [
                        './public/css/bootstrap.min.css',
                        './public/css/font-awesome.css',
                        './public/css/global.css',
                        './public/css/worker.css',
                        './public/css/animate.css',
                        './public/css/loading.css'
                        // './public/css/*.css'
                    ]
                }
            }
        },
        open: {
            public_index: {
                path: serverRootUri + '/public/unpack.html'
                //path: serverRootUri //root
            },
            test: {
                path: serverRootUri + '/test'
            }
        },
        connect: {
            proxies: [
                {
                    rules: {
                    //todo: requires grunt-connect-rewrite
                        '^(.*)$': '/public/$1 [L]'
                    }
                }
            ],
            server: {

            },
            livereload: {
                options: {
                    middleware: function( connect ){
                        return [
                            lrSnippet,
                            mountFolder(connect, './')
                        ];
                    }
                }
            },
            keepalive: {
                options: {
                    keepalive: true
                }
            }

        },
        'mocha_phantomjs': {
            all: {
                options: {
                    urls: [
                        mochaPhantomJsTestRunner
                    ],
                    run: true,
                    force: true
                }
            }
        },
        casper:{
            all: {
                options: {
                    test: true,
                    verbose: true,
                    logLevel: 'debug',
                    pageSettings: {
                        loadImages: false,
                        loadPlugins: false,
                        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
                    },
                },
                files: {
                    src: ['./test/casper/casper_test.js']
                }
            }
        },
        watch: {
            options: {
                forever: true,
                livereload: true
            },
            fast: {
                files: ['./app/**/*.js', './app/**/*.hbs'],
                tasks: ['watching-fast']
            },
            testBrowser:{
                files: [
                    './app/**/*.js',
                    './app/**/*.hbs',
                    './test/**/*.js',
                    '!./test/casper/**/*.js',
                    '!./test/browserified_tests.js'
                ],
                tasks: ['watching-test-browser']
            }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-casper');
    grunt.loadNpmTasks('grunt-open');
    grunt.registerTask('default', [ //just lint and compile
        'jshint:test',
        'clean',
        'browserify',
        'uglify', //minimizes - use for production
        'cssmin'
    ]);

    grunt.registerTask('casperjs', [
        'jshint:test',
        'browserify:app',
        'connect:server',
        'casper'
    ]);

    grunt.registerTask('serve', [ //open public page
        'jshint:fast',
        'browserify:app',
        'connect:livereload', //refreshes page
        'open:public_index', //opens page
        'cssmin',
        'watch:fast' //watches for changes
    ]);

    grunt.registerTask('srv', [ //version of serve, already open
        'jshint:fast',
        'browserify:app',
        'connect:livereload', //refreshes page
        'cssmin',
        'watch:fast' //watches for changes
    ]);

    grunt.registerTask('watching-fast', [  //repeat task for watching
        'jshint:fast',
        'cssmin',
        'browserify:app', // only browserify the app
        'browserify:libs' //DELETE THIS
    ]);

    grunt.registerTask('watching-test-browser', [
        'jshint:test',
        'browserify:app',
        'browserify:tests',
        'cssmin',
    ]);

    grunt.registerTask('server', [ 'connect:keepalive']); //just keep server running

    grunt.registerTask('test-browser', [ //open /test page
        'jshint:test',
        'browserify:tests',
        'connect:livereload', //refreshes page
        'cssmin',
        'open:test', //opens page
        'watch:testBrowser' //watches for changes
    ]);

    grunt.registerTask('tst', [
        'jshint:test',
        'browserify:tests',
        'connect:livereload',
        'watch:testBrowser'
    ]);

    grunt.registerTask('test', [
        'jshint:test',
        'browserify:tests',
        'browserify:app',
        'cssmin',
        'connect:server',
        'mocha_phantomjs',
        'casper'
    ]);


    grunt.registerTask('usetheforce_on',   // keeps tasks directly following it from failing via --force
     'force the force option on if needed',
     function() {
      if ( !grunt.option( 'force' ) ) {
        grunt.config.set('usetheforce_set', true);
        grunt.option( 'force', true );
      }
    });

    grunt.registerTask('usetheforce_restore',  // allows tasks to fail
      'turn force option off if we have previously set it',
      function() {
      if ( grunt.config.get('usetheforce_set') ) {
        grunt.option( 'force', false );
      }
    });


};