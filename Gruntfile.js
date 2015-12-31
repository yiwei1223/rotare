/**
 * Created by yiwei on 15/12/29.
 */
'use strict';
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: [
                    'build/**/*.js'
                ]
            }
        },
        // js混淆压缩
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */',
                mangle: false //prevent changes to your variable and function names,

            },
            release_yw: {
                files: [
                    {
                        'build/<%=pkg.name%>.min.<%=pkg.version%>.js': ['src/<%=pkg.name%>.js']
                    }
                ]
            }
        }
    });
    grunt.registerTask('build', ['clean:build', 'uglify']);
};