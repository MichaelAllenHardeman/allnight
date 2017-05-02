(function(globals) {
  'use strict';
  
  if(!angular) {
    throw new Error('AngularJS is required for this module');
  }
  
  var application = angular.module(globals.constants.APPLICATION_NAME);
  
  //////////////////////
  // PlayerController //
  //////////////////////
  application.controller( 'PlayerController', [
    '$scope',
    '$log',
    '$location',
    '$localStorage',
    'TwitchService',
  function (
    $scope,
    $log,
    $location,
    $localStorage,
    TwitchService
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
        new globals.objects.Event(
          globals.objects.Event.Type.PREVIOUS,
          null
        )
      );
    };
    
    ///////////////
    // playPause //
    ///////////////
    $scope.playPause = function() {
      $scope.port.postMessage(
        new globals.objects.Event(
          globals.objects.Event.Type.PLAY_PAUSE,
          null
        )
      );
    };
    
    //////////
    // next //
    //////////
    $scope.next = function() {
      $scope.port.postMessage(
        new globals.objects.Event(
          globals.objects.Event.Type.NEXT,
          null
        )
      );
    };
    
    ///////////////
    // trackMode //
    ///////////////
    $scope.trackMode = function() {
      $scope.port.postMessage(
        new globals.objects.Event(
          globals.objects.Event.Type.TRACK_MODE,
          null
        )
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
    'TwitchService',
  function (
    $scope,
    $log,
    $location,
    $localStorage,
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
          new globals.objects.Event(
            globals.objects.Event.Type.USERNAME,
            $scope.username
          )
        );
      } else {
        $scope.messages.push(
          new globals.objects.Message(
            globals.objects.Message.Type.WARNING,
            chrome.i18n.getMessage('optionsApplyFailureUsername')
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
