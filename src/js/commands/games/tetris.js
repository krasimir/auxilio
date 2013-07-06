Commands.register("tetris", {
	requiredArguments: 0,
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		App.removeFocus();
		var self = this;
		var defaultLevel = args.length > 0 ? parseInt(args.shift()) : 1;
		if(!App.global.TetrisStarted) {
			App.global.TetrisStarted = true;
		} else {
			exec("warning Only one tetris game could be started at a time. Use the <i>clear</i> command to remove the previous one.");
			callback();
			return;
		}
		if(!App.global.TetrisInitialized) {
			App.global.TetrisInitialized = true;
			this.injectFiles(["css/Tetris.css", "js/vendor/Tetris.js"], function() {
				self.initTetris(callback, defaultLevel);
			});
		} else {
			this.initTetris(callback, defaultLevel);
		}
	},
	injectFiles: function(files, callback) {
		var filesLoaded = 0;
		var parent = document.querySelector("body") || document.querySelector("head");
		var onFileLoaded = function() {
			if(++filesLoaded == files.length) {
				callback();
			}
		}
		for(var i=0; i<files.length; i++) {
			var file = files[i];
			var parts = file.split(".");
			var ext = parts[parts.length-1].toLowerCase();
			switch(ext) {
				case "js":
					var script = document.createElement('script');
					script.setAttribute("type", "text/javascript");
					script.onload = function() {
						onFileLoaded();
					}
					parent.appendChild(script);
					script.setAttribute("src", file);
				break;
				case "css":
					var css = document.createElement('link');
					css.setAttribute("rel", "stylesheet");
					css.setAttribute("type", "text/css");
					css.onload = function() {
						onFileLoaded();
					}
					parent.appendChild(css);
					css.setAttribute("href", file);
				break;
			}
		}
	},
	initTetris: function(callback, defaultLevel) {
		App.setOutputPanelContent('\
			<div class="regular tetris-holder">\
			<div id="tetris">\
			    <div class="left">\
			        <h1><a href="http://gosu.pl/dhtml/JsTetris.html">JsTetris 1.0.0</a></h1>\
			        <div class="menu">\
			            <div><input type="button" value="New Game" id="tetris-menu-start" /></div>\
			            <div><input type="button" value="Reset" id="tetris-menu-reset" style="display: none"/></div>\
			            <div><input type="button" value="Help" id="tetris-menu-help" /></div>\
			            <!--<div><input type="button" value="Highscores" id="tetris-menu-highscores" /></div>-->\
			        </div>\
			        <div class="keyboard">\
			            <div class="up"><input type="button" value="^" id="tetris-keyboard-up" /></div>\
			            <div class="down"><input type="button" value="v" id="tetris-keyboard-down" /></div>\
			            <div class="left"><input type="button" value="&lt;" id="tetris-keyboard-left" /></div>\
			            <div class="right"><input type="button" value="&gt;" id="tetris-keyboard-right" /></div>\
			        </div>\
			        <div id="tetris-nextpuzzle"></div>\
			        <div id="tetris-gameover">Game Over</div>\
			        <div class="stats">\
		                Level:\
						<span id="tetris-stats-level">1</span><br />\
						Score:\
						<span id="tetris-stats-score">0</span><br />\
						Lines:\
						<span id="tetris-stats-lines">0</span><br />\
						APM:\
						<span id="tetris-stats-apm">0</span><br />\
						Time:\
						<span id="tetris-stats-time">0</span>\
			        </div>\
			    </div>\
			    <div id="tetris-area"></div>\
			    <div id="tetris-help" class="window">\
			        <div class="top">\
			            Help <span id="tetris-help-close" class="close">x</span>\
			        </div>\
			        <div class="content">\
			            <b>Controllers:</b> <br />\
			            up - rotate <br />\
			            down - move down <br />\
			            left - move left <br />\
			            right - move right <br />\
			            space - fall to the bottom <br />\
			            n - new game <br />\
			            <!--r - reset <br />-->\
			            <br />\
			            <b>Rules:</b> <br />\
			            1) Puzzle speed = 80+700/level miliseconds, the smaller value the faster puzzle falls <br />\
			            2) If puzzles created in current level >= 10+level*2 then increase level <br />\
			            3) After puzzle falling score is increased by 1000*level*linesRemoved <br />\
			            4) Each "down" action increases score by 5+level (pressing space counts as multiple down actions)\
			        </div>\
			    </div>\
			    <br class="clear" />\
			</div>\
			</div>\
		');
		var tetris = new Tetris(defaultLevel);
	    tetris.unit = 14;
	    tetris.areaX = 12;
	    tetris.areaY = 22;
	    tetris.start();

	    var tetrisHolderDOMElement = document.querySelector(".tetris-holder");
	    tetrisHolderDOMElement.addEventListener("DOMNodeRemoved", function(e) {
	    	if(e.target === tetrisHolderDOMElement) {
	    		App.global.TetrisStarted = false;
	    		tetris.stop();
	    	}
	    });

		callback();
	},
	man: {
		desc: 'Tetris game.',
		format: 'tetris<br />tetris [level to start from]',
		examples: [
			{text: 'Command line', code: 'tetris'}
		],
		returns: 'null',
		group: 'games'
	}	
});