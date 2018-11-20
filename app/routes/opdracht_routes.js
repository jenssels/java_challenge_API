const ObjectId       = require('mongodb').ObjectID;

module.exports = function(app, db) {
    // Jens Sels - Ophalen van alle opdrachten
    app.get('/opdrachten/', (req, res) => {
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

    // Jens Sels - Ophalen van opdracht where id
    app.get('/opdrachten/:id', (req, res) => {
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

    // Jens Sels - Opdracht toevoegen
    app.post('/opdrachten', (req, res) => {
        const opdracht = { titel: req.body.titel, beschrijving: req.body.beschrijving, datumInzending: req.body.datumInzending, userId: req.body.userId, opdrachtTypeId: req.body.opdrachtTypeId, aantalPunten: req.body.aantalPunten, isGoedgekeurd: req.body.isGoedgekeurd, datumGoedgekeurd: req.body.datumGoedgekeurd };
        db.collection('opdracht').insertOne(opdracht, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred ' + err });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    // Jens Sels - Bewerken van opdracht
    app.put('/opdrachten/:id', (req, res) => {
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
            params['isGoedgekeurd'] = req.body.isGoedgekeurd === "true";
        }
        if (req.body.datumGoedgekeurd != null){
            params['datumGoedgekeurd'] = req.body.datumGoedgekeurd;
        }

        db.collection('opdracht').updateOne(details, {$set: params}, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send('OK');
            }
        });
    });

    // Jens Sels - Verwijderen van opdracht where id
    app.delete('/opdrachten/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('opdracht').deleteOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send('Opdracht ' + id + ' deleted!');
            }
        });
    });

    // Jens Sels - Bewerken van opdracht Type
    app.put('/opdrachtTypes/:id', (req, res) => {
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
                res.send('OK');
            }
        });
    });

    // Jens Sels - OpdrachtType toevoegen
    app.post('/opdrachtTypes', (req, res) => {
        const opdrachtType = { naam: req.body.naam, aantalPunten: req.body.aantalPunten };

        db.collection('opdrachtType').insertOne(opdrachtType, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred ' + err });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    // Jens Sels - Ophalen van alle opdracht types
    app.get('/opdrachtTypes/', (req, res) => {
        db.collection('opdrachtType').find({}).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send(items);
            }
        });
    });

    // Jens Sels - Ophalen van een opdracht type
    app.get('/opdrachtTypes/:id', (req, res) => {
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

    // Jens Sels - Ophalen van alle opdrachten van een bepaalde opdracht Type
    app.get('/opdrachtTypes/:id/opdrachten', (req, res) => {
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
    app.delete('/opdrachtTypes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('opdrachtType').deleteOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send('Opdracht type ' + id + ' deleted!');
            }
        });
    });
};