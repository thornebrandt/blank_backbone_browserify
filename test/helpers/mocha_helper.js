var fakeData = require('../lib/fakeData.js');
module.exports = {
    fakeAuthentication: function(){
        localStorage.user = JSON.stringify(fakeData.kevin);
    }
};