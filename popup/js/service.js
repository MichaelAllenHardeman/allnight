(function(globals) {
  'use strict';
  
  if (!globals.angular) {
    throw new Error('AngularJS is required for this module');
  }
  
  globals.angular.module(globals.constants.APPLICATION_NAME);

}(this));