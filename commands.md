# Auxilio commands

- - -

## common

### clear

Clearing the current console's output.

  - format: clear
  - returns: null

#### Examples:


&lt;pre>clear&lt;/pre>
In script
&lt;pre>clear()&lt;/pre>
### compare

Compares values. (Have in mind that it works only with strings and numbers.)

  - format: compare [title] [value1] [expression] [value2]
  - returns: Boolean (true | false)

#### Examples:

Command line
&lt;pre>compare "Check those values" 10 == 20&lt;/pre>
Command line (chaining)
&lt;pre>date true &amp;&amp; read monthName &amp;&amp; compare "Is it July?" July ==&lt;/pre>
In script
&lt;pre>compare('"My title here"', 10, "==", 10, function(res) {
	console.log(res);
})&lt;/pre>
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
&lt;pre>date&lt;/pre>
Command line (chaining)
&lt;pre>date true &amp;&amp; read monthName &amp;&amp; info&lt;/pre>
In script
&lt;pre>date("true", function(date) {
	console.log(date.year);
})&lt;/pre>
### delay

Delays the next command

  - format: delay [miliseconds]
  - returns: null

#### Examples:

Command line
&lt;pre>delay 2000&lt;/pre>
Command line (chaining)
&lt;pre>echo A &amp;&amp; delay 2000 &amp;&amp; echo B&lt;/pre>
In script
&lt;pre>delay(2000, function() {
	console.log("hello");
})&lt;/pre>
### diff

Comparison of files (text and json) or strings.

  - format: diff<br />diff [string1] [string2]
  - returns: Object containing the differences.

#### Examples:

Opens a browse window for picking two files
&lt;pre>diff&lt;/pre>
Comparing two strings
&lt;pre>diff "Hello world!" "Hello world, dude!"&lt;/pre>
Command line (chaining)
&lt;pre>date true &amp;&amp; read monthName &amp;&amp; diff "Current month is July"&lt;/pre>
In script
&lt;pre>diff('"Hello world!"', '"Hello world dude!"', function(res) {
	console.log(res);
})&lt;/pre>
### exec

Executes a given command. Accepts commands separated by <i>&&</i>.

  - format: exec [command/s]
  - returns: The result of the executed command.

#### Examples:

Command line
&lt;pre>exec echo "test"&lt;/pre>
Command line (chaining)
&lt;pre>readfile showing-date.aux &amp;&amp; exec&lt;/pre>
In script
&lt;pre>exec("echo Hello world! &amp;&amp; date true", function(res) {
	console.log(res);
})&lt;/pre>
### history

Outputs the current console's history.

  - format: history
  - returns: null

#### Examples:

Command line
&lt;pre>history&lt;/pre>
### l

Clearing the current console's output.

  - format: l
  - returns: null

#### Examples:

Just type <i>l</i> and press Enter
&lt;pre>l&lt;/pre>
### man

Shows manual page about available commands.

  - format: man<br />man [regex | name of a command]<br />man exporttomarkdown
  - returns: Manual page/s

#### Examples:

Command line
&lt;pre>man&lt;/pre>
### marker

Gives you ability to place markers on the current page. <i>screenshot</i> command could be used after that.

  - format: marker
  - returns: null

#### Examples:

Command line
&lt;pre>marker&lt;/pre>
### middleman

The command simply passes the given argument to its callback

  - format: middleman [resource]
  - returns: The result of the previous command in the chain.

#### Examples:

Command line (chaining)
&lt;pre>date &amp;&amp; middleman &amp;&amp; echo&lt;/pre>
### pass

Sometimes is needed to stop passing a result from one command to another. This command simply calls its callback without any arguments.

  - format: pass
  - returns: null

#### Examples:

Command line (chaining)
&lt;pre>date true &amp;&amp; pass &amp;&amp; echo That's a string without date.&lt;/pre>
### read

Extracts a value from json object

  - format: read [path] [json object]
  - returns: Value of a property of the sent object

#### Examples:

Command line (chaining)
&lt;pre>date true &amp;&amp; read day &amp;&amp; success Today is &lt;/pre>
If you have a complex object like this one {data: { users: [10, 11, 12] }}
&lt;pre>read data.users[1]&lt;/pre>
### request

