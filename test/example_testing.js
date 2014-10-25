var testModule = require('./testingModule');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
describe('example-testing.js: Testing testing itself', function () {
    it('mocha should working', function () {
        if (false) {
            throw new Error('false is true, I have no clue');
        }
    });
    it('chai should work', function () {
        expect(testModule.add(2, 3)).to.equal(5);
        expect(testModule.mult(6, 7)).to.equal(42);
    });
    it('sinon and sinonChai should work', function () {
        var stub = sinon.stub();
        testModule.callCallback(stub);
        expect(stub).to.have.been.called;
        expect(stub.firstCall.args[0]).to.equal(1302);
    });

    it('tests should spy on subscribers of publish', function(){
        var sinonCallback = sinon.spy();
        var events = {};
        _.extend(events, Backbone.Events);
        events.on("message", sinonCallback());
        events.trigger("message;");
        assert.isTrue(sinonCallback.called);
    });

    it('is using a fake timer', function(){
        var clock = sinon.useFakeTimers();
        assert.isTrue(true);
        var hidden =
            $("<div id='hidden'>Peekabo</div>")
                .appendTo($("#test_container")).fadeIn('slow');
        clock.tick(650);
        expect(parseInt(hidden.css('opacity'))).to.equal(1);
        clock.restore();
    });

    // it('should inspec jquery.getJSONs usage of jQuery.ajax', function(){
    //     sinon.spy($, "ajax");
    //     $.getJSON("/some/random/ass/resource");
    //     sinonChai.assert($.ajax.calledOnce);
    //     sinonChai.assertEquals("/some/random/ass/resource", $.ajax.getCall(0).args[0].url);
    //     sinonChai.assertEquals("json", $.ajax.getCall(0).args[0].dataType);
    //     $.ajax.restore();
    // });

});
