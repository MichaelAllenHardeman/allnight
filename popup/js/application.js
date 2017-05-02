(function(globals) {
  'use strict';
  
  if(!angular) {
    throw new Error('AngularJS is required for this module');
  }
  
  globals.constants.APPLICATION_NAME = globals.constants.NAME + globals.constants.APPLICATION.POPUP;
  
  var application = angular.module(
    globals.constants.APPLICATION_NAME,
  [
    'ngRoute',
    'ngResource',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'ui.bootstrap.transition',
    'rzModule',
    'ngStorage',
    'allnight-twitch',
    'allnight-error'
    'allnight-alert'
  ]);
  
  ///////////////
  // Constants //
  ///////////////
  application.constants = {
    'ROUTES' : {
      'PLAYER'  : '/',
      'OPTIONS' : '/options',
      'ABOUT'   : '/about'
    }
  };
  
  ///////////////////////////
  // Initialize $rootScope //
  ///////////////////////////
  application.run([
    '$rootScope',
    '$localStorage',
    '$log',
  function(
    $rootScope,
    $localStorage,
    $log
  ) {
    var DEFAULT_STATE      = globals.constants.PLAYER_STATE.PAUSED;
    var DEFAULT_TRACK_MODE = globals.constants.PLAYER_TRACK_MODE.LINEAR;
    var DEFAULT_TIMER      = { minutes: 30, floor: 1, ceil: 240 };
    var DEFAULT_PLAYLIST   = { active : -1, list : [] };
    
    globals.scope = $rootScope;
    $rootScope.storage = $localStorage.$default({
      username : '',
      player   : {
        state     : DEFAULT_STATE,
        trackMode : DEFAULT_TRACK_MODE,
        timer     : DEFAULT_TIMER,
        playlist  : DEFAULT_PLAYLIST
      }
    });
    $rootScope.translate = chrome.i18n.getMessage;
    $rootScope.openOptions = function(){
      chrome.tabs.create({
        url:chrome.extension.getURL('options/index.html')
      });
    }
    
    $rootScope.messages = [];
    
    $rootScope.port = chrome.runtime.connect({name: globals.constants.APPLICATION_NAME});
    $rootScope.port.onMessage.addListener(function(messages) {
      if(!Array.isArray(messages)){
        $log.warn('Messages is not an array.');
      } else {
        for(var i=0; i<messages.length; i++){
          if(!(messages[i] instanceof globals.objects.Message)){
            var message = messages.splice(i,1);
            i--;
            $log.warn('Message improperly formatted: ');
            $log.warn(message[0]);
          }
        }
        $rootScope.messages = $rootScope.messages.concat(messages);
        if(!$rootScope.$$phase){
          $rootScope.$apply();
        }
      }
    });
    
    $rootScope.$on('$routeChangeStart', function(next, current) {
      $rootScope.messages.length = 0;
    });
    
  }]);
  
  //////////////////////
  // Configure Routes //
  //////////////////////
  application.config([ '$routeProvider', function($routeProvider) {
    $routeProvider.when( application.constants.ROUTES.PLAYER, {
      templateUrl : 'views/player/player.html',
      controller  : 'PlayerController'
    });
    
    $routeProvider.when( application.constants.ROUTES.OPTIONS, {
      templateUrl : 'views/options/options.html',
      controller  : 'OptionsController'
    });
    
    $routeProvider.when( application.constants.ROUTES.ABOUT, {
      templateUrl : 'views/about/about.html',
      controller  : 'AboutController'
    });
    
    $routeProvider.otherwise({
      redirectTo : application.constants.ROUTES.PLAYER
    });
  }]);
  
  /////////////////////////////////
  // Configure link sanitization //
  /////////////////////////////////
  application.config([ '$compileProvider', function( $compileProvider ) {
    $compileProvider.aHrefSanitizationWhitelist (/^\s*(https?|ftp|mailto|file|tel|chrome-extension):/);
  }]);
  
}(this));
  