(function(globals) {
  'use strict';
  
  if(!angular) {
    throw new Error('AngularJS is required for this module');
  }
  
  globals.constants.APPLICATION_NAME = globals.constants.NAME + 'Background';
  var application = angular.module(globals.constants.APPLICATION_NAME);
  
}(this));
