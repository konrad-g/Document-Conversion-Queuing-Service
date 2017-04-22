export function FilesService() {

    let fs = require('fs');
    let mkdirp = require('mkdirp');
    let pdf = require('html-pdf');
    let filesDir = "./src/client/converted-files";

    let HTML_TYPE = "html";
    let PDF_TYPE = "pdf";
    let PDF_FORMAT = "Letter";

    this.createHTMLConversion = (id, file, callback) => {
        let self = this;
        mkdirp(filesDir + '/' + HTML_TYPE, function () {
            fs.writeFile(self.getFilePath(id, HTML_TYPE), file.content, {}, callback);
        });
    }

    this.createPDFConversion = (id, file, callback) => {
        let self = this;
        mkdirp(filesDir + '/' + HTML_TYPE, function () {
            pdf.create(file.content, {format: PDF_FORMAT})
                .toFile(self.getFilePath(id, PDF_TYPE),
                    callback);
        });
    }

    this.deleteConversions = (id) => {
        let self = this;
        return Promise.all([
            new Promise(function (success, failure) {
                self.deleteConversion(id, HTML_TYPE, success, failure);
            }),
            new Promise(function (success, failure) {
                self.deleteConversion(id, PDF_TYPE, success, failure);
            })
        ]);
    }

    this.deleteConversion = (id, type, success, failure) => {
        let self = this;
        fs.stat(self.getFilePath(id, type), function (err) {
            if (err) {
                failure();
            } else {
                fs.unlink(self.getFilePath(id, type), success);
            }
        });
    }

    this.getFilePath = (id, type) => {
        return filesDir + '/' + type + '/' + id + '.' + type;
    }
}
