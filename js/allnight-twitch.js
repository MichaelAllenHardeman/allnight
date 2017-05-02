(function(globals) {
  'use strict';
  
  if(!angular) {
    throw new Error('AngularJS is required for this module');
  }
  
  var MODULE_NAME = 'allnight-twitch';
  var application = angular.module('allnight-twitch', []);
  
  application.factory( 'TwitchService', [
    '$log',
    '$resource',
  function (
    $log,
    $resource
  ) {
  
    var publicApi = {
      'User'            : undefined,
      'Follows'         : undefined,
      'Channel'         : undefined,
      'Streams'         : undefined,
      'TopStreams'      : undefined,
      'TopGames'        : undefined,
      'FindGame'        : undefined,
      'GeneralSnapShot' : undefined,
      'UserSnapShot'    : undefined,
      'test'            : undefined
    };
    
    publicApi.User = $resource('https://api.twitch.tv/kraken/users/:user', {
      user : '@user'
    });
    
    publicApi.Follows = $resource('https://api.twitch.tv/kraken/users/:user/follows/channels',{
      user : '@user'
    });
    
    publicApi.Channel = $resource('https://api.twitch.tv/kraken/channels/:channel', {
      channel : '@channel'
    });
    
    publicApi.Streams = $resource('https://api.twitch.tv/kraken/streams/:channel', {
      channel : '@channel'
    });
    
    publicApi.TopStreams = $resource('https://api.twitch.tv/kraken/search/streams', {
      q : '@game'
    });

    publicApi.TopGames = $resource('https://api.twitch.tv/kraken/games/top');
    
    publicApi.FindGame = $resource('https://api.twitch.tv/kraken/search/games', {
      query : '@query',
      type  : 'suggest'
    });

    publicApi.GeneralSnapShot = function(){
      //topGames, topStreams
      this.topGames        = publicApi.TopGames.get( { limit: 100, offset: 0 } );
      this.topStreams      = [];
      for(var i=0; i<this.topGames.top.length; i++){
        this.topStreams.push(publicApi.TopStreams.get( { q : this.topGames.top[i].game.name } ));
      }
    };

    publicApi.UserSnapShot = function(username, defaultGame){
      //user, follows, topStreamsFromDefaultGame
      this.user                      = publicApi.User.get      ( { user : username    } );
      this.follows                   = publicApi.Follows.get   ( { user : username    } );
      this.topStreamsFromDefaultGame = publicApi.TopStreams.get( { q    : defaultGame } );
    };
    
    publicApi.test = function(){
      var testUser  = 'am1r_tv';
      var testGame1 = 'Counter-Strike: Global Offensive';
      var testGame2 = 'CS:GO';
      
      $log.info( publicApi.User.get    ( { user: testUser                      } ) );
      $log.info( publicApi.Follows.get ( { user: testUser, limit:100, offset:0 } ) );
      $log.info( publicApi.Channel.get ( { channel: testUser                   } ) );
      $log.info( publicApi.Streams.get ( { channel: testUser                   } ) );
      $log.info( publicApi.TopGames.get( { limit: 100, offset: 0               } ) );
      $log.info( publicApi.FindGame.get( { query: testGame1                    } ) );
      $log.info( publicApi.FindGame.get( { query: testGame2                    } ) );
      $log.info( new publicApi.GeneralSnapShot()                                   );
      $log.info( new publicApi.UserSnapShot(testUser, testGame1)                   );
    };
    globals.testTwitchService = publicApi.test;

    return publicApi;
  }]);
  
}(this));