Sends ajax request and returns the result.

  - format: request [url]<br />request [url] [raw (true | false)]
  - returns: Response of the given url or the raw output if <i>raw</i> parameter is passed.

#### Examples:

Command line
&lt;pre>request github.com &amp;&amp; echo&lt;/pre>
Getting raw html
&lt;pre>request github.com true &amp;&amp; echo&lt;/pre>
In script
&lt;pre>This command is not supported in external scripts.&lt;/pre>
### stringify

Just bypasses the given arguments as string

  - format: stringify [text or object]
  - returns: string

#### Examples:

Command line
&lt;pre>date true &amp;&amp; stringify &amp;&amp; info&lt;/pre>
### var

Define a variable.

  - format: var [name] [value]
  - returns: The value of the variable

#### Examples:

Command line
&lt;pre>var n 10
echo $$n is a great position&lt;/pre>
Command line (chaining)
&lt;pre>date &amp;&amp; var currentDate
echo Current date is $$currentDate&lt;/pre>
- - -

## data

### alias

Managing aliases.

  - format: alias [name] [value]
  - returns: Check the examples.

#### Examples:

Showing current added aliases
&lt;pre>alias&lt;/pre>
Opening an editor for adding alias
&lt;pre>alias my-alias-name&lt;/pre>
Directly pass the content of the alias
&lt;pre>alias my-alias-name date &amp;&amp; echo&lt;/pre>
Clearing all aliases
&lt;pre>alias clearallplease&lt;/pre>
Exporting all aliases
&lt;pre>alias exportallplease&lt;/pre>
Command line (chaining)
&lt;pre>readfile showing-date.aux &amp;&amp; exec&lt;/pre>
In script
&lt;pre>alias('"my-alias-name"', "date &amp;&amp; echo", function() {
	console.log("Alias added.");
})&lt;/pre>
### profile

Manages your current profile file. Every time when you start auxilio the extension reads the files of the given directory (recursively). It searches for files which start with <i>function </i> and register them as commands. If the file starts with <i>exec.</i> directly executes the function inside the file. Check <i>man run</i> for more information.

  - format: profile [path]
  - returns: Check examples.

#### Examples:

Getting current profile path
&lt;pre>profile&lt;/pre>
Setting profile
&lt;pre>profile D:/work/auxilio/profile&lt;/pre>
Clearing profile
&lt;pre>profile clear&lt;/pre>
### storage

Stores key-value pairs by using chrome.storage.sync API.

  - format: storage [operation] [key] [value]
  - returns: The result of the executed command.

#### Examples:

Storing variable
&lt;pre>storage put username Auxilio&lt;/pre>
Getting variable
&lt;pre>storage get username&lt;/pre>
Removing variable
&lt;pre>storage remove username&lt;/pre>
Get all variable
&lt;pre>storage get&lt;/pre>
- - -

## develop

### editor

Opens an editor for editing files. Available shortcuts:<br />		Ctrl+S - save<br />		Esc - closing the editor<br />		Ctrl+[ - showing previous file<br />		Ctrl+] - showing next file<br />		

  - format: editor [file]
  - returns: null

#### Examples:

Open file for editing
&lt;pre>editor ./styles.css&lt;/pre>
### jshint

Formats an output of jshint execution. The command is meant to be used together with <i>watch</i>.

  - format: jshint [{filePath: [path], jshint: [jshint]}]
  - returns: null

#### Examples:

Watching a javascript file for changes and passing the result to jshint.
&lt;pre>watch start ./code.js jshint&lt;/pre>
### runjasmine

Runs jasmine tests.

  - format: runjasmine [path]
  - returns: null

#### Examples:

Command line
&lt;pre>runjasmine ./tests&lt;/pre>
- - -

## forms

### formconfirm

Shows a text (question) with two options - YES and NO.

  - format: formconfirm [question]
  - returns: Boolean (true | false)

#### Examples:

Command line
&lt;pre>formconfirm Are you sure?&lt;/pre>
In script
&lt;pre>formconfirm('"Are you sure?"', function(res) {
	console.log(res ? "yes" : "no");
});&lt;/pre>
### formfile

Shows a simple form with input[type="file"] and button. Use the callback of the command to get the content of the file.

  - format: formfile [title]
  - returns: Content of the file

#### Examples:

