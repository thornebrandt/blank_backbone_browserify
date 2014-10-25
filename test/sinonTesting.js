var testModule = require('./testingModule');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var obj = {
    multiply: function(a, b) { return a * b; },
    error: function(msg) { throw new Error(msg); }
};


var RealView = Backbone.View.extend({
    initialize: function(){
        this.on("wrapped", function(){ this.foo(); });
        this.on("unwrapped", this.foo);
    },

    foo: function(){
        return "I'm a real boy";
    }
});


describe('sinon testing: testing spies', function () {
    it("calls spy on wrapped object", function(){
        sinon.spy(obj, "multiply");
        expect(obj.multiply(5, 2)).to.equal(10);
        sinon.assert.calledWith(obj.multiply, 5, 2);
        expect(obj.multiply.returned(10)).to.be.true;
        expect(obj.multiply).to.be.calledWith(5, 2);
        obj.multiply.restore();
    });

    it("calls spy on error", function(){
        sinon.spy(obj, "error");
        try{
            obj.error("Foo");
        } catch (e){ }
        sinon.assert.threw(obj.error, "Error");
        obj.error.restore();
    });
});


describe('sinon testing: testing stubs', function(){
    it("stubs multiply", function(){
        sinon.stub(obj, "multiply").returns(5);
        expect(obj.multiply(1, 2)).to.equal(5);
        obj.multiply.restore();
    });

    it("replaces multiply with add", function(){
        sinon.stub(obj, "multiply", function(a, b){
            return a + b;
        });
        expect(obj.multiply(1, 2)).to.equal(3);
        obj.multiply.restore();
    });

    it("stubs error", sinon.test( function(){
        this.stub(obj, "error");
        expect(obj.error).to.not.throw();
    }));
});


describe("sinon testing: testing mocks", function(){
    it("mocks multiply", function(){
        var mock = sinon.mock(obj);
        mock.expects("multiply")
            .atLeast(2)
            .atMost(4)
            .withArgs(2);
        
        obj.multiply(2, 1);
        obj.multiply(2, 3);
        obj.multiply(2, 3);
        mock.verify();
        mock.restore();
    });
});


describe("stubbing a backbone view", function(){


    it("after initialization", sinon.test(function(){
        var realView = new RealView();
        this.stub(RealView.prototype, "foo").returns("I'm fake");
        //realView.foo.reset();
        realView.trigger("wrapped");
        expect(realView.foo)
            .to.be.calledOnce.and
            .to.have.returned("I'm fake");
        realView.foo.reset();
        realView.trigger("unwrapped");
        expect(realView.foo).to.not.be.called;
        // doesn't call naked function
        realView.foo.restore();
    }));

    it("before initialization", sinon.test(function(){
        this.stub(RealView.prototype, "foo").returns("I'm fake");
        var realView = new RealView();
        realView.trigger("wrapped");
        expect(realView.foo)
            .to.be.calledOnce.and
            .to.have.returned("I'm fake");
        realView.foo.reset();
        realView.trigger("unwrapped");
        expect(realView.foo)
            .to.be.calledOnce.and
            .to.have.returned("I'm fake");
    }));
});



