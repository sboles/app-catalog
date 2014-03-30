var app = angular.module('frolicApp', []);
app.controller('frolicController', function($scope) {
    $scope.selectProjectOid = 1;
    $scope.freeProjectOid = 'x';
    $scope.selectWorkspaceOid = 1;
    $scope.freeWorkspaceOid = 'x';
    
    $scope.workspaceOid = 1;
    $scope.projectOid = 1;
    $scope.scopeUp = false;
    $scope.scopeDown = true;
    
    $scope.wsapiMode = 'proxied';
    $scope.lbapiMode = 'proxied';
});
app.controller('consoleController', function($scope) {
    $scope.messages = [];
    $scope.messageFilter = null;
    $scope.log = function(arg1, arg2) {
        console.log(arg1,arg2);
        $scope.messages.unshift({when:new Date(), text:arg1, object:JSON.stringify(arg2,null,2)});
    };
});
