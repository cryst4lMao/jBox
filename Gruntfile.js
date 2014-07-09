module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //Js min task
        uglify: {
            'dist/jquery.jbox-min.js': ['js/jquery.jbox.js']
        },
        //Css min task
        cssmin: {
            // 'dist/jquery.jbox-min.css': ['css/reset.css', 'css/jbox.css'],
            'dist/jbox-min.css': ['css/jbox-hyd.css']
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'css/Images/',
                    src: ['**'],
                    dest: 'dist/Images',
                    filter: 'isFile'
                }]
            }
        },
         //watch
        watch: {
            css: {
                files: ['**/*.css', '!**/*-min.css'],
                // tasks:['cssmin']
            },
            js:{
                files:['**/*.js','!**/*-min.js'],
                // tasks:['uglify']
            },
            html: {
                files: ['*.html']
            },
            options: {
                livereload: 8080
            },
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // resgister tasks
    grunt.registerTask('wh', ['watch']);
    grunt.registerTask('default', ['uglify', 'cssmin', 'copy']);

};
