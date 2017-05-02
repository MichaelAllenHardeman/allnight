(function(globals){
  'use strict';

  if(globals.angular === undefined) {
    throw new Error('AngularJS is required for this module');
  }
  
  var MODULE_NAME = 'allnight-error';
  var application = angular.module(MODULE_NAME, []);

  var errors = [];

  function add(error){
    if(error instanceof Error){
      errors.push( error );
    } else {
      errors.push(new TypeError('expected: Error. actual: '+error.name));
    }
  }

  function remove(index){
    if(index in errors){
      errors.splice(index, 1);
    } else {
      errors.push(new RangeError('index not in errors.'));
    }
  }

  function clear(){
    errors.length = 0;
  }

  function get(){
    return errors.slice(0);
  }

  //////////////////
  // ErrorService //
  //////////////////

  application.factory( 'ErrorService', [
    '$log',
    '$rootScope',
  function(
    $log,
    $rootScope
  ) {

    var $scope = $rootScope.$new();
    $scope.errors = errors;

    $scope.watchCollection('errors', function(newValue, oldValue){
      if(newValue.length > 0){
        chrome.browserAction.setBadgeText({text: '!'});
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
      } else {
        chrome.browserAction.setBadgeText({text: '' });
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
      }
    });

    return {
      add    : add,
      remove : remove,
      clear  : clear,
      get    : get
    }
  }]);
  
  ///////////////////
  // Error Handler //
  ///////////////////
  application.config([ '$provide', function($provide) {
    $provide.decorator('$exceptionHandler', [ '$delegate', function($delegate) {
      return function(exception, cause) {
        $delegate(exception, cause);
        add(exception);
      };
    }]);
  }]);
  
}(this));