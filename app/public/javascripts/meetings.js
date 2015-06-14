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
    $http.post('/meetings', $scope.meeting).success(function(data){
      console.log("sup")
      $scope.getMeetings()
    }).error(function(data){
      console.log(data)
    })
  }

  $scope.editMeeting = function(id){
    $http.get('/meetings/'+id+'/edit').success(function(data){
      $scope.showEditForm = true
      $scope.editMeeting = data
    }).error(function(data){
      console.log(data)
    })
  }

  $scope.updateMeeting = function(){
    $http.put('/meetings/'+$scope.editMeeting._id, $scope.editMeeting).success(function(data){
      $scope.getMeetings()
    }).error(function(data){
      console.log(data)
    })
  }

  $scope.deleteMeeting = function(id){
    $http.delete('/meetings/'+id).success(function(data){
      $scope.getMeetings()
    }).error(function(data){
      console.log(data)
    })
  }
});

