// CT TASK RUNNER FOR BUILDING MICROSITES AND WIDGETS

module.exports = function(grunt) {

    var imageminMozjpeg = require('imagemin-mozjpeg');
    var imageminGifsicle = require('imagemin-gifsicle');
    var imageminOptipng = require('imagemin-optipng');
    var imageminSvgo = require('imagemin-svgo');

    // Accessing parameters set on command line
    var copysite      = grunt.option('copysite'),
        clientId      = grunt.option('clientId'),
        project       = grunt.option('project'),
        foldername    = grunt.option('foldername'),
        locale        = grunt.option('locale'),
        currency      = grunt.option('currency'),
        campaignId    = grunt.option('campaignId'),
        campaignName  = grunt.option('campaignName'),
        dir           = '',
        config        = {};

    // Default value if parameter is not set
    copysite      = ( (copysite     === '') || (typeof copysite     === 'undefined') ) ? 'boilerplate'        : copysite;
    clientId      = ( (clientId     === '') || (typeof clientId     === 'undefined') ) ? '122070'             : clientId;
    locale        = ( (locale       === '') || (typeof locale       === 'undefined') ) ? 'en'                 : locale;
    currency      = ( (currency     === '') || (typeof currency     === 'undefined') ) ? 'usd'                : currency;
    campaignId    = ( (campaignId   === '') || (typeof campaignId   === 'undefined') ) ? '453324'             : campaignId;
    campaignName  = ( (campaignName === '') || (typeof campaignName === 'undefined') ) ? 'LuxairPricingFeed'  : campaignName;

    // Configurable paths
    config = {
      app: '../app/views/microsites/'+project+'/',
      dist: '../app/views/widgets/'+project+'/',
      foldername: foldername,
      copysite: copysite,
      clientId: clientId,
      project: project,
      locale: locale,
      currency: currency,
      campaignId: campaignId,
      campaignName: campaignName
    };

    if (project == 'genericsites') {
      config.app = '../app/views/'+project+'/'
    }

    // Report elapsed execution time of grunt tasks. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
          // watch microsites
          microsites: {
            files: [
              '../sass/*',
              '<%= config.app %>assets/sass/*'
            ],
            tasks: ['default']
          },
          // watch html widgets
          htmlwidgets: {
            files: [
              '<%= config.app %>*html.hbs'
            ],
            tasks: ['htmlwidgets']
          },
          // watch js widgets
          jswidgets: {
            files: [
              '<%= config.app %>*js.hbs'
            ],
            tasks: ['jswidgets']
          },
          options: {
            // Start a live reload server on the default port 35729
            livereload: true
          }
        },

        // Copy files and folders
        copy: {
          // As part of move to grunt project copy scss files to sass folder in assets
          sass: {
            expand: true,
            flatten: true,
            src: ['sass/ctwdk.scss','<%= config.app %>assets/_custom.scss','<%= config.app %>assets/_settings.scss','<%= config.app %>assets/_settings-desktop.scss','<%= config.app %>assets/_settings-ms.scss'], 
            dest: '<%= config.app %>assets/sass/',
            options: {
              process: function (content, srcpath) {
                return content.replace(/ui\/ms/gi,"../../../../../ctwdk/sass/ui/ms");
              }
            }
          },
          // Create new microsite project using boilerplate
          site: {
            expand: true,
            cwd: '../app/views/microsites/<%= config.copysite %>/',
            src: ['**'], 
            dest: '<%= config.app %>',
            options: {
              process: function (content, srcpath) {
                content = content.replace(/122070/gi,config.clientId);
                content = content.replace(/boilerplate/gi,config.project);
                content = content.replace(/default.locale=en/gi,"default.locale="+config.locale);
                content = content.replace(/site.currency=eur/gi,"site.currency="+config.currency);
                content = content.replace(/453324_LuxairPricingFeed_ENEUR/gi,config.campaignId+"_"+config.campaignName+"_"+config.locale+config.currency);
                return content;
              }
            }
          }
        },

        // Assembles content with html layout for js widgets
        assemble: {
          options: {
            layoutdir: '../app/views/layouts/widgets',
            flatten: true
          },
          pages: {
            src: ['<%= config.app %>*js.hbs'],
            dest: '<%= config.dist %>'
          }
        },

        // minifies html layout for js widgets
        htmlmin: {
          dist: {
            options: {
              removeComments: true,
              collapseWhitespace: true,
              minifyCSS: true,
              removeStyleLinkTypeAttributes: false
            },
            files: [{
              expand: true,     // Enable dynamic expansion.
              cwd: '<%= config.dist %>',      // Src matches are relative to this path.
              src: ['**/*html.html'], // Actual pattern(s) to match.
              dest: '<%= config.app %>',   // Destination path prefix.
              //ext: 'js.hbs',   // Dest filepaths will have this extension.
              //extDot: 'first',   // Extensions in filenames begin after the first dot
              rename : function(dest, src) {
                var folder = src.substring(0, src.lastIndexOf('/'));
                var filename = src.substring(src.lastIndexOf('/'), src.length);
                filename = filename.substring(0, filename.lastIndexOf('.'));
                filename = filename.replace('html','')
                return dest + filename + 'js.hbs';
              }
            }]
          }
        },

        useminPrepare: {
          html: '<%= config.app %>widget_597552_js.hbs'
        },

        // Takes your scss files and compiles them to css
        compass: {
          // preprocess microsite styles
          microsites: {
            options: {
              basePath: '../ctwdk',
              sassDir: '<%= config.app %>assets/sass',
              cssDir: '<%= config.app %>assets/css',
              outputStyle: 'expanded'
            }
          }
        },
        imagemin: {                          // Task
          common: {                         // Another target
            options: {                       // Target options
              optimizationLevel: 6,
              progressive: true,
              interlaced: true,
              svgoPlugins: [],
              use: [
                imageminMozjpeg({quality: 80}),
                imageminGifsicle({interlaced: true}),
                imageminOptipng({optimizationLevel: 3})
              ]
            },
            files: [{
              expand: true,                  // Enable dynamic expansion
              cwd: '../assets/img',                   // Src matches are relative to this path
              src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
              dest: '../assets/img'                  // Destination path prefix
            }]
          },
          microsites: {                         // Another target
            options: {                       // Target options
              optimizationLevel: 6,
              progressive: true,
              interlaced: true,
              svgoPlugins: [],
              use: [
                imageminMozjpeg({quality: 80}),
                imageminGifsicle({interlaced: true}),
                imageminOptipng({optimizationLevel: 3}),
                imageminSvgo({plugins: [{removeViewBox: false}, {removeEmptyAttrs: false}]})
              ]
            },
            files: [{
              expand: true,                  // Enable dynamic expansion
              cwd: '<%= config.app %>assets/img',                   // Src matches are relative to this path
              src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
              dest: '<%= config.app %>assets/img'                  // Destination path prefix
            }]
          },
          genericsites: {                         // Another target
            options: {                       // Target options
              optimizationLevel: 6,
              progressive: true,
              interlaced: true,
              svgoPlugins: [],
              use: [
                imageminMozjpeg({quality: 80}),
                imageminGifsicle({interlaced: true}),
                imageminOptipng({optimizationLevel: 3})
              ]
            },
            files: [{
              expand: true,                  // Enable dynamic expansion
              cwd: '../app/views/genericsites/assets/img',                   // Src matches are relative to this path
              src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
              dest: '../app/views/genericsites/assets/img'                  // Destination path prefix
            }]
          },
        },
        sprite:{
          all: {
            src: '<%= config.app %>assets/img/<%= config.foldername %>/*.png',
            dest: '<%= config.app %>assets/img/<%= config.foldername %>.png',
            destCss: '<%= config.app %>assets/img/<%= config.foldername %>.css'
          }
        },

        // Inlines the CSS
        premailer: {
          options: {
            mode           : 'html',
            baseUrl        : '',
            queryString    : '',
            css            : [],
            removeClasses  : false,
            removeComments : false,
            preserveStyles : true,
            lineLength     : 65,
            ioException    : false,
            verbose        : true
          },
          files: {
            expand : true,
            src    : '<%= config.app %>*.hbs',
            dest   : '<%= config.dist %>',
            rename : function(dest, src) {
              var folder = src.substring(0, src.lastIndexOf('/'));
              var filename = src.substring(src.lastIndexOf('/'), src.length);
              filename = filename.substring(0, filename.lastIndexOf('.'));
              return dest + filename + '.html';
            }
          }
        },

        // Premailer output encoding resolution
        replace: {
          dist: {
            src: ['<%= config.dist %>*html.html'], // source files array (supports minimatch)
            dest: '<%= config.dist %>', // destination directory or file
            replacements: [{
              from: '&amp;',
              to: '&'
            }, {
              from: '&gt;',
              to: '>'
            }, {
              from: '%24',
              to: '$'
            }, {
              from: '%7B',
              to: '{'
            }, {
              from: '%7D',
              to: '}'
            }, {
              from: /<html>|<\/html>|<body>|<\/body>|<p>|<\/p>/ig,
              to: ''
            }, {
              from: /<!DOCTYPE(.+).dtd">/ig,
              to: ''
            }, {
              from: /http:\/\/localhost:9000/ig,
              to: '${rootURL}'
            }, {
              from: /\.\.\/img/ig,
              to: '${rootURL}/resource/<%= config.project %>/assets/img'
            }]
          },
          ctwlayout: {
            src: ['<%= config.app %>*js.hbs'],
            dest: '<%= config.app %>',
            replacements: [{
              from: /util\s\.widget\.vehicle/ig,
              to: 'util.widget.Vehicle'
            }, {
              from: /^/gi,
              to: '--- layout: default.hbs ---'
            }]
          }
        },

        // Use Mailgun option to email the design to your inbox or to something like Litmus
        // mailgun login credentials - login:azacharias@cartrawler.com passowrd:Classon377$
        mailgun: {
          mailer: {
            options: {
              key: 'key-0ce6f200bebfca9ccf4886a023e55edc', // Enter your Mailgun API key here
              sender: 'postmaster@sandbox4b338cd195fa42a9afb24af78565ae8c.mailgun.org', // Change this
              recipient: 'azacharias@cartrawler.com', // Change this
              subject: 'This is a test email'
            },
            src: ['<%= config.dist %>'+grunt.option('template')]
          }
        },

        // Used for compilesassall task, deletes css files intially and recreate them using process-compilesassall task
        clean: {
          css: ["<%= config.app %>assets/css/ctwdk*.css"],
          ctwdk: ['<%= config.app %>assets/ctwdk','<%= config.app %>assets/_custom.scss','<%= config.app %>assets/_settings.scss','<%= config.app %>assets/_settings-desktop.scss','<%= config.app %>assets/_settings-ms.scss']
        },

        // Used for compilesassall task, generates folder list
        folder_list: {
          options: {
            files: false
          },
          files : {
            cwd: '../app/views/microsites/',
            src: ['*'], 
            dest: 'folderlist.json'
          }
        }

    });

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('assemble');

    // Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', [
      'compass'
    ]);

    grunt.registerTask('htmlwidgets', [
      'compass',
      'newer:premailer',
      'replace:dist',
      'htmlmin',
      'replace:ctwlayout'
    ]);

    grunt.registerTask('jswidgets', [
      'newer:assemble'
    ]);

    grunt.registerTask('copysass', [
      'newer:copy:sass'
    ]);

    grunt.registerTask('createsite', [
      'copy:site'
    ]);

    // USAGE: grunt send --project=[projectname] --template=widget.html
    grunt.registerTask('send', 'Send test email to your inbox', ['mailgun']);

    // Following task used to process-compilesassall tool kit for all the projects, folderlist->compilesassall->process-compilesassall
    grunt.registerTask('folderlist', 'Generates folder list', ['folder_list']);

    // update ctwdk in all projects
    grunt.registerTask('compilesassall', function () {
      processfolderlist('compilesassall');
    });

    grunt.registerTask('process-compilesassall', 'Precompiling ctwdk for the generated folder list!', function(obj) {
      config.app = obj;
      console.log("-----------------"+obj.replace('../app/views/microsites', "").toUpperCase()+"-----------------");
      grunt.task.run('clean:css');
      grunt.task.run('default');
      }
    );

    // Optimise images in all projects
    grunt.registerTask('imageminall', function () {
      processfolderlist('newer:imageminall');
    });
    grunt.registerTask('imagemincommon', [
      'newer:imagemin:common'
    ]);
    grunt.registerTask('imagemingenericsites', [
      'imagemin:genericsites'
    ]);
    grunt.registerTask('imagemin', [
      'newer:imagemin:microsites'
    ]);

    grunt.registerTask('process-imageminall', 'Precompiling ctwdk for the generated folder list!', function(obj) {
      config.app = obj;
      console.log("-----------------"+obj.replace('../app/views/microsites', "").toUpperCase()+"-----------------");
      grunt.task.run('imagemin:microsites');
      }
    );

    // Delete ctwdk in all projects
    grunt.registerTask('deletectwdkall', function () {
      processfolderlist('deletectwdkall');
    });

    grunt.registerTask('process-deletectwdkall', 'Delete ctwdk for all projects!', function(obj) {
      config.app = obj;
      console.log("-----------------"+obj.replace('../app/views/microsites', "").toUpperCase()+"-----------------");
      grunt.task.run('clean:ctwdk');
      }
    );

    // copy sass to all projects
    grunt.registerTask('copysassall', function () {
      processfolderlist('copysassall');
    });

    grunt.registerTask('process-copysassall', 'Copy sass folder to the generated folder list!', function(obj) {
      config.app = obj;
      console.log("-----------------"+obj.replace('../app/views/microsites', "").toUpperCase()+"-----------------");
      grunt.task.run('copy:sass:'+config.app);
      }
    );

    function processfolderlist(obj) {
      var folderJSON = grunt.file.readJSON('./folderlist.json');

      for (var i = 0, total = folderJSON.length; i < total; i++) {
        dir = folderJSON[i].location;
        config.app = '../app/views/microsites/'+dir+'/';
        grunt.task.run('process-'+obj+':'+config.app);
      }
    }

};