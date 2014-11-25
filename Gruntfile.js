/**
 * Created by steve on 11/21/14.
 */

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        wiredep: {
            task: {
                src: ['index.html']
            }
        },
        'gh-pages': {
            options: {
                base: 'build',
                repo: 'https://' + process.env.GH_TOKEN + '@github.com/stevegood/toastmasters.git',
                silent: true
            },
            src: '**/*'
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            build: ['Gruntfile.js', 'toastmasters.js']
        },
        uglify: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'build/toastmasters.js': 'toastmasters.js'
                }
            }
        },
        cssmin: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'build/toastmasters.css': 'toastmasters.css'
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ['index.html', 'icon.png', 'table-topics.json', 'bower_components/**'], dest: 'build/'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
};