Command line
&lt;pre>formfile Please choose a file.&lt;/pre>
In script
&lt;pre>formfile('"Please choose a file."', function(fileContent) {
	console.log(fileContent);
})&lt;/pre>
### forminput

Shows a simple form with input and button.

  - format: forminput<br />forminput [title]<br />forminput [title] [default text]
  - returns: string

#### Examples:

Command line
&lt;pre>forminput "Please type your age." 18&lt;/pre>
In script
&lt;pre>forminput('"Please type your age."', 18, function(age) {
	console.log(age);
});&lt;/pre>
### formtextarea

Shows a simple form with textarea and button. Use the callback of the command to get the text submitted by the form.

  - format: formtextarea<br />formtextarea [title]<br />formtextarea [title] [text]
  - returns: string

#### Examples:

Command line
&lt;pre>formtextarea "Please type your bio." "Sample text" &amp;&amp; echo&lt;/pre>
In script
&lt;pre>formtextarea('"Please type your bio."', '"Sample text"', function(bio) {
	console.log(bio);
});&lt;/pre>
- - -

## games

### tetris

Tetris game.

  - format: tetris<br />tetris [level to start from]
  - returns: null

#### Examples:

Command line
&lt;pre>tetris&lt;/pre>
- - -

## messages

### echo

Outputs message.

  - format: echo [text]
  - returns: string

#### Examples:

Command line
&lt;pre>echo Hello world!&lt;/pre>
In script
&lt;pre>echo("Hello world!", function(res) {
	console.log(res);
});&lt;/pre>
### echoraw

Outputs message in raw format. Even the html is shown as string.

  - format: echoraw [text]
  - returns: string

#### Examples:

Command line
&lt;pre>echoraw Hello world!&lt;/pre>
In script
&lt;pre>echoraw("Hello world!", function(res) {
	console.log(res);
});&lt;/pre>
### echoshell

Outputs message.

  - format: echoshell [text]
  - returns: string

#### Examples:

Command line
&lt;pre>echoshell Hello world!&lt;/pre>
In script
&lt;pre>echoshell("Hello world!", function(res) {
	console.log(res);
});&lt;/pre>
### error

Outputs message.

  - format: error [text]
  - returns: string

#### Examples:

Command line
&lt;pre>error Hello world!&lt;/pre>
In script
&lt;pre>error("Hello world!", function(res) {
	console.log(res);
});&lt;/pre>
### hidden

Outputs invisible content. I.e. useful when you have to add hidden html markup.

  - format: hidden [text]
  - returns: string

#### Examples:

Command line
&lt;pre>hidden &lt;input type="hidden" name="property" />&lt;/pre>
In script
&lt;pre>hidden("&lt;input type="hidden" name="property" />", function(res) {
	console.log(res);
});&lt;/pre>
### hr

Adds &lt;hr /> tag to the console's output panel

  - format: hr
  - returns: null

#### Examples:

Command line
&lt;pre>hr&lt;/pre>
In script
&lt;pre>hr();&lt;/pre>
### info

Outputs message.

  - format: info [text]
  - returns: string

#### Examples:

Command line
&lt;pre>info Hello world!&lt;/pre>
In script
&lt;pre>info("Hello world!", function(res) {
	console.log(res);
});&lt;/pre>
### small

Outputs message.

  - format: small [text]
  - returns: string

#### Examples:

Command line
&lt;pre>small Hello world!&lt;/pre>
In script
&lt;pre>small("Hello world!", function(res) {
	console.log(res);
});&lt;/pre>
### success

Outputs message.

  - format: success [text]
  - returns: string

#### Examples:

Command line
&lt;pre>success Hello world!&lt;/pre>
In script
&lt;pre>success("Hello world!", function(res) {
	console.log(res);
});&lt;/pre>
### title

Outputs message.

  - format: title [text]
  - returns: string

#### Examples:

Command line
&lt;pre>title Hello world!&lt;/pre>
In script
&lt;pre>title("Hello world!", function(res) {
	console.log(res);
});&lt;/pre>
### warning

Outputs message.

  - format: warning [text]
  - returns: string

#### Examples:

Command line
&lt;pre>warning Hello world!&lt;/pre>
In script
&lt;pre>warning("Hello world!", function(res) {
	console.log(res);
});&lt;/pre>
- - -

