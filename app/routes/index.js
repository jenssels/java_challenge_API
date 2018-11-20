// routes/index.js
const userRoutes = require('./user_routes');
const opdrachtRoutes = require('./opdracht_routes');
const rewardRoutes = require('./reward_routes');
module.exports = function(app, db) {
    userRoutes(app, db);
    opdrachtRoutes(app,db);
    rewardRoutes(app, db);
};