(function(globals) {
  'use strict';
  
  if (!globals.angular) {
    throw new Error('AngularJS is required for this module');
  }
  
  globals.constants.APPLICATION_NAME = globals.constants.NAME + 'Background';
  globals.angular.module(globals.constants.APPLICATION_NAME);
  
}(this));
