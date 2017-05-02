(function(globals) {
  'use strict';
  
  if(!angular) {
    throw new Error('AngularJS is required for this module');
  }
  
  var application = angular.module(globals.constants.APPLICATION_NAME);
  
  ///////////////////////
  // OptionsController //
  ///////////////////////
  application.controller( 'OptionsController', [ 
    '$scope',
    '$log',
    '$location',
    'TwitchService',
  function (
    $scope,
    $log,
    $location,
    TwitchService
  ) {
    $scope.username = $scope.storage.username;
    
    $scope.saveOptions = function() {
      if ($scope.username) {
        $scope.port.postMessage({
          event: globals.constants.EVENT.USERNAME,
          body : $scope.username
        });
      } else {
        $scope.messages.push(chrome.i18n.getMessage('optionsApplyFailureUsername'));
      }
    }
    
    $scope.findGame = function(value){
      return TwitchService.FindGame.get({
        game: value
      }).$promise.then(function(result){
        var games = [];
        angular.forEach(result.games, function(item){
          games.push(item.name);
        });
        return games;
      });
    }
  }]);
  
  //////////////////////
  // DonateController //
  //////////////////////
  application.controller( 'DonateController', [
    '$scope',
    '$rootScope',
    '$location',
  function (
    $scope,
    $rootScope,
    $location
  ) {
    
  }]);
  
  /////////////////////
  // ErrorController //
  /////////////////////
  application.controller( 'ErrorController', [
    '$scope',
    '$rootScope',
    '$location',
  function (
    $scope,
    $rootScope,
    $location
  ) {
    
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
  
}(this));
