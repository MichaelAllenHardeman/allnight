(function(globals) {
  'use strict';
  
  if(!angular) {
    throw new Error('AngularJS is required for this module');
  }
  
  globals.constants.APPLICATION_NAME = globals.constants.NAME + 'Options';
  
  var application = angular.module(globals.constants.APPLICATION_NAME, ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngStorage', 'ngTwitch', 'ngError']);
  
  ///////////////
  // Constants //
  ///////////////
  application.constants = {
    'ROUTES' : {
      'OPTIONS' : '/',
      'ABOUT'   : '/about',
      'DONATE'  : '/donate',
      'ERROR'   : '/error'
    }
  };
  
  ///////////////////////////
  // Initialize $rootScope //
  ///////////////////////////
  application.run([
    '$rootScope',
    '$localStorage',
  function(
    $rootScope,
    $localStorage
  ) {
    globals.scope = $rootScope;
    $rootScope.storage = $localStorage.$default({
      username    : '',
      defaultGame : ''
    });
    $rootScope.translate = chrome.i18n.getMessage;
    $rootScope.messages  = [];
    
    $rootScope.port = chrome.runtime.connect({name: globals.constants.APPLICATION_NAME});
    $rootScope.port.onMessage.addListener(function(messages) {
      $rootScope.messages = $rootScope.messages.concat(messages);
      if(!$rootScope.$$phase){
        $rootScope.$apply();
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
    
    $routeProvider.when( application.constants.ROUTES.OPTIONS, {
      templateUrl : 'views/options.html',
      controller  : 'OptionsController'
    });
    
    $routeProvider.when( application.constants.ROUTES.ABOUT, {
      templateUrl : 'views/about.html',
      controller  : 'AboutController'
    });
    
    $routeProvider.when( application.constants.ROUTES.DONATE, {
      templateUrl : 'views/donate.html',
      controller  : 'DonateController'
    });
    
    $routeProvider.when( application.constants.ROUTES.ERROR, {
      templateUrl : 'views/error.html',
      controller  : 'ErrorController'
    });
    
    $routeProvider.otherwise({
      redirectTo : application.constants.ROUTES.OPTIONS
    });
  }]);
  
  //////////////////////////////////
  // Configure $http Interceptors //
  //////////////////////////////////
  application.config([ '$provide', '$httpProvider', function($provide, $httpProvider) {
    $provide.factory('HttpInterceptor', ['$q', function ($q) {
      var publicApi = {
        'request'       : undefined,
        'requestError'  : undefined,
        'response'      : undefined,
        'responseError' : undefined
      };
      
      function requestSuccess (config) {
        // TODO 
        return config || $q.when(config);
      }
 
      function requestError(rejection) {
        // TODO
        // if (canRecover(rejection)) {
        //   return responseOrNewPromise
        // }
        return $q.reject(rejection);
      }

      function responseSuccess(response) {
        // TODO
        return response || $q.when(response);
      }

      function responseError(rejection) {
        // TODO
        // if (canRecover(rejection)) {
        //   return responseOrNewPromise
        // }
        return $q.reject(rejection);
      }
      
      publicApi.request       = requestSuccess;
      publicApi.requestError  = requestError;
      publicApi.response      = responseSuccess;
      publicApi.responseError = responseError;
      
      return publicApi;
    }]);
    
    $httpProvider.interceptors.push('HttpInterceptor');
  }]);
  
  /////////////////////////////////
  // Configure link sanitization //
  /////////////////////////////////
  application.config([ '$compileProvider', function( $compileProvider ) {
    $compileProvider.aHrefSanitizationWhitelist (/^\s*(https?|ftp|mailto|file|tel|chrome-extension):/);
  }]);
  
}(this));
  