(function (globals) {
  'use strict';
  
  if (!globals.angular) {
    throw new Error ('AngularJS is required for this module');
  }
  
  var application = globals.angular.module ('allnight-twitch', []);
  
  application.factory ('TwitchService', ['$log', '$resource', function ($log, $resource) {
    var TWITCH_URL = 'https://api.twitch.tv/kraken/';

    var publicApi = {
      'User'           : $resource (TWITCH_URL + 'users/:user',                  { user: '@user' }),
      'Follows'        : $resource (TWITCH_URL + 'users/:user/follows/channels', { user: '@user' }),
      'Channel'        : $resource (TWITCH_URL + 'channels/:channel',            { channel: '@channel' }),
      'Streams'        : $resource (TWITCH_URL + 'streams/:channel',             { channel: '@channel' }),
      'TopStreams'     : $resource (TWITCH_URL + 'search/streams',               { q: '@game' }),
      'TopGames'       : $resource (TWITCH_URL + 'games/top'),
      'FindGame'       : $resource (TWITCH_URL + 'search/games', { query: '@query', type: 'suggest' }),
      'GeneralSnapShot': undefined,
      'UserSnapShot'   : undefined,
      'test'           : undefined
    };
   
    publicApi.GeneralSnapShot = function () {
      //topGames, topStreams
      this.topGames        = publicApi.TopGames.get ({ limit: 100, offset: 0 });
      this.topStreams      = [];
      for (var i=0; i<this.topGames.top.length; i++) {
        this.topStreams.push (publicApi.TopStreams.get ({ q : this.topGames.top[i].game.name }));
      }
    };

    publicApi.UserSnapShot = function (username, defaultGame) {
      //user, follows, topStreamsFromDefaultGame
      this.user                      = publicApi.User.get      ({ user : username    });
      this.follows                   = publicApi.Follows.get   ({ user : username    });
      this.topStreamsFromDefaultGame = publicApi.TopStreams.get({ q    : defaultGame });
    };
    
    publicApi.test = function () {
      var testUser  = 'am1r_tv';
      var testGame1 = 'Counter-Strike: Global Offensive';
      var testGame2 = 'CS:GO';
      
      $log.info (publicApi.User.get     ({ user: testUser                      }));
      $log.info (publicApi.Follows.get  ({ user: testUser, limit:100, offset:0 }));
      $log.info (publicApi.Channel.get  ({ channel: testUser                   }));
      $log.info (publicApi.Streams.get  ({ channel: testUser                   }));
      $log.info (publicApi.TopGames.get ({ limit: 100, offset: 0               }));
      $log.info (publicApi.FindGame.get ({ query: testGame1                    }));
      $log.info (publicApi.FindGame.get ({ query: testGame2                    }));
      $log.info (new publicApi.GeneralSnapShot());
      $log.info (new publicApi.UserSnapShot(testUser, testGame1));
    };
    globals.testTwitchService = publicApi.test;

    return publicApi;
  }]);
  
} (this));
