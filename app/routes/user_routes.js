const ObjectId       = require('mongodb').ObjectID;

module.exports = function(app, db) {

    // Jens Sels - Verwijderen van user where Id
    app.delete('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('users').remove(details, (err, item) => {
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
        db.collection('users').update(details, user, (err, result) => {
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
        db.collection('users').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });

    // Jens Sels - Ophalen van alle users
    app.get('/users/', (req, res) => {
        db.collection('users').find({}).toArray((err, items) => {
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

        db.collection('users').insert(user, (err, result) => {
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

        db.collection('users').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });
};