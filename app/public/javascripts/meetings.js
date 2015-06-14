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
    $scope.showNewForm = true
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
      console.log("error")
    })
  }

  $scope.getMeeting = function(id){
    $http.get('/meetings/'+id).success(function(meeting){
      $scope.showMeeting = true
      meeting.from = new Date(meeting.from).toLocaleString();
      meeting.to = new Date(meeting.to).toLocaleString();
      meeting.participants = meeting.participants.join(', ');
      $scope.showMeeting = {"meeting": meeting}; // this is so hacky
    }).error(function(data){
      console.log("error");
    });
  };

  $scope.createMeeting = function(){
    $http.post('/meetings', $scope.newMeeting).success(function(data){
      $scope.getMeetings()
    }).error(function(data){
      console.log("error")
    })
  }

  $scope.editMeeting = function(id){
    $http.get('/meetings/'+id+'/edit').success(function(data){
      $scope.showNewForm = false
      $scope.showEditForm = true
      $scope.editMeeting = data
    }).error(function(data){
      console.log("error")
    })
  }

  $scope.updateMeeting = function(){
    $http.put('/meetings/'+$scope.editMeeting._id, $scope.editMeeting).success(function(data){
      $scope.showNewForm = true
      $scope.showEditForm = false
      $scope.getMeetings()
      $scope.getMeeting($scope.editMeeting._id)
    }).error(function(data){
      console.log("error")
    })
  }

  $scope.deleteMeeting = function(id){
    $http.delete('/meetings/'+id).success(function(data){
      $scope.showMeeting = false
      $scope.getMeetings()
    }).error(function(data){
      console.log("error")
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
      console.log("error")
    })
  }
});

