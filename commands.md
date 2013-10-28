## common

### clear

Clearing the current console's output.

  - format: clear
  - returns: null

#### Examples:


<pre>clear</pre>
In script
<pre>clear()</pre>
### compare

Compares values. (Have in mind that it works only with strings and numbers.)

  - format: compare [title] [value1] [expression] [value2]
  - returns: Boolean (true | false)

#### Examples:

Command line
<pre>compare "Check those values" 10 == 20</pre>
Command line (chaining)
<pre>date true &amp;&amp; read monthName &amp;&amp; compare "Is it July?" July ==</pre>
In script
<pre>compare('"My title here"', 10, "==", 10, function(res) {
	console.log(res);
})</pre>
### date

Gets the current date.

  - format: date [true | false]
  - returns: String if you use just <i>date</i> and object if use <i>data true</i><pre>6 July 2013 14:43</pre><pre>Object {
	day: 6
	hour: 14
	minutes: 41
	month: 6
	monthName: "July"
	year: 2013
}		</pre>

#### Examples:

Command line
<pre>date</pre>
Command line (chaining)
<pre>date true &amp;&amp; read monthName &amp;&amp; info</pre>
In script
<pre>date("true", function(date) {
	console.log(date.year);
})</pre>
### delay

Delays the next command

  - format: delay [miliseconds]
  - returns: null

#### Examples:

Command line
<pre>delay 2000</pre>
Command line (chaining)
<pre>echo A &amp;&amp; delay 2000 &amp;&amp; echo B</pre>
In script
<pre>delay(2000, function() {
	console.log("hello");
})</pre>
### diff

Comparison of files (text and json) or strings.

  - format: diff<br />diff [string1] [string2]
  - returns: Object containing the differences.

#### Examples:

Opens a browse window for picking two files
<pre>diff</pre>
Comparing two strings
<pre>diff "Hello world!" "Hello world, dude!"</pre>
Command line (chaining)
<pre>date true &amp;&amp; read monthName &amp;&amp; diff "Current month is July"</pre>
In script
<pre>diff('"Hello world!"', '"Hello world dude!"', function(res) {
	console.log(res);
})</pre>
### exec

Executes a given command. Accepts commands separated by <i>&&</i>.

  - format: exec [command/s]
  - returns: The result of the executed command.

#### Examples:

Command line
<pre>exec echo "test"</pre>
Command line (chaining)
<pre>readfile showing-date.aux &amp;&amp; exec</pre>
In script
<pre>exec("echo Hello world! &amp;&amp; date true", function(res) {
	console.log(res);
})</pre>
### history

Outputs the current console's history.

  - format: history
  - returns: null

#### Examples:

Command line
<pre>history</pre>
### l

Clearing the current console's output.

  - format: l
  - returns: null

#### Examples:

Just type <i>l</i> and press Enter
<pre>l</pre>
### man

Shows manual page about available commands.

  - format: man<br />man [regex | name of a command]<br />man exporttomarkdown
  - returns: Manual page/s

#### Examples:

Command line
<pre>man</pre>
### marker

Gives you ability to place markers on the current page. <i>screenshot</i> command could be used after that.

  - format: marker
  - returns: null

#### Examples:

Command line
<pre>marker</pre>
### middleman

The command simply passes the given argument to its callback

  - format: middleman [resource]
  - returns: The result of the previous command in the chain.

#### Examples:

Command line (chaining)
<pre>date &amp;&amp; middleman &amp;&amp; echo</pre>
### pass

Sometimes is needed to stop passing a result from one command to another. This command simply calls its callback without any arguments.

  - format: pass
  - returns: null

#### Examples:

Command line (chaining)
<pre>date true &amp;&amp; pass &amp;&amp; echo That's a string without date.</pre>
### read

Extracts a value from json object

  - format: read [path] [json object]
  - returns: Value of a property of the sent object

#### Examples:

Command line (chaining)
<pre>date true &amp;&amp; read day &amp;&amp; success Today is </pre>
If you have a complex object like this one {data: { users: [10, 11, 12] }}
<pre>read data.users[1]</pre>
### request

Sends ajax request and returns the result.

  - format: request [url]<br />request [url] [raw (true | false)]
  - returns: Response of the given url or the raw output if <i>raw</i> parameter is passed.

#### Examples:

Command line
<pre>request github.com &amp;&amp; echo</pre>
Getting raw html
<pre>request github.com true &amp;&amp; echo</pre>
In script
<pre>This command is not supported in external scripts.</pre>
### stringify

Just bypasses the given arguments as string

  - format: stringify [text or object]
  - returns: string

#### Examples:

Command line
<pre>date true &amp;&amp; stringify &amp;&amp; info</pre>
### var

Define a variable.

  - format: var [name] [value]
  - returns: The value of the variable

#### Examples:

