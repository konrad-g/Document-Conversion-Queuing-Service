import {Router} from "./src/server/Router";
import {NotificationService} from "./src/server/NotificationService.js";
import {QueueService} from "./src/server/QueueService";
import {FilesService} from "./src/server/FilesService.js";
import {ConversionService} from "./src/server/ConversionService.js";
import {Repository} from "./src/server/Repository.js";

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Query Service listening on port '+ port +'!')
});
app.use(express.static(__dirname));

let CAPACITY = 3;
let queueService = new QueueService(CAPACITY);
let filesService = new FilesService();
let notificationService = new NotificationService();
let repository = new Repository();
let conversionService = new ConversionService(queueService, filesService, notificationService, repository);
var router = new Router(app, notificationService, conversionService, filesService, repository);

router.start();
notificationService.start(app);
