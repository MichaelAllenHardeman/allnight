(function(globals) {
  'use strict';
  
  if(!angular) {
    throw new Error('AngularJS is required for this module');
  }
  
  var application = angular.module(globals.constants.APPLICATION_NAME);

}(this));