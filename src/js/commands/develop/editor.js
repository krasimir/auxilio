var Editor = (function() {

	var _files = [],
		_id = "editor",
		_added = false,
		_editorHolder = null,
		_editor = null,
		_currentFile = null,
		_editorToolbar = null;

	var _markup = '\
		<div class="editor-ace">\
			<div id="' + _id + '" class="editor"></div>\
			<div class="editor-toolbar"></div>\
			<div class="editor-hint">\
			Ctrl+S = save, \
			Esc = close, \
			Ctrl+[ = previous project, \
			Ctrl+] = next project</div>\
		</div>\
	';

	var addEditor = function() {
		if(!_added) {
			_editorHolder = document.querySelector(".editor-holder");
			_editorHolder.innerHTML = _markup;
			_editor = ace.edit(_id);
		    _editor.setTheme("ace/theme/textmate");
		    _editor.getSession().setMode("ace/mode/javascript");
		    _editor.getSession().setUseWrapMode(true);
		    _editor.getSession().setUseWorker(false);
		    _editor.focus();
		    _editor.commands.addCommand({
			    name: 'Save',
			    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
			    exec: function(editor) {
			        save();
			    },
			    readOnly: true
			});
			_editor.commands.addCommand({
			    name: 'Close',
			    bindKey: {win: 'Esc',  mac: 'Esc'},
			    exec: function(editor) {
			        close();
			    },
			    readOnly: true
			});
			_editor.commands.addCommand({
			    name: 'PreviousFile',
			    bindKey: {win: 'Ctrl+[',  mac: 'Ctrl+['},
			    exec: function(editor) {
			        if(_currentFile == 0) {
			        	changeCurrentFile(_files.length-1);
			        } else {
			        	changeCurrentFile(_currentFile-1);
			        }
			    },
			    readOnly: true
			});
			_editor.commands.addCommand({
			    name: 'NextFile',
			    bindKey: {win: 'Ctrl+]',  mac: 'Ctrl+]'},
			    exec: function(editor) {
			        if(_currentFile == _files.length-1) {
			        	changeCurrentFile(0);
			        } else {
			        	changeCurrentFile(_currentFile+1);
			        }
			    },
			    readOnly: true
			});
			_editorToolbar = document.querySelector(".editor-toolbar");
		}
	}
	var addFile = function(file) {
		exec("readfile " + file, function(content) {
			if(typeof content === 'object') {
				content = content.content;
			}
			if(content !== null) {
				_files.push({
					file: Context.get() + "/" + file,
					content: content
				});
				_currentFile = _files.length-1;
				showCurrentFile();
			}
		});
	}
	var showCurrentFile = function() {
		addEditor();
		_editor.setValue(_files[_currentFile].content);
		_editor.setReadOnly(false);
		_editor.clearSelection();
		updateToolbar();
		if(_files[_currentFile].position) {
			_editor.selection.moveCursorToPosition(_files[_currentFile].position);
		} else {
			_editor.selection.moveCursorToPosition({row: 0, column: 0});
		}
	}
	var save = function() {
		_files[_currentFile].content = _editor.getValue();
		exec("writefile " + _files[_currentFile].file + " " + _files[_currentFile].content);
	}
	var close = function() {
		_editorHolder.innerHTML = '';
		_added = false;
		_files = [];
		setTimeout(function() {
			App.setFocus();
		}, 200);
	}
	var updateToolbar = function() {
		var str = '';
		for(var i=0; file = _files[i]; i++) {
			str += '<a href="javascript:void(0);" data-index="' + i + '"\
			class="editor-file' + (i == _currentFile ? ' current-file' : '') + '">' + file.file.replace(/\\/g,'/').replace( /.*\//, '' ) + '</a>';
		}
		_editorToolbar.innerHTML = str;
		var links = document.querySelectorAll(".editor-file");
		for(var i=0; link = links[i]; i++) {
			link.addEventListener("click", function(e) {
				changeCurrentFile(parseInt(e.target.getAttribute("data-index")));
			});
		}
	}
	var changeCurrentFile = function(index) {
		if(_files[_currentFile]) {
			_files[_currentFile].position = _editor.selection.getCursor();
		}
		_currentFile = index;
		showCurrentFile();
	}

	return {
		addFile: addFile
	}

})();

Commands.register("editor", {
	requiredArguments: 1,
	lookForQuotes: false,
	concatArgs: true,
	editor: null,
	editorHolder: null,
	run: function(args, callback) {
		Editor.addFile(args.shift());
		callback();
	},
	man: {
		desc: 'Opens an editor for editing files. Available shortcuts:<br />\
		Ctrl+S - save<br />\
		Esc - closing the editor<br />\
		Ctrl+[ - showing previous file<br />\
		Ctrl+] - showing next file<br />\
		',
		format: 'editor [file]',
		examples: [
			{text: 'Open file for editing', code: 'editor ./styles.css'}
		],
		returns: 'null',
		group: 'develop'
	}	
});

// setTimeout(function() {
// 	exec("editor README.md", function() {
// 		exec("editor index.js");
// 	});
// }, 500);

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
