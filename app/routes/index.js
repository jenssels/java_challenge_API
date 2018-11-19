// routes/index.js
const userRoutes = require('./user_routes');
module.exports = function(app, db) {
    userRoutes(app, db);
    // Other route groups could go here, in the future
};