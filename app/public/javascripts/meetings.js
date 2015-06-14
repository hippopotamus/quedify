var app = angular.module('meetingsApp', [])

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{!{'); // remove conflict between ng and hbs
});

app.controller('MeetingController', function($scope, $http){
  $scope.getMeetings = function(){
    $http.get('/meetings').success(function(data){
      $scope.meetingsList = data.meetings
    }).error(function(data){
      console.log(data)
    })
  }
});

