var config_path = 'config/';

module.exports = function (grunt) {


    //Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        secret: grunt.file.readJSON(config_path + 'secret.json'),
        copy: {
            main: {
                files: [
                    {expand: true, src: ['robots.txt'], dest: 'dist', filter: 'isFile'},
                    {expand: true, src: ['template/**/*'], dest: 'dist', filter: 'isFile'},
                    {expand: true, src: ['js/**/*'], dest: 'dist', filter: 'isFile'},
                    {expand: true, src: ['css/**/*'], dest: 'dist', filter: 'isFile'},
                    {expand: true, src: ['data/**/*'], dest: 'dist', filter: 'isFile'},
//                    {expand: true, src: ['tmp/**/*'], dest: 'dist', filter: 'isFile'},
                    {expand: true, src: ['images/**/*'], dest: 'dist', filter: 'isFile'},
                    {expand: true, src: ['index.html'], dest: 'dist', filter: 'isFile'}
                ]
            }
        },
        clean: {
            dist: {
                src: ['dist/']
            }
        },
        sftp: {
            server: {
                files: {
                    "./": "dist/**"
                },
                options: {
                    host: '<%= secret.host %>',
                    port: '<%= secret.port %>',
                    username: '<%= secret.username %>',
                    path: '/var/www/',
                    srcBasePath: 'dist',
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
        exec: {
            open: {
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
//    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-prompt');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-processhtml');

    //Default task
    grunt.registerTask('default', ['build']);

    //console log task
    grunt.registerTask('console', function () {
        grunt.log.writeln(secret.host);
        grunt.log.writeln(keyLocation);
        var file = grunt.file.read(keyLocation);
        grunt.log.writeln(file);

    });

    grunt.registerTask('build', 'build the dist folder before to transfert it',
        ['clean:dist', 'copy:main']
    );

    //transfer to server
    grunt.registerTask('transfer',
        'ask for the password, send to the server then open the browser to see if it is well displayed',
        ['prompt:pass:questions', 'sftp:server', 'exec:open']);
};