Command line
<pre>var n 10
echo $$n is a great position</pre>
Command line (chaining)
<pre>date &amp;&amp; var currentDate
echo Current date is $$currentDate</pre>
- - -

## data

### alias

Managing aliases.

  - format: alias [name] [value]
  - returns: Check the examples.

#### Examples:

Showing current added aliases
<pre>alias</pre>
Opening an editor for adding alias
<pre>alias my-alias-name</pre>
Directly pass the content of the alias
<pre>alias my-alias-name date &amp;&amp; echo</pre>
Clearing all aliases
<pre>alias clearallplease</pre>
Exporting all aliases
<pre>alias exportallplease</pre>
Command line (chaining)
<pre>readfile showing-date.aux &amp;&amp; exec</pre>
In script
<pre>alias('"my-alias-name"', "date &amp;&amp; echo", function() {
	console.log("Alias added.");
})</pre>
### profile

Manages your current profile file. Every time when you start auxilio the extension reads the files of the given directory (recursively). It searches for files which start with <i>function </i> and register them as commands. If the file starts with <i>exec.</i> directly executes the function inside the file. Check <i>man run</i> for more information.

  - format: profile [path]
  - returns: Check examples.

#### Examples:

Getting current profile path
<pre>profile</pre>
Setting profile
<pre>profile D:/work/auxilio/profile</pre>
Clearing profile
<pre>profile clear</pre>
### storage

Stores key-value pairs by using chrome.storage.sync API.

  - format: storage [operation] [key] [value]
  - returns: The result of the executed command.

#### Examples:

Storing variable
<pre>storage put username Auxilio</pre>
Getting variable
<pre>storage get username</pre>
Removing variable
<pre>storage remove username</pre>
Get all variable
<pre>storage get</pre>
- - -

## develop

### editor

Opens an editor for editing files. Available shortcuts:<br />		Ctrl+S - save<br />		Esc - closing the editor<br />		Ctrl+[ - showing previous file<br />		Ctrl+] - showing next file<br />		

  - format: editor [file]
  - returns: null

#### Examples:

Open file for editing
<pre>editor ./styles.css</pre>
### jshint

Formats an output of jshint execution. The command is meant to be used together with <i>watch</i>.

  - format: jshint [{filePath: [path], jshint: [jshint]}]
  - returns: null

#### Examples:

Watching a javascript file for changes and passing the result to jshint.
<pre>watch start ./code.js jshint</pre>
### runjasmine

Runs jasmine tests.

  - format: runjasmine [path]
  - returns: null

#### Examples:

Command line
<pre>runjasmine ./tests</pre>
- - -

## forms

### formconfirm

Shows a text (question) with two options - YES and NO.

  - format: formconfirm [question]
  - returns: Boolean (true | false)

#### Examples:

Command line
<pre>formconfirm Are you sure?</pre>
In script
<pre>formconfirm('"Are you sure?"', function(res) {
	console.log(res ? "yes" : "no");
});</pre>
### formfile

Shows a simple form with input[type="file"] and button. Use the callback of the command to get the content of the file.

  - format: formfile [title]
  - returns: Content of the file

#### Examples:

Command line
<pre>formfile Please choose a file.</pre>
In script
<pre>formfile('"Please choose a file."', function(fileContent) {
	console.log(fileContent);
})</pre>
### forminput

Shows a simple form with input and button.

  - format: forminput<br />forminput [title]<br />forminput [title] [default text]
  - returns: string

#### Examples:

Command line
<pre>forminput "Please type your age." 18</pre>
In script
<pre>forminput('"Please type your age."', 18, function(age) {
	console.log(age);
});</pre>
### formtextarea

Shows a simple form with textarea and button. Use the callback of the command to get the text submitted by the form.

  - format: formtextarea<br />formtextarea [title]<br />formtextarea [title] [text]
  - returns: string

#### Examples:

Command line
<pre>formtextarea "Please type your bio." "Sample text" &amp;&amp; echo</pre>
In script
<pre>formtextarea('"Please type your bio."', '"Sample text"', function(bio) {
	console.log(bio);
});</pre>
- - -

## games

### tetris

Tetris game.

  - format: tetris<br />tetris [level to start from]
  - returns: null

#### Examples:

Command line
<pre>tetris</pre>
- - -

## messages

### echo

Outputs message.

  - format: echo [text]
  - returns: string

#### Examples:

Command line
<pre>echo Hello world!</pre>
In script
<pre>echo("Hello world!", function(res) {
	console.log(res);
});</pre>
### echoraw

Outputs message in raw format. Even the html is shown as string.

  - format: echoraw [text]
  - returns: string

#### Examples:

Command line
<pre>echoraw Hello world!</pre>
In script
<pre>echoraw("Hello world!", function(res) {
	console.log(res);
});</pre>
### echoshell

