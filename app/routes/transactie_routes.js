const ObjectId       = require('mongodb').ObjectID;
const config         = require('../../config/config');
const jwt            = require('jsonwebtoken');

// Jens Sels - Middleware die checkt of er een valid token is meegegeven
const loginGuard = function(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({message: 'Failed to authenticate token.'});
    });
    next();
};
// Jens Sels - Middleware die checkt of de token valid is en dat de gebruiker een admin is
const adminGuard = function(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({message: 'Failed to authenticate token.'});
        if (parseInt(decoded.adminNiveau) < 1) {
            return res.status(403).send({message: 'Access denied, permission not high enough.'});
        }
        else{
            next();
        }
    });
};

module.exports = function(app, db) {


    // Jens Sels - Ophalen van alle transacties
    app.get('/transacties/', loginGuard, (req, res) => {
        const validOrderBy = ['aantalPunten','datum'];
        const validOrderDirection = ['ASC', 'DESC'];
        const orderBy = req.query.orderBy;
        const orderDirection = req.query.orderDirection;
        const sort = {};
        if (orderBy != null && orderDirection != null && validOrderBy.includes(orderBy) && validOrderDirection.includes(orderDirection)){
            let richting = -1;
            if (orderDirection === "ASC"){
                richting = 1;
            }
            sort[orderBy] = richting;
        }
        db.collection('transactie').find({}).sort(sort).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred: ' + err});
            } else {
                res.send(items);
            }
        });
    });

    // Jens Sels - Ophalen van transactie where Id
    app.get('/transacties/:id', loginGuard, (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('transactie').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send(item);
            }
        });
    });

    // Jens Sels - Transactie toevoegen
    app.post('/transacties/', loginGuard, (req, res) => {
        const transactie = { userId: req.body.userId, rewardId: req.body.rewardId, aantalPunten: req.body.aantalPunten, datum: req.body.datum };
        db.collection('transactie').insertOne(transactie, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred ' + err });
            } else {
                res.send(result.ops[0]);
            }
        });
    });


    // Jens Sels - Update een transactie
    app.put('/transacties/:id', adminGuard, (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        const params = {};
        if (req.body.userId != null){
            params['userId'] = req.body.userId;
        }
        if (req.body.rewardId){
            params['rewardId'] = req.body.rewardId;
        }
        if (req.body.aantalPunten){
            params['aantalPunten'] = req.body.aantalPunten;
        }
        if (req.body.datum != null){
            params['datum'] = req.body.datum;
        }

        db.collection('transactie').updateOne(details, {$set: params}, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send({message: 'OK'});
            }
        });
    });

    // Jens Sels - Verwijderen van transactie where Id
    app.delete('/transacties/:id', adminGuard, (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('transactie').deleteOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send({message: 'Transactie ' + id + ' deleted!'});
            }
        });
    });

};