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

        client.close();

        return token;




    } catch (err) {

        console.log(err);
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
            client.close();
            console.log("Token updated");
        })


    } catch (err) {

        console.log(err);
    }
}

exports.insertToken = async function insertToken(token) {

    const client = await mongo.connect(process.env.DB_URL, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db(process.env.DB_NAME);

        let collection = db.collection('token-data');

        collection.insertOne(token);
        client.close();
        console.log("Token inserted");

    } catch (err) {

        console.log(err);
    }

}

exports.deleteToken = async function deleteToken(id) {

    const client = await mongo.connect(process.env.DB_URL, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db(process.env.DB_NAME);

        let collection = db.collection('token-data');

        collection.deleteOne({ "_id": id }, function (err) {
            client.close();
            console.log("Token deleted");
        });

    } catch (err) {

        console.log(err);
    }
}