Outputs message.

  - format: echoshell [text]
  - returns: string

#### Examples:

Command line
<pre>echoshell Hello world!</pre>
In script
<pre>echoshell("Hello world!", function(res) {
	console.log(res);
});</pre>
### error

Outputs message.

  - format: error [text]
  - returns: string

#### Examples:

Command line
<pre>error Hello world!</pre>
In script
<pre>error("Hello world!", function(res) {
	console.log(res);
});</pre>
### hidden

Outputs invisible content. I.e. useful when you have to add hidden html markup.

  - format: hidden [text]
  - returns: string

#### Examples:

Command line
<pre>hidden &lt;input type="hidden" name="property" /></pre>
In script
<pre>hidden("&lt;input type="hidden" name="property" />", function(res) {
	console.log(res);
});</pre>
### hr

Adds &lt;hr /> tag to the console's output panel

  - format: hr
  - returns: null

#### Examples:

Command line
<pre>hr</pre>
In script
<pre>hr();</pre>
### info

Outputs message.

  - format: info [text]
  - returns: string

#### Examples:

Command line
<pre>info Hello world!</pre>
In script
<pre>info("Hello world!", function(res) {
	console.log(res);
});</pre>
### small

Outputs message.

  - format: small [text]
  - returns: string

#### Examples:

Command line
<pre>small Hello world!</pre>
In script
<pre>small("Hello world!", function(res) {
	console.log(res);
});</pre>
### success

Outputs message.

  - format: success [text]
  - returns: string

#### Examples:

Command line
<pre>success Hello world!</pre>
In script
<pre>success("Hello world!", function(res) {
	console.log(res);
});</pre>
### title

Outputs message.

  - format: title [text]
  - returns: string

#### Examples:

Command line
<pre>title Hello world!</pre>
In script
<pre>title("Hello world!", function(res) {
	console.log(res);
});</pre>
### warning

Outputs message.

  - format: warning [text]
  - returns: string

#### Examples:

Command line
<pre>warning Hello world!</pre>
In script
<pre>warning("Hello world!", function(res) {
	console.log(res);
});</pre>
- - -

## os

### block

Sometimes you need to execute a series of commands, but you want to keep the context, i.e. the current directory.

  - format: block [operation]
  - returns: null

#### Examples:

Command line
<pre>block start &amp;&amp; cd ../../ &amp;&amp; echo Do some stuff here &amp;&amp; block end</pre>
In script
<pre>block("start", function() {
	shell("cd ../../", function() {
		block("end");
	});
});</pre>
### cwd

Returns the current working directory of auxilio-backend.

  - format: cwd
  - returns: string

#### Examples:

Command line
<pre>cwd</pre>
In script
<pre>cwd(function(res) {
	console.log(res);
});</pre>
### readfile

Read content of a file.

  - format: readfile [file]
  - returns: string

#### Examples:

Command line
<pre>readfile ./README.md</pre>
In script
<pre>readfile("./README.md", function(content) {
	console.log(content);
});</pre>
### run

Register or execute commands stored in external files. The files should contain valid javascript which is actually a function definition in the following format:<pre>function nameOfMyFunction(args) {
...

}</pre>Normally the content of the file is registered as a command, but if the filename starts with <i>exec.</i> the function is executed immediately. For example:<pre>run ./exec.myscript.js</pre>

  - format: run [path]
  - returns: Result of the function.

#### Examples:

Importing directory
<pre>run ./files</pre>
Importing file
<pre>run ./files/myscript.js</pre>
In script
<pre>run("./myfiles", function(res) {
	console.log(res);
});</pre>
### shell

Executes shell command. Have in mind that once you type something in the console and it doesn't match any of the auxilio's commands it is send to the shell

  - format: shell [command]
  - returns: string

#### Examples:

Command line
<pre>shell ls</pre>
In script
<pre>shell("ls", function(res) {
	console.log(res);
});</pre>
### tree

Shows a directory tree.

  - format: tree<br />tree [regex]<br />tree [deep]<br />tree [suppressdisplay]
  - returns: string

#### Examples:

Command line
<pre>tree</pre>
Showing files by type
<pre>tree \.css</pre>
Showing only two levels
<pre>tree 2</pre>
Suppress the output to the console
<pre>tree suppressdisplay</pre>
In script
<pre>tree(2, function(res) {
	console.log(res);
});</pre>
### watch

Watch directory or file for changes.

  - format: watch [operation] [id or path] [callback command]
  - returns: string

#### Examples:

Get the current watchers and their ids
<pre>watch</pre>
Start watching
<pre>watch start ./ echo</pre>
Start watching and call multiple callbacks
<pre>watch start ./ "jshint, echo"</pre>
Stop watcher
<pre>watch stop 1</pre>
Stop all watchers
<pre>watch stopall</pre>
In script
<pre>watch("start", "./", "echo", function(res) {
	console.log(res);
});</pre>
### writefile

