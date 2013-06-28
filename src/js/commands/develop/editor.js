Commands.register("editor", {
	requiredArguments: 1,
	format: '<pre>editor [file]</pre>',
	lookForQuotes: false,
	concatArgs: true,
	editor: null,
	run: function(args, callback) {

		var id = "editor",
			self = this,
			markup = '<div class="editor-ace"><div class="toolbar"></div><div id="' + id + '"></div></div>',
			fileToLoad = args.shift();

		exec("echo " + markup);
		this.editor = ace.edit(id);
	    this.editor.setTheme("ace/theme/textmate");
	    this.editor.getSession().setMode("ace/mode/javascript");
	    this.editor.focus();
	    this.editor.getSession().setUseWorker(false);
	    this.editor.commands.addCommand({
		    name: 'Save',
		    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
		    exec: function(editor) {
		        self.save();
		    },
		    readOnly: true
		});
		this.editor.commands.addCommand({
		    name: 'Close',
		    bindKey: {win: 'Ctrl-W',  mac: 'Command-W'},
		    exec: function(editor) {
		        self.close();
		    },
		    readOnly: true
		});

		this.loadFile(fileToLoad);
		callback();

	},
	man: function() {
		return 'Opens an editor for changing files.';
	},
	loadFile: function(file) {
		var self = this;
		this.editor.setReadOnly(true);
		this.editor.setValue("// loading " + file + " ...");
		exec("readfile " + file, function(content) {
			self.editor.setValue(content);
			self.editor.setReadOnly(false);
			self.editor.clearSelection();
		})
	},
	save: function(editor) {

	},
	close: function(editor) {

	}
});

setTimeout(function() {
	exec("editor README.md");
}, 500);

/*

	Ace themes:
	ambiance
	chaos
	chrome
	clouds +
	clouds_midnight
	cobalt
	crimson_editor
	dawn
	dreamweaver
	eclipse
	github +
	idle_fingers
	kr_theme
	merbivore
	merbivore_soft
	mono_industrial
	monokai
	pastel_on_dark
	solarized_dark
	solarized_light
	terminal
	textmate ++ 
	tomorrow
	tomorrow_night
	tomorrow_night_blue
	tomorrow_night_bright
	tomorrow_night_eighties
	twilight
	vibrant_ink
	xcode

*/
