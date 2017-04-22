export function Router(initApp, notificationService, conversionService, filesService, repository) {

    let app = initApp;
    let path = require('path');
    let bodyParser = require('body-parser');
    let filesEndPoint = 'files';
    let webappFolderName = "../client";

    this.start = () => {

        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());

        app.get('/', function (req, res) {
            res.sendFile(path.resolve(__dirname + '/' + webappFolderName + '/index.html'));
        });

        app.get('/' + filesEndPoint, function (req, res) {
            repository.getAllFiles(res);
        });

        app.post('/' + filesEndPoint, function (req, res) {
            repository.createFile(req.body.name, req.body.content, req.body.type, res)
                .then(function (file) {
                    notificationService.broadcastNewConversion(file);
                    conversionService.convertFile(file._id, file.type);
                    res.json({"message": "Successfully created " + result});
                }).catch(function (error) {
                res.json({"error": "Error while creating file: " + error});
            });
        });

        app.delete('/' + filesEndPoint + '/:id', function (req, res) {
            Promise.all([
                repository.deleteFile(req.params.id, res),
                filesService.deleteConversions(req.params.id)
            ]).then(function () {
                res.json({"message": "Successfully deleted by id: " + req.params.id});
            }).catch(function (e) {
                res.json({"error": "Error in deleteFile: " + e});
            });
        });

        app.put('/' + filesEndPoint + '/:id' + '/convert', function (req, res) {
            conversionService.convertFile(req.params.id, req.body.type);
            res.json({
                "message": "Successfully queued conversion of " + req.params.id
                + " to " + req.body.type
            });
        });
    }
}
