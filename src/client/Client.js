var RTCM_app = angular.module('RTCM_app', ['ngMaterial', 'ngResource', 'ngRoute', 'md.data.table']);

RTCM_app.config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.theme('default').primaryPalette('blue');
}]);

RTCM_app.controller('MainCtrl', ['$scope', '$resource',
    function ($scope, $resource) {

        var FILES_ENDPOINT = '/files';
        var SOCKET_EVENT_CREATED = "created";
        var SOCKET_EVENT_STATE_CHANGED = "state_changed";
        var SOCKET_ENDPOINT = "http://localhost:8081";

        var TaskType = {
            PDF: "pdf",
            HTML: "html"
        };

        var TaskStatus = {
            READY: "ready",
            PROCESSING: "processing",
            QUEUE: "queue"
        };

        var socket = io.connect(SOCKET_ENDPOINT);
        var File = $resource(FILES_ENDPOINT + '/:id', {id: '@_id'});

        refreshFiles();

        function refreshFiles() {
            $scope.files = File.query();
        }

        $scope.newPdfConversion = function (ev) {

            var pdfCount = getTypeCount(TaskType.PDF) + 1;

            var newFile = new File();
            newFile.name = "PDF #" + pdfCount;
            newFile.type = TaskType.PDF;
            newFile.content = "This is PDF number " + pdfCount;
            newFile.$save();
        };

        $scope.newHtmlConversion = function (ev) {

            var htmlCount = getTypeCount(TaskType.HTML) + 1;

            var newFile = new File();
            newFile.name = "HTML #" + htmlCount;
            newFile.type = TaskType.HTML;
            newFile.content = "<p>This is HTML number " + htmlCount + "</p>";
            newFile.$save();
        };

        $scope.deleteFile = function (file) {
            file.$delete().then(function () {
                var index = $scope.files.indexOf(file);
                if (index > -1) {
                    $scope.files.splice(index, 1);
                }
            });
        };

        $scope.limitOptions = [10, 30, 50, 100];
        $scope.query = {
            order: '-createdDate',
            limit: 30,
            page: 1
        };

        function getTypeCount(type) {
            var count = 0;
            $scope.files.find(function (file) {
                if (file.type == type) count++;
                return false;
            });

            return count;
        }

        // WebSockets
        socket.on(SOCKET_EVENT_CREATED, function (file) {

            var newFile = new File();
            for (var property in file) {
                newFile[property] = file[property];
            }

            $scope.files.push(newFile);
            $scope.$apply();
        });

        socket.on(SOCKET_EVENT_STATE_CHANGED, function (id, status) {

            var file = $scope.files.find(function (file) {
                return file._id == id;
            });

            if (file) {
                file.status = status;
                $scope.$apply();

                if (status == TaskStatus.READY) {
                    toastr.success("Request '" + file.name + "' processed")
                } else if (status == TaskStatus.PROCESSING) {
                    toastr.info("Request '" + file.name + "' started processing")
                } else if (status == TaskStatus.QUEUE) {
                    toastr.info("Request '" + file.name + "' added to a queue")
                }
            }
        });
    }]);
