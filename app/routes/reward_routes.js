const ObjectId       = require('mongodb').ObjectID;

module.exports = function(app, db) {

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
                res.send('OK');
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
                res.send('Reward ' + id + ' deleted!');
            }
        });
    });
};