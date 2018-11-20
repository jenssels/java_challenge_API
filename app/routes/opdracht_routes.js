const ObjectId       = require('mongodb').ObjectID;

module.exports = function(app, db) {
    // Jens Sels - Ophalen van alle opdrachten
    app.get('/opdrachten/', (req, res) => {
        const params = {};
        if (req.query.isGoedgekeurd != null){
            params['isGoedgekeurd'] =  req.query.isGoedgekeurd === 'true';
        }
        console.log(params);
        db.collection('opdracht').find(params).sort({datumInzending: -1} ).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred'});
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
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });

    // Jens Sels - Opdracht toevoegen
    app.post('/opdrachten', (req, res) => {
        const opdracht = { titel: req.body.titel, beschrijving: req.body.beschrijving, datumInzending: req.body.datumInzending, userId: req.body.userId, opdrachtTypeID: req.body.opdrachtTypeID, aantalPunten: req.body.aantalPunten, isGoedgekeurd: req.body.isGoedgekeurd, datumGoedgekeurd: req.body.datumGoedgekeurd };
        db.collection('opdracht').insert(opdracht, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    // Jens Sels - Bewerken van opdracht
    app.put('/opdrachten/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        const opdracht = { titel: req.body.titel, beschrijving: req.body.beschrijving, datumInzending: req.body.datumInzending, userId: req.body.userId, opdrachtTypeId: req.body.opdrachtTypeId, aantalPunten: req.body.aantalPunten, isGoedgekeurd: req.body.isGoedgekeurd, datumGoedgekeurd: req.body.datumGoedgekeurd  };
        db.collection('opdracht').updateOne(details, {$set: opdracht}, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred' + err});
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
                res.send({'error':'An error has occurred'});
            } else {
                res.send('User ' + id + ' deleted!');
            }
        });
    });

    // Jens Sels - Bewerken van opdracht Type
    app.put('/opdrachtTypes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        const opdrachtType = { naam: req.body.naam, aantalPunten: req.body.aantalPunten  };
        db.collection('opdrachtType').updateOne(details, {$set: opdrachtType}, (err, result) => {
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

        db.collection('opdrachtType').insert(opdrachtType, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    // Jens Sels - Ophalen van alle opdracht types
    app.get('/opdrachtTypes/', (req, res) => {
        db.collection('opdrachtType').find({}).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred'});
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
                res.send({'error':'An error has occurred'});
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
                res.send({'error':'An error has occurred'});
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
                res.send({'error':'An error has occurred'});
            } else {
                res.send('Opdracht type ' + id + ' deleted!');
            }
        });
    });
};