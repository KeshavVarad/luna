const mongo = require('mongodb').MongoClient;

exports.getToken = async function getToken(id) {

    const client = await mongo.connect(process.env.DB_URL, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db(process.env.DB_NAME);

        let collection = db.collection('token-data');

        let query = { "_id": id }

        let token = await collection.findOne(query);

        return token;

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }
}

exports.updateToken = async function updateToken(id, newToken) {
    const client = await mongo.connect(process.env.DB_URL, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db(process.env.DB_NAME);

        let collection = db.collection('token-data');

        let query = { "_id": id }

        collection.updateOne(query, { $set: newToken }, function (err) {
            console.log("Token updated");
            client.close();
        })

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }
}

exports.insertToken = async function insertToken(token) {
    // mongo.connect(process.env.DB_URL, function (err, client) {
    //     var db = client.db(process.env.DB_NAME);
    //     db.collection('token-data').insertOne(token);
    //     console.log("Token inserted");
    //     client.close();
    // })
    const client = await mongo.connect(process.env.DB_URL, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db(process.env.DB_NAME);

        let collection = db.collection('token-data');

        collection.insertOne(token);
        console.log("Token inserted");

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }
    
}

exports.deleteToken = async function deleteToken(id) {
    // mongo.connect(process.env.DB_URL, function (err, client) {
    //     var db = client.db(process.env.DB_NAME);
    //     db.collection('token-data').deleteOne({ "_id": id }, function (err) {
    //         console.log("Token deleted");
    //     });
    //     client.close();
    // });

    const client = await mongo.connect(process.env.DB_URL, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db(process.env.DB_NAME);

        let collection = db.collection('token-data');

        collection.deleteOne({"_id": id}, function (err) {
            console.log("Token deleted");
        });

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }
}


