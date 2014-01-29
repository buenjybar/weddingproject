var config_path = 'config/';

module.exports = function (grunt) {

//    var secret = grunt.file.readJSON(config_path + 'secret.json');
    var keyPEM = grunt.file.readJSON(config_path + '.json').path;

    //Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        secret: grunt.file.readJSON(config_path + 'secret.json'),
        keyPEM : grunt.file.readJSON(config_path + 'ppk.json').path,
        sftp: {
            server: {
                files: {
                    "./": "index.html"
                },
                options: {
                    host: '<%= secret.host %>',
                    port: '<%= secret.port %>',
                    username: '<%= secret.username %>',
                    path: '/var/www/',
                    srcBasePath : './',
                    privateKey: grunt.file.read(keyPEM),
                    showProgress:true
                }
            }
        }
    });
    //load modules
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-ssh');

    //Default task
    grunt.registerTask('default', ['build']);

    //console log task
    grunt.registerTask('console', function () {
        grunt.log.writeln(secret.host);
        grunt.log.writeln(keyLocation);
        var file = grunt.file.read(keyLocation);
        grunt.log.writeln(file);

    });

    //transfer to server
    grunt.registerTask('transfer', ['sftp:server']);
};
