
## Prerequisites
Development on this project requires [Node](http://howtonode.org/how-to-install-nodejs) and then [Grunt](https://gruntjs.com) (via npm)

### **Why do I gotta do this crap? Isn't this just making everything more complicated? Why are you doing this to me?**
The actual running website does not require this crap.  Grunt is an automatic task manager that does a lot of grunt work for the development of this app including:

* checking for syntax errors *(jshint)* whenever a file is saved *(grunt-watch)*
* making sure dependencies are loaded and bundled *(browserify)*
* precompiling templates *(browserify-handlebars)*
* unit testing *(mocha)*
* tests site with headerless browser *(phantomjs)*
* refreshing the browser automatically
* minifying code *(uglify)*
* *automatically pushing stable builds to a repository (not implemented yet)*

In this case, Node.js simply provides a server and the package manager (*npm*) that grunt runs on.  The *package.json* file tells node which modules to download.  The *GruntFile.js* tells grunt which tasks to run and when.   Grunt is complicated so our workflow doesn't have to be.

---

#First Use:

#### make sure to create a config.js
**a.** make a copy of **public/config.js.sample**  and call it **public/config.js**

**b.** after you have the prerequities of [Node](http://howtonode.org/how-to-install-nodejs) and [Grunt](https://gruntjs.com),
the first step is to *cd* into the directory in *Terminal* and type:
```sh
  npm install
```
this will check whether you have all the dependecies for this project and install them inside of a *node_modules* folder if you don't have them.


**c.** For the first time running (and every time you make a larger change like adding a plugin or changing the gruntFile), run

```sh
  grunt
```

which will bundle the dependencies into the public folder, seperating the app files *(app.js)* from the library of plugins. *(lib.js)* You should now be able to pull up the public folder in the browser.

<code>
://**BULLPEN_REPOSITORY**/public/index.html
</code>

(just to make sure it's working as intended)


#Development

**d.** If you're working on development or testing, there's a more convenient way to work than typing *grunt* into the terminal all the live long day.  To make grunt check for changes as you work, type either of the following:

#### grunt serve
```
  grunt serve
```
For quick development, which will lint through the code in the folder *without watching or compiling tests*, and automatically pull up and refresh the browser for

http://localhost:8000/public/unpack.html
*(this is subject to change in the GruntFile after the routing is fleshed out)*


**This does:**

1. jslint
2. bundles dependencies (browserify)
3. opens page or refreshes page in your default browser,

#### unpack.html
unpack.html is the unminified version of the index, so that console errors can be traced back to their appropriate documents.
The minified version is the index   **http://localhost:8000/public/**

4. watch for changes and goes back to step 1.

*Runtime* about 500 ms

### grunt test

For testing the app, run
```
  grunt test
```

**This does:**

1. jslint
2. bundles dependencies (browserify)
3. temporarily connects the server
4. runs *mocha_phantomjs* for **unit testing**
5. runs *casperjs* for **end-to-end testing**

Mocha tests the individual backbone javascript objects, while casper is an end-to-end test that clicks around the browser and expects a user-flow to follow the correct path.

*Runtime* about 5 seconds


### grunt test-browser
For more extensive logging, ( or if you don't want to run casper ) you can view mocha in the browser via:
```
  grunt test-browser
```

This automatically detects changes and refreshes the /test page, which is a runner for the mocha test suite.

---
To only run casper:
```
  grunt casperjs
```
If you're getting tired of the browser continuing to open new tabs, run:
```
  grunt srv
```
If you only want to run the node server for whatever reason, run:
```
  grunt server
```



###but where are the actual files:

*/app*   <------ in there     *(This is the folder that is usually being watched by grunt while grunt is running)*

*/test*   <-----test pages   *(Check out ./test/suite.js for including files, and the ./test/casper folder for casperjs tests)*

*/public*  <-----production ready files *(the compiled files that are served up.  Errors still source to the name of uncompressed file, through some witchcraft, unless the files are minified, which is another story)*


#Customization

You can setup a new grunt task to fit your needs without affecting the rest of the app.
Let me know if you would like me to write you a custom grunt task. (say for example you only want testing done in the terminal.)



