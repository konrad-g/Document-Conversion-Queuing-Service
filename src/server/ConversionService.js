export function ConversionService(queueService, filesService, notificationService, repository) {

    let CONVERSION_PRIORITY = {
        html: 2,
        pdf: 1
    };

    let CONVERSION_TIMEOUTS = {
        html: 10,
        pdf: 100
    };

    let CONVERT_FUNCTION = {
        html: filesService.createHTMLConversion,
        pdf: filesService.createPDFConversion
    };

    let TaskStatus = {
        READY: "ready",
        PROCESSING: "processing",
        QUEUE: "queue"
    };

    this.convertFile = (id, type) => {

        let onStart = () => {
            repository.updateFile(id, TaskStatus.PROCESSING).then(() => {
                notificationService.broadcastStateChanged(id, TaskStatus.PROCESSING);
            }, function (error) {
                console.error(error)
            });
        };

        let onFinish = () => {
            repository.updateFile(id, TaskStatus.READY).then(() => {
                notificationService.broadcastStateChanged(id, TaskStatus.READY);
            })
        };

        let task = () => {
            return new Promise((success, failure) => {
                setTimeout(() => {
                    repository.getFile(id, (err, file) => {

                        if (err) {
                            failure(err);
                            return;
                        }

                        if (!file) {
                            failure("Error while loading file");
                            return;
                        }

                        CONVERT_FUNCTION[type](id, file, (err) => {
                            if (err) {
                                failure(err);
                                return;
                            }
                            success();
                        });

                    });
                }, CONVERSION_TIMEOUTS[type] * 1000);
            });
        }

        queueService.addTask(task, CONVERSION_PRIORITY[type], onStart, onFinish);
    }
}
