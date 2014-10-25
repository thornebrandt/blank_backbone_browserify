require('../namespace.js');
var appTemplate = require('../templates/app-template.hbs');
module.exports = Backbone.View.extend({
    initialize: function (){
        //represents an authorized experience
        //renders layout / navigation
        this.render();
    },
    el: 'body',

    events: {
    },

    loadFinishedHandler: function(){
        this.delayOneMillisecond( this.hideLoadingAnimation);
    },

    hideLoadingAnimation: function(){
        $("#loading").fadeOut("fast");
    },

    showLoadingAnimation: function(){
        $("#loading").fadeIn(100);
    },

    delayOneMillisecond: function(method){
        setTimeout(method, 1);
    },

    render: function(){
        $(this.el).html(appTemplate());
        this.hideLoadingAnimation();
    },
});

