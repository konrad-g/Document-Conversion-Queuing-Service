RTCM_app.directive('downloadButton', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            id: '=',
            name: '=',
            type: '='
        },
        link: function (scope, elm) {
            elm.append($compile(
                '<a class="btn btn-primary" download="' + scope.name + '.' + scope.type + '" ' +
                'href="/src/client/converted-files/' + scope.type + '/' + scope.id + '.' + scope.type + '">' +
                scope.type.toUpperCase() +
                '</a>'
            )(scope));
        }
    };
});
