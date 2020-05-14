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
                        'dist/env.js'
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
                dest: 'dist/env.js'
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
    grunt.registerTask('clean-env', 'Clean env file from build directory', function () {
        grunt.task.run('clean', ['dist/env.js'])
    });


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-rework');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-vueify');
    grunt.registerTask('default', ['clean', 'copy', 'browserify', 'rework', 'clean-env']);
};
