Commands.register("tetris", {
	requiredArguments: 0,
	format: '<pre>tetris</pre>',
	lookForQuotes: false,
	concatArgs: true,
	run: function(args, callback) {
		
		App.setOutputPanelContent('\
			<div class="regular">\
			<div id="tetris">\
			    <div class="left">\
			        <h1><a href="http://gosu.pl/dhtml/JsTetris.html">JsTetris 1.0.0</a></h1>\
			        <div class="menu">\
			            <div><input type="button" value="New Game" id="tetris-menu-start" /></div>\
			            <div><input type="button" value="Reset" id="tetris-menu-reset" /></div>\
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
			            r - reset <br />\
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
		var tetris = new Tetris();
		    tetris.unit = 14;
		    tetris.areaX = 12;
		    tetris.areaY = 22;
		callback();
	},
	man: function() {
		return 'Tetris game.';
	}	
});