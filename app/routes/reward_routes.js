const ObjectId       = require('mongodb').ObjectID;
const config         = require('../../config/config');
const jwt            = require('jsonwebtoken');

module.exports = function(app, db) {

    // Jens Sels - Middleware die checkt of er een valid token is meegegeven
    app.use(function(req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ message: 'No token provided.' });

        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) return res.status(500).send({message: 'Failed to authenticate token.'});
        });
        next();
    });

    // Jens Sels - Ophalen van alle rewards
    app.get('/rewards/', (req, res) => {
        const validOrderBy = ['naam', 'beschrijving', 'aantalPunten', 'fotoCode', 'datum'];
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
        db.collection('reward').find({}).sort(sort).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred: ' + err});
            } else {
                res.send(items);
            }
        });
    });

    // Jens Sels - Ophalen van reward where Id
    app.get('/rewards/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('reward').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send(item);
            }
        });
    });


    // Jens Sels - Middleware die checkt of de gebruiker genoeg permissions heeft
    app.use(function(req, res, next) {
        const token = req.headers['x-access-token'];
        jwt.verify(token, config.secret, function(err, decoded) {
            if (parseInt(decoded.adminNiveau) < 1) {
                return res.status(403).send({message: 'Access denied, permission not high enough.'});
            }
            else{
                next();
            }
        });
    });

    // Jens Sels - Reward toevoegen
    app.post('/rewards', (req, res) => {
        const reward = { naam: req.body.naam, beschrijving: req.body.beschrijving, aantalPunten: req.body.aantalPunten, fotoCode: req.body.fotoCode, datum: req.body.datum };
        db.collection('reward').insertOne(reward, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred ' + err });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    // Jens Sels - Update een reward
    app.put('/rewards/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        const params = {};
        if (req.body.naam != null){
            params['naam'] = req.body.naam;
        }
        if (req.body.beschrijving){
            params['beschrijving'] = req.body.beschrijving;
        }
        if (req.body.aantalPunten){
            params['aantalPunten'] = req.body.aantalPunten;
        }
        if (req.body.fotoCode != null){
            params['fotoCode'] = req.body.fotoCode;
        }
        if (req.body.datum != null){
            params['datum'] = req.body.datum;
        }

        db.collection('reward').updateOne(details, {$set: params}, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send({message: 'OK'});
            }
        });
    });

    // Jens Sels - Verwijderen van reward where Id
    app.delete('/rewards/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('reward').deleteOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send({message: 'Reward ' + id + ' deleted!'});
            }
        });
    });
};