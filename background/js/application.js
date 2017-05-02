(function(globals) {
  'use strict';
  
  if(!angular) {
    throw new Error('AngularJS is required for this module');
  }
  
  globals.constants.APPLICATION_NAME = globals.constants.NAME + globals.constants.APPLICATION.BACKGROUND;
  
  var application = angular.module(globals.constants.APPLICATION_NAME, [
    'ngResource',
    'ngStorage',
    'allnight-objects',
    'allnight-twitch'
  ]);
  
  ///////////////////////////
  // Initialize $rootScope //
  ///////////////////////////
  application.run([
    '$rootScope',
    '$log',
    '$localStorage',
    'ObjectService',
    'TwitchService',
  function(
    $rootScope,
    $log,
    $localStorage,
    ObjectService,
    TwitchService
  ) {
    ///////////////
    // Constants //
    ///////////////
    var DEFAULT_TIMER    = new ObjectService.Timer(30, 1, 240);
    var DEFAULT_MESSAGES = [];
    var DEFAULT_PORT     = undefined;

    ////////////////
    // Initialize //
    ////////////////
    globals.scope = $rootScope;
    $rootScope.storage = $localStorage.$default({
      username : ''
    });
    $rootScope.storage.player = new ObjectService.Player();
    $rootScope.messages       = DEFAULT_MESSAGES;
    $rootScope.port           = DEFAULT_PORT;
    
    ////////////////////////////
    // checkAndUpdateUsername //
    ////////////////////////////
    $rootScope.checkAndUpdateUsername = function(username, doNotifyPopup){
      /////////////
      // success //
      /////////////
      function success(user){
        $rootScope.user = user;
        $rootScope.storage.username = user.name;
        if(doNotifyPopup){
          $rootScope.messages.push(
            new ObjectService.Message.Success(
              chrome.i18n.getMessage('optionsNameApplySuccess')
            )
          );
        }
      }
      /////////////
      // failure //
      /////////////
      function failure(reason){
        $log.error(reason.data.message);
        $rootScope.messages.push(
          new ObjectService.Message.Warning(
            reason.data.message
          )
        );
      }
      if(username){
        TwitchService.User.get({ user: username }, success, failure);
      }
    }
    $rootScope.checkAndUpdateUsername($rootScope.storage.username, false);
    
    //////////////////////////
    // processMessagesQueue //
    //////////////////////////
    $rootScope.processMessagesQueue = function(){
      if($rootScope.port && $rootScope.port.name === globals.constants.NAME + globals.constants.APPLICATION.POPUP){
        $rootScope.port.postMessage($rootScope.messages);
        $rootScope.messages = [];
      }
    }
    
    //////////////////////////////////
    // $watchCollection('messages') //
    //////////////////////////////////
    $rootScope.$watchCollection('messages', function(newValue, oldValue){
      $rootScope.processMessagesQueue();
    });
    
    ///////////////
    // onConnect //
    ///////////////
    chrome.runtime.onConnect.addListener(function(port) {
      $rootScope.port = port;
      port.onDisconnect.addListener(function(port){
        $rootScope.port = undefined;
      });
      
      ///////////////
      // onMessage //
      ///////////////
      port.onMessage.addListener(function(event) {
        console.log(event.prototype);
        console.log(event.prototype === globals.objects.Event.prototype);

        if(!(event instanceof globals.objects.Event)){
          $log.warn('Improper message format.');
          $log.warn(event);
        } else {
          switch(event.type){
            /////////////////////////////////////////
            case globals.objects.Event.Type.USERNAME:
            /////////////////////////////////////////
              if(typeof(event.body) === 'string'){
                $rootScope.checkAndUpdateUsername(event.body, true);
              } else {
                $log.warn('Username is not string.');
              }
              break;
            
            /////////////////////////////////////////
            case globals.objects.Event.Type.PREVIOUS:
            /////////////////////////////////////////
              $rootScope.messages.push(
                new globals.objects.Message(
                  globals.objects.Message.Type.DANGER,
                  chrome.i18n.getMessage('errorUnimplementedFeature')
                )
              );
              break;
            
            ///////////////////////////////////////////
            case globals.objects.Event.Type.PLAY_PAUSE:
            ///////////////////////////////////////////
              if($rootScope.storage.player.state === globals.constants.PLAYER_STATE.PAUSED){
                $rootScope.storage.player.state = globals.constants.PLAYER_STATE.PLAYING;
              } else {
                $rootScope.storage.player.state = globals.constants.PLAYER_STATE.PAUSED;
              }
              break;
            
            /////////////////////////////////////
            case globals.objects.Event.Type.NEXT:
            /////////////////////////////////////
              $rootScope.messages.push(
                new globals.objects.Message(
                  globals.objects.Message.Type.DANGER,
                  chrome.i18n.getMessage('errorUnimplementedFeature')
                )
              );
              break;
            
            ///////////////////////////////////////////
            case globals.objects.Event.Type.TRACK_MODE:
            ///////////////////////////////////////////
              if($rootScope.storage.player.trackMode === globals.constants.PLAYER_TRACK_MODE.LINEAR){
                $rootScope.storage.player.trackMode = globals.constants.PLAYER_TRACK_MODE.SHUFFLE;
              } else {
                $rootScope.storage.player.trackMode = globals.constants.PLAYER_TRACK_MODE.LINEAR;
              }
              break;
            
            ////////
            default:
            ////////
              $log.warn('Unknown event type: ' + event.type);
              break;
          }
        }

        if(!$rootScope.$$phase){
          $rootScope.$apply();
        }
      });
      $rootScope.processMessagesQueue();
    });
    
    ////////////////////
    // updatePlaylist //
    ////////////////////
    $rootScope.updatePlaylist = function(){
    
      var topGames = TwitchService.TopGames.get({
        limit : 100,
        offset: 0
      });
      
      var follows;
      if($rootScope.user){
        TwitchService.Follows.get({
          user  : $rootScope.user.name,
          limit : 100,
          offset: 0
        }).$promise.then(function(_follow){
          follows = _follow;
        }, function(reason){
          $log.error(reason.data.message);
        });
      }
    };
    
  }]);
  
  /////////////////////////////////
  // Configure link sanitization //
  /////////////////////////////////
  application.config([ '$compileProvider', function( $compileProvider ) {
    $compileProvider.aHrefSanitizationWhitelist (/^\s*(https?|ftp|mailto|file|tel|chrome-extension):/);
  }]);
  
}(this));
  