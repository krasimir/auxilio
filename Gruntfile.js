module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			commands: {
				src: ['src/js/commands/**/*.js'],
				dest: 'src/js/commands.js'
			},
			readme: {
				src: ['tpl/README.md', 'commands.md'],
				dest: 'README.md'	
			}
		},
		less: {
			auxilio: {
				options: {
					paths: ['src/css/less'],
					yuicompress: true
				},
				src: ['src/css/less/index.less'],				
				dest: 'src/css/auxilio.css'
			}
		},
		watch: {
			commands: {
				files: ['<%= concat.commands.src[0] %>'],
				tasks: ['concat']
			},
			css: {
				files: ['src/css/less/**/*.less'],
				tasks: ['less']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('assemble-less');

	// grunt.registerTask('default', ['concat', 'less']);
	grunt.registerTask('default', ['concat', 'less', 'watch']);

}