Write content to a file.

  - format: writefile [file] [content]
  - returns: string

#### Examples:

Command line
<pre>writefile ./test.txt Sample text here.</pre>
In script
<pre>writefile("./test.txt", "Sample text here", function(res) {
	console.log("File saved successfully.");
});</pre>
- - -

## page

### pageclick

Clicks an element on the page and returns the result immediately. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.

  - format: pageclick [selector] [filter]
  - returns: Object containing the matched elements.

#### Examples:

Command line
<pre>pageclick "body > .my-link-class"</pre>
Filter the selected elements
<pre>pageclick "body > .my-link-class" "link label"</pre>
In script
<pre>pageclick("body > .my-link-class", function(res) {
	console.log("Element clicked.");
});</pre>
### pageclickw

Clicks an element on the page and waits till the page is updated. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.

  - format: pageclickw [selector] [filter]
  - returns: Object containing the matched elements.

#### Examples:

Command line
<pre>pageclickw "body > .my-link-class"</pre>
Filter the selected elements
<pre>pageclickw "body > .my-link-class" "link label"</pre>
In script
<pre>pageclickw("body > .my-link-class", function() {
	console.log("Element clicked.");
});</pre>
### pagecontains

Checks if there is an element matching the provided selector and containing the provided text.

  - format: pagecontains [selector] [text]
  - returns: Boolean (true | false)

#### Examples:

Command line
<pre>pagecontains "body > a" "my link"</pre>
In script
<pre>pagecontains("body > a", "my link", function(res) {
	console.log(res ? "yes" : "no");
});</pre>
### pageexpect

Checks if there is an element matching the provided selector. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element

  - format: pageexpect [selector] [filter]
  - returns: Object containing the matched elements.

#### Examples:

Command line
<pre>pageexpect a.my-link-class label</pre>
In script
<pre>pageexpect("a.my-link-class", "label, function(res) {
	console.log(res);
});</pre>
### pagehighlight

Highlights element/elements on the page. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.

  - format: pagehighlight [selector] [filter]
  - returns: Object containing the matched elements.

#### Examples:

Command line
<pre>pagehighlight a</pre>
In script
<pre>pagehighlight("a", function(res) {
	console.log(res);
});</pre>
### pageinsertcss

Inserts css code in the context of the current page

  - format: pageinsertcss [css code]
  - returns: string

#### Examples:

Command line
<pre>pageinsertcss body { background: #F00 !important; }</pre>
In script
<pre>pageinsertcss("body { background: #F00 !important; }", function() {
	console.log("CSS applied.");
});</pre>
### pageinsertjs

Executes javascript code in the context of the current page

  - format: pageinsertjs [js code]
  - returns: string

#### Examples:

Command line
<pre>pageinsertjs "document.querySelector('body').click();"</pre>
In script
<pre>pageinsertjs("document.querySelector('body').click();", function(res) {
	console.log(res);
});</pre>
### pageinsertjsw

Executes javascript code in the context of the current page and waits till the current page is updated

  - format: pageinsertjsw [js code]
  - returns: string

#### Examples:

Command line
<pre>pageinsertjsw "document.querySelector('body').click();"</pre>
In script
<pre>pageinsertjsw("document.querySelector('body').click();", function(res) {
	console.log(res);
});</pre>
### pagequery

Returns the number of matched elements and the elements in raw html string format. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.

  - format: pagequery [selector] [filter]
  - returns: Object containing the matched elements.

#### Examples:

Command line
<pre>pagequery a "label of the link"</pre>
In script (checks if there is links on the page)
<pre>pagequery("a", function(res) {
	console.log(res);
});</pre>
- - -

## tabs

### load

Loads another page in the current tab.

  - format: load [url]
  - returns: null

#### Examples:

Command line
<pre>load github.com</pre>
In script
<pre>load("github.com", function() {
	console.log("new page loaded");
});</pre>
### newtab

Creates a new tab.

  - format: newtab<br />newtab [url] [active (true | false)]
  - returns: null

#### Examples:

Command line
<pre>newtab github.com</pre>
In script
<pre>newtab("github.com", "false", function() {
	console.log("new tab loaded");
});</pre>
### refresh

Refreshes the current tab's page

  - format: refresh
  - returns: null

#### Examples:

Command line
<pre>refresh</pre>
In script
<pre>refresh(function() {
	console.log("The current page is refreshed.");
});</pre>
### screenshot

Makes a screenshot of the current tab and loads it in a new tab.

  - format: screenshot
  - returns: null

#### Examples:

Command line
<pre>screenshot</pre>
In script
<pre>screenshot(function() {
	console.log("The screenshot is made.");
});</pre>
