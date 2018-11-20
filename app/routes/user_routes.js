const ObjectId       = require('mongodb').ObjectID;
const config         = require('../../config/config');
const jwt            = require('jsonwebtoken');

module.exports = function(app, db) {

    // Jens Sels - Indien email en wachtwoord combinatie overeen komen dan sturen we een access token mee
    app.post('/users/login', (req, res) => {
        const email = req.body.email;
        const wachtwoord = req.body.wachtwoord;

        const details = {'email' : email, 'wachtwoord': wachtwoord};

        db.collection('user').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                const token = jwt.sign({ id: item._id, adminNiveau: item.adminNiveau }, config.secret, {
                    expiresIn: 86400
                });
                res.send({token: token, user: item});
            }
        });
    });

    // Jens Sels - Middleware die checkt of er een valid token is meegegeven
    app.use(function(req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ message: 'No token provided.' });

        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) return res.status(500).send({message: 'Failed to authenticate token.'});
        });
        next();
    });

    // Jens Sels - Ophalen van alle opdrachten van een user
    app.get('/users/:id/opdrachten', (req, res) => {
        const id = req.params.id;
        const params = {'userId': id};
        if (req.query.isGoedgekeurd != null){
            params['isGoedgekeurd'] =  req.query.isGoedgekeurd;
            console.log(params);
        }
        db.collection('opdracht').find(params).sort({datumInzending: -1} ).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send(items);
            }
        });
    });

    // Jens Sels - Ophalen van alle transacties van een user
    app.get('/users/:id/transacties', (req, res) => {
        const id = req.params.id;
        const params = {'userId': id};
        db.collection('transactie').find(params).sort({datum: -1} ).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send(items);
            }
        });
    });

    // Jens Sels - Ophalen van user where id
    app.get('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('user').findOne(details, (err, item) => {
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

    // Jens Sels - Verwijderen van user where Id
    app.delete('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('user').deleteOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send('User ' + id + ' deleted!');
            }
        });
    });

    // Jens Sels - Update een user
    app.put('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        const params = {};
        if (req.body.naam != null){
            params['naam'] = req.body.naam;
        }
        if (req.body.email != null){
            params['email'] = req.body.email;
        }
        if (req.body.wachtwoord != null){
            params['wachtwoord'] = req.body.wachtwoord;
        }
        if (req.body.adminNiveau != null){
            params['adminNiveau'] = req.body.adminNiveau;
        }

        db.collection('user').updateOne(details, {$set: params}, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send('OK');
            }
        });
    });


    // Jens Sels - Ophalen van alle users
    app.get('/users/', (req, res) => {
        db.collection('user').find({}).toArray((err, items) => {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                res.send(items);
            }
        });
    });

    // Jens Sels - User toevoegen
    app.post('/users', (req, res) => {
        const user = { naam: req.body.naam, email: req.body.email, wachtwoord: req.body.wachtwoord, adminNiveau: req.body.adminNiveau };

        db.collection('user').insertOne(user, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred ' + err });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

};