## os

### block

Sometimes you need to execute a series of commands, but you want to keep the context, i.e. the current directory.

  - format: block [operation]
  - returns: null

#### Examples:

Command line
&lt;pre>block start &amp;&amp; cd ../../ &amp;&amp; echo Do some stuff here &amp;&amp; block end&lt;/pre>
In script
&lt;pre>block("start", function() {
	shell("cd ../../", function() {
		block("end");
	});
});&lt;/pre>
### cwd

Returns the current working directory of auxilio-backend.

  - format: cwd
  - returns: string

#### Examples:

Command line
&lt;pre>cwd&lt;/pre>
In script
&lt;pre>cwd(function(res) {
	console.log(res);
});&lt;/pre>
### readfile

Read content of a file.

  - format: readfile [file]
  - returns: string

#### Examples:

Command line
&lt;pre>readfile ./README.md&lt;/pre>
In script
&lt;pre>readfile("./README.md", function(content) {
	console.log(content);
});&lt;/pre>
### run

Register or execute commands stored in external files. The files should contain valid javascript which is actually a function definition in the following format:<pre>function nameOfMyFunction(args) {
...

}</pre>Normally the content of the file is registered as a command, but if the filename starts with <i>exec.</i> the function is executed immediately. For example:<pre>run ./exec.myscript.js</pre>

  - format: run [path]
  - returns: Result of the function.

#### Examples:

Importing directory
&lt;pre>run ./files&lt;/pre>
Importing file
&lt;pre>run ./files/myscript.js&lt;/pre>
In script
&lt;pre>run("./myfiles", function(res) {
	console.log(res);
});&lt;/pre>
### shell

Executes shell command. Have in mind that once you type something in the console and it doesn't match any of the auxilio's commands it is send to the shell

  - format: shell [command]
  - returns: string

#### Examples:

Command line
&lt;pre>shell ls&lt;/pre>
In script
&lt;pre>shell("ls", function(res) {
	console.log(res);
});&lt;/pre>
### tree

Shows a directory tree.

  - format: tree<br />tree [regex]<br />tree [deep]<br />tree [suppressdisplay]
  - returns: string

#### Examples:

Command line
&lt;pre>tree&lt;/pre>
Showing files by type
&lt;pre>tree \.css&lt;/pre>
Showing only two levels
&lt;pre>tree 2&lt;/pre>
Suppress the output to the console
&lt;pre>tree suppressdisplay&lt;/pre>
In script
&lt;pre>tree(2, function(res) {
	console.log(res);
});&lt;/pre>
### watch

Watch directory or file for changes.

  - format: watch [operation] [id or path] [callback command]
  - returns: string

#### Examples:

Get the current watchers and their ids
&lt;pre>watch&lt;/pre>
Start watching
&lt;pre>watch start ./ echo&lt;/pre>
Start watching and call multiple callbacks
&lt;pre>watch start ./ "jshint, echo"&lt;/pre>
Stop watcher
&lt;pre>watch stop 1&lt;/pre>
Stop all watchers
&lt;pre>watch stopall&lt;/pre>
In script
&lt;pre>watch("start", "./", "echo", function(res) {
	console.log(res);
});&lt;/pre>
### writefile

Write content to a file.

  - format: writefile [file] [content]
  - returns: string

#### Examples:

Command line
&lt;pre>writefile ./test.txt Sample text here.&lt;/pre>
In script
&lt;pre>writefile("./test.txt", "Sample text here", function(res) {
	console.log("File saved successfully.");
});&lt;/pre>
- - -

## page

### pageclick

Clicks an element on the page and returns the result immediately. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.

  - format: pageclick [selector] [filter]
  - returns: Object containing the matched elements.

#### Examples:

Command line
&lt;pre>pageclick "body > .my-link-class"&lt;/pre>
Filter the selected elements
&lt;pre>pageclick "body > .my-link-class" "link label"&lt;/pre>
In script
&lt;pre>pageclick("body > .my-link-class", function(res) {
	console.log("Element clicked.");
});&lt;/pre>
### pageclickw

Clicks an element on the page and waits till the page is updated. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.

  - format: pageclickw [selector] [filter]
  - returns: Object containing the matched elements.

#### Examples:

