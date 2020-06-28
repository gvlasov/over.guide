const providers = require('./dist/database/database.providers.js')
module.exports = function (grunt) {
    grunt.initConfig({
        fixtures: {
            dev: {
                src: ['src/database/fixtures/dev.json'],
                models: {
                    call: function () {
                        return providers.databaseProviders[0].useFactory().then(
                            (sequelize) =>
                                sequelize.models
                        )
                    },
                },
                options: {}
            }
        }

    });

    grunt.loadNpmTasks('sequelize-fixtures');
};
