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


    // Jens Sels - Ophalen van opdracht where id
    app.get('/opdrachten/:id', loginGuard, (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('opdracht').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send(item);
            }
        });
    });

    // Jens Sels - Ophalen van alle opdracht types
    app.get('/opdrachtTypes/', loginGuard, (req, res) => {
        db.collection('opdrachtType').find({}).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send(items);
            }
        });
    });

    // Jens Sels - Ophalen van een opdracht type
    app.get('/opdrachtTypes/:id', loginGuard, (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('opdrachtType').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send(item);
            }
        });
    });

    // Jens Sels - Opdracht toevoegen
    app.post('/opdrachten', loginGuard, (req, res) => {
        const opdracht = { titel: req.body.titel, beschrijving: req.body.beschrijving, datumInzending: req.body.datumInzending, userId: req.body.userId, opdrachtTypeId: req.body.opdrachtTypeId, aantalPunten: req.body.aantalPunten, isGoedgekeurd: req.body.isGoedgekeurd, datumGoedgekeurd: req.body.datumGoedgekeurd };
        db.collection('opdracht').insertOne(opdracht, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred ' + err });
            } else {
                res.send(result.ops[0]);
            }
        });
    });



    // Jens Sels - Ophalen van alle opdrachten
    app.get('/opdrachten/', loginGuard, (req, res) => {
        const params = {};
        if (req.query.isGoedgekeurd != null){
            params['isGoedgekeurd'] =  req.query.isGoedgekeurd;
        }
        console.log(params);
        db.collection('opdracht').find(params).sort({datumInzending: -1} ).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send(items);
            }
        });
    });
    

    // Jens Sels - Bewerken van opdracht
    app.put('/opdrachten/:id', adminGuard, (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        const params = {};
        if (req.body.titel != null){
            params['titel'] = req.body.titel;
        }
        if (req.body.beschrijving != null){
            params['beschrijving'] = req.body.beschrijving;
        }
        if (req.body.datumInzending != null){
            params['datumInzending'] = req.body.datumInzending;
        }
        if (req.body.userId != null){
            params['userId'] = req.body.userId;
        }
        if (req.body.opdrachtTypeId != null){
            params['opdrachtTypeId'] = req.body.opdrachtTypeId;
        }
        if (req.body.aantalPunten != null){
            params['aantalPunten'] = req.body.aantalPunten;
        }
        if (req.body.isGoedgekeurd != null){
            params['isGoedgekeurd'] = req.body.isGoedgekeurd;
        }
        if (req.body.datumGoedgekeurd != null){
            params['datumGoedgekeurd'] = req.body.datumGoedgekeurd;
        }

        db.collection('opdracht').updateOne(details, {$set: params}, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send({message: 'OK'});
            }
        });
    });

    // Jens Sels - Verwijderen van opdracht where id
    app.delete('/opdrachten/:id', adminGuard, (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('opdracht').deleteOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send({message: 'Opdracht ' + id + ' deleted!'});
            }
        });
    });

    // Jens Sels - Bewerken van opdracht Type
    app.put('/opdrachtTypes/:id', adminGuard, (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        const params = {};
        if(req.body.naam != null){
            params['naam'] = req.body.naam;
        }
        if(req.body.aantalPunten != null){
            params['aantalPunten'] = req.body.aantalPunten;
        }

        db.collection('opdrachtType').updateOne(details, {$set: params}, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred' + err});
            } else {
                res.send({message: 'OK'});
            }
        });
    });

    // Jens Sels - OpdrachtType toevoegen
    app.post('/opdrachtTypes', adminGuard, (req, res) => {
        const opdrachtType = { naam: req.body.naam, aantalPunten: req.body.aantalPunten };

        db.collection('opdrachtType').insertOne(opdrachtType, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred ' + err });
            } else {
                res.send(result.ops[0]);
            }
        });
    });


    // Jens Sels - Ophalen van alle opdrachten van een bepaalde opdracht Type
    app.get('/opdrachtTypes/:id/opdrachten', adminGuard, (req, res) => {
        const id = req.params.id;
        db.collection('opdracht').find({'opdrachtTypeId': id}).sort({datumInzending: -1} ).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send(items);
            }
        });
    });

    // Jens Sels - Verwijderen van opdracht Type
    app.delete('/opdrachtTypes/:id', adminGuard, (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('opdrachtType').deleteOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send({message: 'Opdracht type ' + id + ' deleted!'});
            }
        });
    });
};