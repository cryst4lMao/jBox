module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //Js min task
        uglify: {
            jm: {
                files: {
                    'dist/jquery.jbox-min.js': ['js/jquery.jbox.js']
                }
            }
        },
        //Css min task
        cssmin: {
            cm: {
                files: {
                    'dist/jquery.jbox-min.css': ['css/reset.css','css/jbox.css'],
                    'dist/jbox-min.css': ['css/jbox.css']
                }
            }
        },
        copy:{
            test:{
                files:[
                    {
                        expand: true,
                        cwd:'css/Images/',
                        src: ['**/*.*'], 
                        dest: 'dist/Images', 
                        filter: 'isFile'}
                ]
            }
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // resgister tasks
    grunt.registerTask('default', ['uglify', 'cssmin','copy']);

};
