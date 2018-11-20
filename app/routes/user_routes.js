const ObjectId       = require('mongodb').ObjectID;

module.exports = function(app, db) {

    // Jens Sels - Verwijderen van user where Id
    app.delete('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('user').deleteOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send('User ' + id + ' deleted!');
            }
        });
    });

    // Jens Sels - Update een user
    app.put('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        const user = { naam: req.body.naam, email: req.body.email, wachtwoord: req.body.wachtwoord, adminNiveau: req.body.adminNiveau };
        db.collection('user').updateOne(details, {$set: user}, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send('OK');
            }
        });
    });

    // Jens Sels - Ophalen van user where id
    app.get('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('user').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });

    // Jens Sels - Ophalen van alle opdrachten van een user
    app.get('/users/:id/opdrachten', (req, res) => {
        const id = req.params.id;
        db.collection('opdracht').find({'userId': id}).sort({datumInzending: -1} ).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(items);
            }
        });
    });

    // Jens Sels - Ophalen van alle users
    app.get('/users/', (req, res) => {
        db.collection('user').find({}).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(items);
            }
        });
    });

    // Jens Sels - User toevoegen
    app.post('/users', (req, res) => {
        const user = { naam: req.body.naam, email: req.body.email, wachtwoord: req.body.wachtwoord, adminNiveau: req.body.adminNiveau };

        db.collection('user').insert(user, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    // Jens Sels - Returned het user object indien email en wachtwoord combinatie overeen komen
    app.post('/users/login', (req, res) => {
        const email = req.body.email;
        const wachtwoord = req.body.wachtwoord;

        const details = {'email' : email, 'wachtwoord': wachtwoord};

        db.collection('user').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });
};