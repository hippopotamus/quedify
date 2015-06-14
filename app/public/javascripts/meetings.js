var app = angular.module('meetingsApp', [])

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{!{'); // remove conflict between ng and hbs
});

app.controller('MeetingController', function($scope, $http){
  $scope.getMeetings = function(){
    $http.get('/meetings').success(function(data){
      $scope.meetingsList = data
    }).error(function(data){
      console.log(data)
    })
  }

  $scope.getMeeting = function(id){
    $http.get('/meetings/'+id).success(function(data){
      $scope.showMeeting = {"meeting": data} // this is so hacky
    }).error(function(data){
      console.log(data)
    })
  }

  $scope.createMeeting = function(){
    console.log($scope.meeting)
    $http.post('/meetings', $scope.meeting).success(function(data){
      console.log("sup")
      $scope.getMeetings()
    }).error(function(data){
      console.log(data)
    })
  }
});

