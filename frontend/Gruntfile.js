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
                transform: ['vueify']
            }
        },
        rework: {
            'dist/css/style.css': ['css/style.css'],
            options: {
                vendors: ['-moz-', '-webkit-']
            }
        },
        copy: {
            images: {
                src: 'img/**',
                dest: 'dist/',
                expand: true
            }
        },
        watch: {
            scripts: {
                files: ['src/js/*.js', 'src/**/*.vue'],
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
