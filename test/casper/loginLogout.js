casper.options.clientScripts = ['../../../public/lib/jquery.js'];
var $ = require('jquery');
var url = 'http://localhost:8000/public';
var waitTime = 1000;  //adjust based on internet connection


casper.test.begin('logs in and out', 3, function(test){
    casper.start(url, function(){
        this.emit('page:loaded');
    });
    casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');
    casper.on('page:loaded', function(){
        this.on('remote.message', function(message){
            this.echo("console log: " + message, 'GREEN_BAR');
        });
    });
    casper.then(function(){
        this.test.assertExists('#login-form');
        this.fill('#login-form', {
            'email' : 'kevin@labs.shiftgig.com',
            'password' : '123456'
        }, false);
        this.click("#login_btn");
        this.wait(waitTime, function(){
            this.echo(this.getHTML(), "COMMENT");
            this.echo("getSession: " + getSession, 'WARN_BAR');
            this.echo("getLocalStorage: " + getLocalStorage, 'WARN_BAR');
            this.test.assertExists('#log-out');
            //if this fails, try increasing the waitTime
            this.click('#logout');
            this.test.assertExists('#login-form');
        });
        var getSession = this.evaluate(function(){
            var session = window.App;
            return JSON.stringify(session);
        });
        var getLocalStorage = this.evaluate(function(){
            return JSON.stringify(window.localStorage);
        });

    });
    casper.run(function(){
        test.done();
    });
});
