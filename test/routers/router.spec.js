//test header dependencies
require('../../app/namespace.js');
var App = window.App;
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
//end test header dependencies
App.Routers.Router = require('../../app/routers/router.js');
describe("App.Routers.Router", function(){
	var opts = { trigger: true };
    before(function(){
		sinon.stub(App.Routers.Router.prototype, "index");
        sinon.stub(App.Routers.Router.prototype, "shift_detail");
        sinon.stub(App.Routers.Router.prototype, "upcoming_shifts");
		this.router = new App.Routers.Router();
		Backbone.history.start();
		this.routerSpy = sinon.spy();
        this.router.on("route", this.routerSpy);
	});

	after(function(){
        this.router.navigate("");
		Backbone.history.stop();
		App.Routers.Router.prototype.shift_detail.restore();
		App.Routers.Router.prototype.index.restore();
        App.Routers.Router.prototype.upcoming_shifts.restore();
	});

	it("can route to the shift-detail", function(){
		this.router.navigate("shift-detail/1", opts);
		expect(App.Routers.Router.prototype.shift_detail)
			.to.have.been.calledOnce.and
			.to.have.been.calledWith("1");
		expect(this.routerSpy)
			.to.have.been.calledOnce.and
            .to.have.been.calledWith("shift_detail", ["1", null]);
	});

	it("it uses the history", function(){
		this.router.navigate("shift-detail/1", opts);
		this.router.navigate("schedule/upcoming", opts);
        this.router.navigate("shift-detail/1", opts);

		expect(this.router.upcoming_shifts)
			.to.have.been.calledOnce.and
			.to.have.been.calledWith();

		expect(this.routerSpy)
			.to.have.been.calledThrice.and
            .to.have.been.calledWith("upcoming_shifts");
	});

});