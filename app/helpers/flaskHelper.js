var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var time = require('../helpers/dateHelper.js');
var App = window.App;
var moment = require('moment');
module.exports = function(_options){
    /*jshint maxcomplexity:99 */
    var self = this;
    this.url = {};
    this.filters = [];
    this.order_by = [];
    this.relations = [];
    this.fields = {};
    this.queryString = "";
    this.filtersObj = {};
    this.queryObj = {};

    this.query = function(queryFunction, options){
        //construct the queryString

        this.url = {};
        this.filters = [];
        this.order_by = [];
        this.relations = [];
        this.fields = {};
        this.queryString = "";
        this.filtersObj = {};
        this.queryObj = {};
        options = options || {};

        this.construct(queryFunction, options);
        if(this.filters.length){
            this.queryObj.filters = this.filters;
        }
        if(this.order_by.length){
            this.queryObj.order_by = this.order_by;
        }
        if(this.disjunction){
            this.queryObj.disjunction = true;
        }
        if(options.results_per_page){
            this.queryObj.limit = options.results_per_page;
        }
        if(this.results_per_page){
            this.queryObj.limit = this.results_per_page;
        }
        if(this.limit){
            this.queryObj.limit = this.limit;
        }
        if(this.page){
            this.queryObj.page = this.page;
        }
        this.base_url = options.base_url || App.BASE_URL;
        this.queryString = this.base_url + this.url + "?q=" + JSON.stringify(this.queryObj);
        if(!$.isEmptyObject(this.fields)){
            this.cleanEmptyArrays(this.fields);
            this.queryString += "&fields=" + JSON.stringify(this.fields);
        }
        if(this.custom_filters){
            this.queryString += "&filters=" + JSON.stringify(this.custom_filters);
        }
        if(this.outputFormat){
            this.queryString += "&output=" + this.outputType;
        }
        return this.queryString;
    };

    this.construct = function(queryFunction, options){
        switch(queryFunction){

            case "standardFetch":
                //-- gets today and tomorrow
                this.url = "v1/event";
                this.addFilter(this.starting("start_time", time.today()));
                this.addFilter(this.ending("end_time", time.tomorrow()));
            break;
        }
    };


    this.greaterThan = function(_name, _val){
        return this.operator(_name, "gt", _val);
    };

    this.atLeast = function(_name, _val){
        return this.operator(_name, "gte", _val);
    };

    this.equals = function(_name, _val){
        return this.operator(_name, "eq", _val);
    };

    this.lessThan = function(_name, _val){
        return this.operator(_name, "lt", _val);
    };

    this.starting = function(_name, _val){
        return this.atLeast(_name, _val);
    };

    this.ending = function(_name, _val){
        return this.lessThan(_name, _val);
    };

    this.operator = function(_name, _op, _val){
        //{"name":"status","val":"active","op":"eq"}
        var filterObj = {};
        filterObj.name = _name;
        filterObj.val = _val;
        filterObj.op = _op;
        return filterObj;
    };

    this.filter = function(_filter){
        this.filters.push(_filter);
    };

    this.addFilter = function(_filter){
        this.filter(_filter);
    };

    this.getSingleResponse = function(){
        this.results_per_page = 1;
    };

    this.geoFilterZip = function(_zip, _radius){
        var geoFilter = {};
        geoFilter.location = {};
        geoFilter.location.postal_code = _zip;
        if(_radius){
            geoFilter.radius = parseInt(_radius);
        }
        return geoFilter;
    };

    this.geoFilterProvince = function(_city, _state, _radius){
        var geoFilter = {};
        geoFilter.location = {};
        geoFilter.location.city = _city;
        geoFilter.location.province = _state;
        if(_radius){
            geoFilter.radius = parseInt(_radius);
        }
        return geoFilter;
    };

    this.availabilityFilter = function(_start, _end){
        var availabilityFilter = {};
        availabilityFilter.start = _start;
        availabilityFilter.end = _end;
        return availabilityFilter;
    };

    this.addAvailabilityFilter = function(_start, _end){
        this.custom_filters = this.custom_filters || {};
        this.custom_filters.availability = this.availabilityFilter(_start, _end);
    };


    this.orderBy = function(_field, _direction){
        //queryString function for &orderBy:
        var obj = {
            "field": _field,
            "direction": _direction
        };
        this.order_by.push(obj);
    };

    this.addRelation = function(relation){
        this.relations.push(relation);
    };

    this.addRelations = function(){
        for(var i = 0; i < arguments.length; i++){
            self.relations.push(arguments[i]);
        }
    };

    this.createNewRelation = function(name, options){
        var relation = new self.createRelation(name, options);
        this.addRelation(relation);
        return relation;
    };

    this.eitherOr = function(){
        this.disjunction = true;
    };

    this.outputToggle = function(outputType){
        this.outputFormat = true;
        this.outputType = outputType;
    };

    this.createRelation = function(name, options){
        options = options || {};
        this.name = name;
        this.include_fields = options.include_fields ? options.include_fields : [];
        this.exclude_fields = options.exclude_fields ? options.exclude_fields : [];
        this.relations = options.relations ? options.relations : [];
        var parent = this;
        this.includeField = function(field){
            parent.include_fields.push(field);
        };
        this.includeFields = function(){
            for(var i = 0; i < arguments.length; i++){
                parent.includeField(arguments[i]);
            }
        };

        this.excludeField = function(field){
            this.exclude_fields.push(field);
        };
        this.excludeFields = function(){
            for(var i = 0; i < arguments.length; i++){
                parent.excludeField(arguments[i]);
            }
        };
        this.addRelation = function(relation){
            this.relations.push(relation);
        };

        this.addRelations = function(){
            for(var i = 0; i < arguments.length; i++){
                parent.relations.push(arguments[i]);
            }
        };
        this.createNewRelation = self.createNewRelation;
    },




    this.cleanEmptyArrays = function(object){
        for (var key in object) {
            if (object.hasOwnProperty(key)){
                if(typeof object[key] === "object"){
                    if(object[key].length === 0){
                        delete object[key];
                    } else {
                        this.cleanEmptyArrays(object[key]);
                    }
                }
            }
        }
    };

};