Command line
&lt;pre>pageclickw "body > .my-link-class"&lt;/pre>
Filter the selected elements
&lt;pre>pageclickw "body > .my-link-class" "link label"&lt;/pre>
In script
&lt;pre>pageclickw("body > .my-link-class", function() {
	console.log("Element clicked.");
});&lt;/pre>
### pagecontains

Checks if there is an element matching the provided selector and containing the provided text.

  - format: pagecontains [selector] [text]
  - returns: Boolean (true | false)

#### Examples:

Command line
&lt;pre>pagecontains "body > a" "my link"&lt;/pre>
In script
&lt;pre>pagecontains("body > a", "my link", function(res) {
	console.log(res ? "yes" : "no");
});&lt;/pre>
### pageexpect

Checks if there is an element matching the provided selector. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element

  - format: pageexpect [selector] [filter]
  - returns: Object containing the matched elements.

#### Examples:

Command line
&lt;pre>pageexpect a.my-link-class label&lt;/pre>
In script
&lt;pre>pageexpect("a.my-link-class", "label, function(res) {
	console.log(res);
});&lt;/pre>
### pagehighlight

Highlights element/elements on the page. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.

  - format: pagehighlight [selector] [filter]
  - returns: Object containing the matched elements.

#### Examples:

Command line
&lt;pre>pagehighlight a&lt;/pre>
In script
&lt;pre>pagehighlight("a", function(res) {
	console.log(res);
});&lt;/pre>
### pageinsertcss

Inserts css code in the context of the current page

  - format: pageinsertcss [css code]
  - returns: string

#### Examples:

Command line
&lt;pre>pageinsertcss body { background: #F00 !important; }&lt;/pre>
In script
&lt;pre>pageinsertcss("body { background: #F00 !important; }", function() {
	console.log("CSS applied.");
});&lt;/pre>
### pageinsertjs

Executes javascript code in the context of the current page

  - format: pageinsertjs [js code]
  - returns: string

#### Examples:

Command line
&lt;pre>pageinsertjs "document.querySelector('body').click();"&lt;/pre>
In script
&lt;pre>pageinsertjs("document.querySelector('body').click();", function(res) {
	console.log(res);
});&lt;/pre>
### pageinsertjsw

Executes javascript code in the context of the current page and waits till the current page is updated

  - format: pageinsertjsw [js code]
  - returns: string

#### Examples:

Command line
&lt;pre>pageinsertjsw "document.querySelector('body').click();"&lt;/pre>
In script
&lt;pre>pageinsertjsw("document.querySelector('body').click();", function(res) {
	console.log(res);
});&lt;/pre>
### pagequery

Returns the number of matched elements and the elements in raw html string format. Use <i>filter</i> parameter to filter the selected elements. Actually performs <i>indexOf</i> method agains the html markup of the selected element.

  - format: pagequery [selector] [filter]
  - returns: Object containing the matched elements.

#### Examples:

Command line
&lt;pre>pagequery a "label of the link"&lt;/pre>
In script (checks if there is links on the page)
&lt;pre>pagequery("a", function(res) {
	console.log(res);
});&lt;/pre>
- - -

## tabs

### load

Loads another page in the current tab.

  - format: load [url]
  - returns: null

#### Examples:

Command line
&lt;pre>load github.com&lt;/pre>
In script
&lt;pre>load("github.com", function() {
	console.log("new page loaded");
});&lt;/pre>
### newtab

Creates a new tab.

  - format: newtab<br />newtab [url] [active (true | false)]
  - returns: null

#### Examples:

Command line
&lt;pre>newtab github.com&lt;/pre>
In script
&lt;pre>newtab("github.com", "false", function() {
	console.log("new tab loaded");
});&lt;/pre>
### refresh

Refreshes the current tab's page

  - format: refresh
  - returns: null

#### Examples:

Command line
&lt;pre>refresh&lt;/pre>
In script
&lt;pre>refresh(function() {
	console.log("The current page is refreshed.");
});&lt;/pre>
### screenshot

Makes a screenshot of the current tab and loads it in a new tab.

  - format: screenshot
  - returns: null

#### Examples:

Command line
&lt;pre>screenshot&lt;/pre>
In script
&lt;pre>screenshot(function() {
	console.log("The screenshot is made.");
});&lt;/pre>
