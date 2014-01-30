var config_path = 'config/';

module.exports = function (grunt) {


    //Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        secret: grunt.file.readJSON(config_path + 'secret.json'),
        sftp: {
            server: {
                files: {
                    "images/": "images/**/*",
                    "tmp/": "tmp/**",
                    "js/": "js/**",
                    "css/": "css/**",
                    "./": "index.html"
                },
                options: {
                    host: '<%= secret.host %>',
                    port: '<%= secret.port %>',
                    username: '<%= secret.username %>',
                    path: '/var/www/',
                    srcBasePath: './',
                    createDirectories: true,
                    password: '',
                    showProgress: true
                }
            }
        },
        prompt: {
            pass: {
                options: {
                    questions: [
                        {
                            name: 'git',
                            message: 'sftp pass for <%= secret.username %> user?',
                            config: 'sftp.server.options.password',
                            type: 'password',
                            default: ''
                        }
                    ]
                }
            }
        },
        exec:{
            open:{
                cmd: "START http://<%= secret.host %>/"
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
    grunt.loadNpmTasks('grunt-prompt');
    grunt.loadNpmTasks('grunt-exec');
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
    grunt.registerTask('transfer',
        'ask for the password, send to the server then open the browser to see if it is well displayed',
        ['prompt:pass:questions', 'sftp:server', 'exec:open']);
};
