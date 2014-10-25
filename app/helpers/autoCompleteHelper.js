//             __       _____                __    __      __ __    __
//  ___ ___ __/ /____  / ___/__  __ _  ___  / /__ / /____ / // /__ / /__  ___ ____
// / _ `/ // / __/ _ \/ /__/ _ \/  ' \/ _ \/ / -_) __/ -_) _  / -_) / _ \/ -_) __/
// \_,_/\_,_/\__/\___/\___/\___/_/_/_/ .__/_/\__/\__/\__/_//_/\__/_/ .__/\__/_/
//                                  /_/                           /_/
//  Isolation for the behavior of autocomplete
//  so that it's down to one line. -Thorne
//
//
//  ---                    Use Example:
//      var autoComplete = require("../helpers/autoCompleteHelper.js");
//      _data = array of json objects [ { name: "hey", id: 1 } ]
//      passing a '{ simple : true } makes it just look for an array [1:00],[2:00],[3:00];
//      autoComplete.autoCompleteLocal( $("#companies_search"), _data );


require('../namespace.js');
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var FlaskHelper2 = require("../helpers/flaskHelper.js");
var FlaskHelper = FlaskHelper2;
var autoCompleteTemplate = require('../templates/autocomplete-template.hbs');
//var autoCompleteWorkerTemplate = require('../templates/autocomplete-worker-template.hbs');
var App = window.App;

module.exports = {

    autoCompleteRemote: function(_el, _options){
        var options = _options || {};
        var display = "autoCompleteDisplay"; // created in model and displayed in template
        var limit = options.limit || 12;
        var results;
        var template = autoCompleteTemplate;
        var inputVal = _el.val();
        var fakeLocalData = {};

        this.setValue = function(_id, _val){
            _el.attr("rel", _id);
            _el.typeahead('val', _val);
        };

        var selectedHandler = function(obj, datum){
            if(options.onSelect){
                options.onSelect(obj, datum);
            }
        };

        var customSource = function(_input, callback){
            //example custom source
            var flask = new FlaskHelper();
            var remoteQuery = flask.query( "testLike", { input: _input } );
            $.ajax(
                { url: remoteQuery }
            ).then(function(data){
                callback( data.objects );
            });

        };

        _el.typeahead({
            hint: true,
            highlight: true,
            autoselect: 'first'
        },
        {
            //source: results.ttAdapter(),
            source: options.source || customSource,
            render: function(){
                console.log("rendering");
            },
            templates: {
                suggestion: autoCompleteTemplate
            }
        });

        _el.attr("placeholder", "Search for eligibile workers");
        _el.on("typeahead:selected", selectedHandler);
    },

    simpleTemplate: function(data){
        return "<span>" + data + "</span>";
    },

    presetRel: function(_el, _data){
        var foundModel = _.findWhere(_data, { name: _el.val() });
        if( foundModel && foundModel.id ){
            _el.attr("rel", foundModel.id );
        }
    },

    autoCompleteLocal: function(_el, _data, _options){
        this.presetRel(_el, _data);
        var options = _options || {};
        var display = "autoCompleteDisplay"; // created in model and displayed in template
        var limit = options.limit || 12;
        var results;
        var template = autoCompleteTemplate;
        if ( options.simple === true ){
            template = this.simpleTemplate;
        }
        var setValues = function(obj, datum){
            if ( options.simple === true ){
                //entire datum for simple array
                _el.typeahead('val', datum);
            } else {
                _el.attr("rel", datum.id);
                _el.typeahead('val', datum[display]);
            }
            _el.typeahead('close');
        };

        var selectedHandler = function(obj, datum){
            setValues(obj, datum);
            if(options.onSelect){
                options.onSelect(obj, datum);
            }
        };

        var cursorChangedHandler = function(obj, datum){
            if(options.onChange){
                options.onChange(obj, datum);
            }
        };

        results = new Bloodhound({
            datumTokenizer: function(data){
                var dataDisplay = data[display]; // ex : data["name"]
                if(options.simple === true){
                    //or simple array
                    dataDisplay = data;
                }
                return Bloodhound.tokenizers.whitespace( dataDisplay );
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: _data,
            limit: limit
        });

        results.initialize();
        _el.typeahead({
            hint: true,
            highlight: true,
            autoselect: 'first',
            render: function(){
                console.log("rendering");
            }
        },
        {
            source: results.ttAdapter(),
            templates: {
                suggestion: template
            },
            updater: function(selection){
                console.log("you selected: " + selection);
            }
        });
        _el.unbind("typeahead:selected");
        _el.on("typeahead:selected", selectedHandler);
        _el.on("typeahead:cursorchanged", cursorChangedHandler);
    },
};


