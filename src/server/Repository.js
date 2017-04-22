export function Repository() {

    let FILES_COLLECTION = "files";

    let TaskStatus = {
        READY: "ready",
        PROCESSING: "processing",
        QUEUE: "queue"
    };

    let self = this;
    let mongodb = require('mongodb');
    let credentials = require('./../../config').mongodb;

    let url = "mongodb://" + credentials.host + "/" + credentials.database;
    if (credentials.user && credentials.password) {
        url = "mongodb://" + credentials.user + ":" + credentials.password
            + "@" + credentials.host + "/" + credentials.database;
    }

    let MongoClient = mongodb.MongoClient;
    let ObjectID = mongodb.ObjectID;

    this.db;


    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.error('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to', url);
            self.db = db;
        }
    });

    this.createFile = (name, content, type) => {

        let self = this;

        return new Promise(function (success, failure) {

            let file = {
                name: name,
                content: content,
                type: type,
                status: TaskStatus.QUEUE,
                createdDate: new Date()
            };

            self.db.collection(FILES_COLLECTION).insertOne(file, function (err, result) {
                if (err) failure(err);
                else success(file);
            });
        });
    };

    this.updateFile = (id, status, res) => {

        let self = this;

        return new Promise(function (success, failure) {

            let updatedAttr = {status: status};

            self.db.collection(FILES_COLLECTION).update({_id: ObjectID(id)},
                {$set: updatedAttr},
                function (err, result) {
                    if (err) {
                        failure(err);
                    } else {
                        if (res) {
                            res.json({"message": "Successfully updated " + result});
                        }
                        success();
                    }
                });
        });
    };

    this.getAllFiles = (res) => {
        this.db.collection(FILES_COLLECTION).find().toArray(function (err, items) {
            res.json(items);
        });
    };

    this.getFile = (id, callback) => {

        this.db.collection(FILES_COLLECTION).findOne({
            _id: ObjectID(id)
        }, callback);
    };

    this.deleteFile = (id, res) => {

        let self = this;

        return new Promise(function (success, failure) {
            self.db.collection(FILES_COLLECTION).remove({
                _id: ObjectID(id)
            }, success);
        });
    };
}
