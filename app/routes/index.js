// routes/index.js
const userRoutes = require('./user_routes');
const opdrachtRoutes = require('./opdracht_routes');
module.exports = function(app, db) {
    userRoutes(app, db);
    opdrachtRoutes(app,db);
    // Other route groups could go here, in the future
};