const ObjectId       = require('mongodb').ObjectID;

module.exports = function(app, db) {
    // Jens Sels - Ophalen van alle transacties
    app.get('/transacties/', (req, res) => {
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
    app.get('/transacties/:id', (req, res) => {
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
    app.post('transacties', (req, res) => {
        const reward = { userId: req.body.userId, rewardId: req.body.rewardId, aantalPunten: req.body.aantalPunten, datum: req.body.datum };
        db.collection('transactie').insertOne(reward, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred ' + err });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    // Jens Sels - Update een transactie
    app.put('/transacties/:id', (req, res) => {
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
                res.send('OK');
            }
        });
    });

    // Jens Sels - Verwijderen van transactie where Id
    app.delete('/transacties/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('transactie').deleteOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send('Reward ' + id + ' deleted!');
            }
        });
    });

};