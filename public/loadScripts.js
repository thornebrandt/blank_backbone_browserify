//this file appends the version number from the config file onto javascript assets
//-Thorne 2014-10-23


var TIMESTAMP = new Date().getTime();
//var config_src = "config.js?version=" + TIMESTAMP;
var config_src = "config.js?version=" + TIMESTAMP;
var config_el = document.createElement('script');
var app_src;
var lib_src;

var loadMini = function(e){
    loadAsset("dist/libs.min.js", LIB_VERSION, function(){
        loadAsset("dist/app.min.js", APP_VERSION);
    });
}

var loadUnpacked = function(e){
    loadAsset("dist/libs.js", LIB_VERSION, function(){
        loadAsset("dist/app.js", APP_VERSION);
    });
}

var loadConfig = function(_onload){
    config_el.src = config_src;
    config_el.onload = _onload;
    addScript(config_el);
}

var loadAsset = function(path, global_var, _callback){
    var source,
        script_el;
    if(global_var){
        source = path + "?version=" + global_var;
    }else{
        source = path + "?version=" + TIMESTAMP;
    }
    script_el = document.createElement('script');
    script_el.src = source;
    script_el.onload = _callback;
    addScript(script_el);
}


var addScript = function(_el){
    document.getElementsByTagName('head')[0].appendChild(_el);
}

var loadScripts = function(){
    loadConfig(loadMini);
}

var loadUnPackedScripts = function(){
    loadConfig(loadUnpacked);
}