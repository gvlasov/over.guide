module.exports = function (grunt) {
    grunt.initConfig({
        clean: ['dist/'],
        browserify: {
            dist: {
                files: {
                    'dist/js/scripts.js': [
                        'src/js/**/*.js',
                        'src/vue/**/*.vue'
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
            html: {
                src: 'src/index.html',
                dest: 'dist/index.html'
            },
            css: {
                src: 'src/css/*',
                dest: 'dist/css',
                expand: true,
                flatten: true
            },
            images: {
                src: 'src/images/*',
                dest: 'dist/images',
                expand: true,
                flatten: true
            },
            fonts: {
                src: 'src/fonts/*',
                dest: 'dist/fonts',
                expand: true,
                flatten: true
            },
            favicons: {
                src: 'src/favicons/*',
                dest: 'dist/favicons',
                expand: true,
                flatten: true
            }
        },
        watch: {
            scripts: {
                files: ['src/**', 'Gruntfile.js'],
                tasks: ['default'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-rework');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-vueify');
    grunt.registerTask('default', ['clean', 'browserify', 'rework', 'copy']);
};
