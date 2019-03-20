(function (globals) {
  'use strict';

  if (!globals.angular) {
    throw new Error ('AngularJS is required for this module');
  }

  var application = globals.angular.module ('allnight-objects', []);

  application.service ('ObjectService', [function () {

    var Event = {
      'ChangeUsername': function (username) {
        this.message = username;
      },
      'Previous': function () {
        this.message = null;
      },
      'PlayPause': function () {
        this.message = null;
      },
      'Next': function () {
        this.message = null;
      },
      'ChangeTrackMode': function () {
        this.message = null;
      },
      'InvlidUsername': function (message) {
        this.message = message;
      },
      'isEvent': function (item) {
        if (typeof (item) !== 'object')       { return false; }
        if (!item.hasOwnProperty ('message')) { return false; }
        return true;
      }
    };

    var Message = {
      'Success': function (text) {
        this.type = 'alert alert-success';
        this.text = text;
        this.icon = 'glyphicon glyphicon-ok-sign';
      },
      'Info': function (text) {
        this.type = 'alert alert-info';
        this.text = text;
        this.icon = 'glyphicon glyphicon-info-sign';
      },
      'Warning': function (text) {
        this.type = 'alert alert-warning';
        this.text = text;
        this.icon = 'glyphicon glyphicon-exclamation-sign';
      },
      'Danger': function (text) {
        this.type = 'alert alert-danger';
        this.text = text;
        this.icon = 'glyphicon glyphicon-remove-sign';
      },
      'isMessage': function (item) {
        if (typeof (item) !== 'object')    { return false; }
        if (!item.hasOwnProperty ('type')) { return false; }
        if (!item.hasOwnProperty ('text')) { return false; }
        if (!item.hasOwnProperty ('icon')) { return false; }
        return true;
      }
    };

    var Timer = function(minutes, floor, ceil) {
      this.minutes = (typeof(minutes) == 'number') ? minutes : 0;
      this.floor   = (typeof(floor)   == 'number') ? floor   : 0;
      this.ceil    = (typeof(ceil)    == 'number') ? ceil    : 0;
    };

    var Player = (function() {

      var PlayList = (function() {

        var list = [];
        var order = [];

        function shuffle(item) {
          for (var j, x, i = item.length; i; j = Math.floor(Math.random() * i), x = item[--i], item[i] = item[j], item[j] = x);
          return item;
        }

        function getKeys(item) {
          var keys = [];
          for (var key in item) {
            if (key === 'length' || !item.hasOwnProperty(key)) continue;
            keys.push(key);
          }
          return keys;
        }

        function generateOrder(item, doShuffle) {
          var keys = getKeys(item);
          if (doShuffle) {
            return shuffle(keys);
          } else {
            return keys;
          }
        }

        function generateList() { // TODO: args userSnapShot, generalSnapShot
          var output = [];
          return output;
        }

        return function(userSnapShot, generalSnapShot, doShuffle) {

          list = generateList(userSnapShot, generalSnapShot);
          order = generateOrder(list, doShuffle);

          this.getList = function() {
            return list;
          };
          this.getOrder = function() {
            return order;
          };
          this.getCurrent = function() {
            return list[order[0]];
          };
          this.next = function() {
            var item = order.shift();
            order.push(item);
          };
          this.previous = function() {
            var item = order.pop();
            order.unshift(item);
          };
          this.shuffle = function(doShuffle) {
            order = generateOrder(list, doShuffle);
          };
        };
      }());
      PlayList.isPlayList = function(item) {
        if (typeof(item) !== 'object')          { return false; }
        if (!item.hasOwnProperty('getList'))    { return false; }
        if (!item.hasOwnProperty('getOrder'))   { return false; }
        if (!item.hasOwnProperty('getCurrent')) { return false; }
        if (!item.hasOwnProperty('next'))       { return false; }
        if (!item.hasOwnProperty('previous'))   { return false; }
        if (!item.hasOwnProperty('shuffle'))    { return false; }
        return true;
      };

      var playing = false;
      var shuffle = false;
      var playList = new PlayList();

      return function() {
        this.isPlaying = function() {
          return playing;
        };
        this.isShuffling = function() {
          return shuffle;
        };
        this.previous = function() {
          if (playing) {
            /*
            if(shuffle){
              
            } else {
              console.log('previous');
            }
            */
          }
        };
        this.play = function() {};
        this.next = function() {};
        this.shuffle = function() {
          shuffle = !shuffle;
        };
        this.timer = function() { // TODO: arg newValue

        };
        this.getPlaylist = function() {
          var list = playList.getList();
          var order = playList.getOrder();
          var output = [];
          for (var i = 0; i < order.length; i++) {
            output.push(list[order[i]]);
          }
          return output;
        };
      };
    }());
    Player.isPlayer = function(item) {
      if (typeof(item) !== 'object')           { return false; }
      if (!item.hasOwnProperty('isPlaying'))   { return false; }
      if (!item.hasOwnProperty('isShuffling')) { return false; }
      if (!item.hasOwnProperty('previous'))    { return false; }
      if (!item.hasOwnProperty('play'))        { return false; }
      if (!item.hasOwnProperty('next'))        { return false; }
      if (!item.hasOwnProperty('shuffle'))     { return false; }
      if (!item.hasOwnProperty('timer'))       { return false; }
      if (!item.hasOwnProperty('getPlaylist')) { return false; }
      return true;
    };

    return {
      'Event'  : Event,
      'Message': Message,
      'Timer'  : Timer,
      'Player' : Player
    };
  }]);
}(this));