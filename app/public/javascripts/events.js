var jQuery = $.noConflict();

var app = angular.module('eventsApp', [])

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{!{'); // remove conflict between ng and hbs
});

app.controller('EventController', function($scope, $http){
  $scope.initApp = function(){
    jQuery('#newEventFrom').datetimepicker();
    jQuery('#newEventTo').datetimepicker();
    jQuery('#editEventFrom').datetimepicker();
    jQuery('#editEventTo').datetimepicker();
    $scope.showForm = true
    $scope.getEvents()
  }

  $scope.getEvents = function(){
    $http.get('/events').success(function(data){
      data.map(function(event){
        event.from = new Date(event.from).toLocaleString()
        event.to = new Date(event.to).toLocaleString()
        return event
      })
      $scope.eventsList = data
    }).error(function(data){
      console.log("error")
    })
  }

  $scope.getEvent = function(id){
    $http.get('/events/'+id).success(function(event){
      $scope.showEvent = true
      event.from = new Date(event.from).toLocaleString();
      event.to = new Date(event.to).toLocaleString();
      event.participants = event.participants.join(', ');
      $scope.showEvent = {"event": event}; // this is so hacky
    }).error(function(data){
      console.log("error");
    });
  };

  $scope.createEvent = function(){
    $scope.newEventModel.from = jQuery('#newEventFrom').val()
    $scope.newEventModel.to = jQuery('#newEventTo').val()

    $http.post('/events', $scope.newEventModel).success(function(data){
      $scope.getEvents()
    }).error(function(data){
      console.log("error")
    })
  }

  $scope.editEvent = function(id){
    $http.get('/events/'+id+'/edit').success(function(data){
      $scope.showForm = !$scope.showForm
      $scope.editEventModel = data
    }).error(function(data){
      console.log("error")
    })
  }

  $scope.cancelEdit = function(){
    $scope.showForm = !$scope.showForm
  }

  $scope.updateEvent = function(){
    $scope.editEventModel.from = jQuery('#editEventFrom').val()
    $scope.editEventModel.to = jQuery('#editEventTo').val()

    $http.put('/events/'+$scope.editEventModel._id, $scope.editEventModel).success(function(data){
      $scope.showForm = !$scope.showForm
      $scope.getEvents()
      $scope.getEvent($scope.editEventModel._id)
    }).error(function(data){
      console.log("error")
    })
  }

  $scope.deleteEvent = function(id){
    $http.delete('/events/'+id).success(function(data){
      $scope.showEvent = false
      $scope.getEvents()
    }).error(function(data){
      console.log("error")
    })
  }

  $scope.deleteAll = function(){
    var makeSure = prompt("Are you sure you want to delete everything? Type yes to confirm.")
    if (makeSure === "yes"){
      $http.delete('/events').success(function(data){
        $scope.getEvents()
      }).error(function(data){
        console.log("error")
      })
    }
  }

  $scope.$watch('titleSearch.title', function(text){
    if(text === undefined || text.length === 0){ return }
    $http.get('/events/search/'+text).success(function(data){
      $('#titleSearch').autocomplete({
        source: data.map(function(event){ return event.title })
      })
    })
  })

  $scope.searchTitle = function(uri){
    if (uri === undefined || uri.length === 0){ return $scope.getEvents() }
    $http.get('/events/search/'+uri).success(function(data){
      if (data.length === 0){ return }
      else if (data.length > 1){
        $scope.eventsList = data
      }
      else{
        $scope.showEvent = {"event": data[0]} // this is so hacky
      }
    }).error(function(data){
      console.log("error")
    })
  }
});

