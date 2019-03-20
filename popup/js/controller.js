(function(globals) {
  'use strict';
  
  if (!globals.angular) {
    throw new Error('AngularJS is required for this module');
  }
  
  var application = globals.angular.module(globals.constants.APPLICATION_NAME);
  
  //////////////////////
  // PlayerController //
  //////////////////////
  application.controller( 'PlayerController', [
    '$scope',
    '$log',
    '$location',
    '$localStorage',
    'TwitchService',
    'ObjectService',
  function (
    $scope,
    $log,
    $location,
    $localStorage,
    TwitchService,
    ObjectService
  ) {
    
    var DEFAULT_STATE      = globals.constants.PLAYER_STATE.PAUSED;
    var DEFAULT_TRACK_MODE = globals.constants.PLAYER_TRACK_MODE.LINEAR;
    var DEFAULT_TIMER      = { minutes: 30, floor: 1, ceil: 240 };
    var DEFAULT_PLAYLIST   = { active : -1, list : [] };
    
    $scope.storage = $localStorage.$default({
      username : '',
      player   : {
        state     : DEFAULT_STATE,
        trackMode : DEFAULT_TRACK_MODE,
        timer     : DEFAULT_TIMER,
        playlist  : DEFAULT_PLAYLIST
      }
    });
    
    if(!$scope.storage.username) {
      $location.path(application.constants.ROUTES.OPTIONS);
    }
    
    //////////////
    // previous //
    //////////////
    $scope.previous = function() {
      $scope.port.postMessage(
        new ObjectService.Event.Previous ()
      );
    };
    
    ///////////////
    // playPause //
    ///////////////
    $scope.playPause = function() {
      $scope.port.postMessage(
        new ObjectService.Event.PlayPause ()
      );
    };
    
    //////////
    // next //
    //////////
    $scope.next = function() {
      $scope.port.postMessage(
        new globals.objects.Event(
          new ObjectService.Event.Next ()
        )
      );
    };
    
    ///////////////
    // trackMode //
    ///////////////
    $scope.trackMode = function() {
      $scope.port.postMessage(
        new ObjectService.Event.TrackMode ()
      );
    };
  }]);
  
  ///////////////////////
  // OptionsController //
  ///////////////////////
  application.controller( 'OptionsController', [ 
    '$scope',
    '$log',
    '$location',
    '$localStorage',
    'ObjectService',
    'TwitchService',
  function (
    $scope,
    $log,
    $location,
    $localStorage,
    ObjectService,
    TwitchService
  ) {
    $scope.storage  = $localStorage.$default({
      username : '',
    });
    $scope.username = $scope.storage.username;
    
    $scope.saveOptions = function() {
      $scope.messages.length = 0;
      if($scope.username){
        $scope.port.postMessage(
          new ObjectService.Event.ChangeUsername ($scope.username)
        );
      } else {
        $scope.messages.push(
          new ObjectService.Message.Warning (
            globals.chrome.i18n.getMessage(
              'optionsApplyFailureUsername'
            )
          )
        );
      }
    }
  }]);
  
  /////////////////////
  // AboutController //
  /////////////////////
  application.controller( 'AboutController', [
    '$scope',
  function(
    $scope
  ) {
    
  }]);

  /////////////////////
  // AlertController //
  /////////////////////
    application.controller( 'MessagesController', [
      '$scope',
    function(
      $scope
    ) {
      $scope.messages = [];

      $scope.closeMessage = function(index) {
        $scope.messages.splice(index, 1);
      };
    }]);
  
}(this));
