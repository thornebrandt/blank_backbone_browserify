var $ = require('jquery');
var jquery_validate = require('../../public/lib/jquery.validate.js');
var self;
module.exports = {
    validateForm : function($_form, custom_options){
        self = this;
        var validation_options = {};
        var type = custom_options.type || "";
        if(type && typeof this[type] === "object"){
            validation_options = this[type];
        }
        custom_options || {};
        $.extend(validation_options, custom_options);
        validation_options.rules = this.validationRules;
        validation_options.messages = this.validationMessages;
        if($_form.length > 0){
            this.removeWhitespace("email", $_form);
            this.removeWhitespace("mail", $_form);
            $_form.validate(validation_options);
        } else {
            return false;
        }
    },
    //remove whitespace where needed
    removeWhitespace : function(name, $_form){
        var $_name = $_form.find("input[name=" + name + "]");
        $_name.val($.trim($_name.val()));
    },


    validationRules : {
        mail: {
            required: true,
            email: true
        },
    },

    validationMessages : {
        mail: {
            required: "Please include an email",
            email: "Please use a valid email address"
        }

    },

    zipCode : function(value){
        var exp = new RegExp("^\\d{5}(-\\d{4})?$");
        return exp.test(value);
    },

    numbersOnly: function(e){
       // Allow: backspace, delete, tab, escape, enter and .
       if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A
           (e.keyCode === 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
           (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
       }
       // Ensure that it is a number and stop the keypress
       if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
           e.preventDefault();
       }
    },

    formatPhoneNumber : function(n){
        if (n){
            var newNumber = n.replace(/(\d{3})(\d{3})(\d{4})/,
                "$1.$2.$3");
            return newNumber;
        } else {
            return "";
        }
    }



};