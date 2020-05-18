var shell = require('shelljs');
module.exports = function (grunt) {
    var env = grunt.option('env');
    if (!env) {
        throw new Error("You must provide --env option");
    }
    grunt.initConfig({
        clean: ['dist/'],
        browserify: {
            dist: {
                files: {
                    'dist/js/scripts.js': [
                        'src/js/**/*.js',
                        'src/vue/**/*.vue',
                        'build/env.js'
                    ]
                }
            },
            options: {
                transform: ['vueify', 'babelify']
            }
        },
        rework: {
            'dist/css/style.css': ['css/style.css'],
            options: {
                vendors: ['-moz-', '-webkit-']
            }
        },
        copy: {
            env: {
                src: 'src/env/' + env + '.js',
                dest: 'build/env.js'
            },
            html: {
                src: 'src/index.html',
                dest: 'dist/index.html'
            },
            assets: {
                src: ['**'],
                dest: 'dist',
                expand: true,
                cwd: 'src/assets'
            }
        },
        watch: {
            scripts: {
                files: ['src/**', 'Gruntfile.js', 'package*.json'],
                tasks: ['default'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        }
    });
    grunt.registerTask('clean-build', 'Clean env file from build directory', function () {
        // grunt.task.run('clean', ['build'])
    });


    grunt.registerTask('dto', 'Build DTOs from Kotlin code', function () {
        shell.exec(
            'kotlinc-js -no-stdlib ../backend/src/main/kotlin/org/chriego/overwatch/counters/Dto.kt -output build/dto.js; du -sh build/js/dto.js'
        );
    });


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-rework');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-vueify');

    grunt.registerTask('default', ['clean', 'dto', 'copy', 'browserify', 'rework', 'clean-build']);
};
