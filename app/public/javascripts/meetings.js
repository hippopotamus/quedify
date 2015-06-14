var app = angular.module('meetingsApp', [])

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{!{'); // remove conflict between ng and hbs
});

app.controller('MeetingController', function($scope, $http){
  $scope.initApp = function(){
    $('#newMeetingFrom').datetimepicker();
    $('#newMeetingTo').datetimepicker();
    $('#editMeetingFrom').datetimepicker();
    $('#editMeetingTo').datetimepicker();
    $scope.getMeetings()
  }

  $scope.getMeetings = function(){
    $http.get('/meetings').success(function(data){
      data.map(function(meeting){
        meeting.from = new Date(meeting.from).toLocaleString()
        meeting.to = new Date(meeting.to).toLocaleString()
        return meeting
      })
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
    $http.post('/meetings', $scope.newMeeting).success(function(data){
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
      $scope.getMeeting($scope.editMeeting._id)
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

  $scope.$watch('titleSearch.title', function(text){
    if(text === undefined || text.length === 0){ return }
    $http.get('/meetings/search/'+text).success(function(data){
      $('#titleSearch').autocomplete({
        source: data.map(function(meeting){ return meeting.title })
      })
    })
  })

  $scope.searchTitle = function(uri){
    if (uri === undefined || uri.length === 0){ return $scope.getMeetings() }
    $http.get('/meetings/search/'+uri).success(function(data){
      if (data.length === 0){ return }
      else if (data.length > 1){
        $scope.meetingsList = data
      }
      else{
        $scope.showMeeting = {"meeting": data[0]} // this is so hacky
      }
    }).error(function(data){
      console.log(data)
    })
  }
});

