describe('QuickBlox SDK - Users', function() {
  var quickBlox = QB, session;

  beforeEach(function(){
    var done;
    quickBlox.init(CONFIG);
    runs(function(){
      done = false;
      quickBlox.createSession(function (err, result){
          expect(err).toBeNull();
          session = result;
          expect(session).not.toBeNull();
          done = true;
      });
    });
    waitsFor(function(){
      return done;
    },'create session', TIMEOUT);
  });

  it('can list users', function(){
    var done, result;
    runs(function(){
      done = false;
      quickBlox.users().listUsers(function(err, res){
        expect(err).toBeNull();
        result = res;
        done = true;
      });
    });
    waitsFor(function(){
      return done;
    },'list users', TIMEOUT);
    runs(function(){
      expect(result).not.toBeNull();
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.total_entries).toBeGreaterThan(0);
    });
  });

  it('can filter users by email (nobody@nowhere.org)', function() {
    var done, result;
    params = {filter: { type: 'email', value: 'nobody@nowhere.org' }};
    runs(function(){
      done = false;
      quickBlox.users().listUsers(params, function(err, res){
        expect(err).toBeNull();
        result = res;
        done = true;
      });
    });
    waitsFor(function isDone(){
      return done;
      }, 'filter users by email', TIMEOUT);
    runs(function(){
      expect(result).not.toBeNull();
      expect(result.items.length).toBe(0);
    });
  });

  it('can filter users by login (qb-dan)', function() {
    var done, result;
    params = {filter: { type: 'login', value: 'qb-dan' }};
    runs(function(){
      done = false;
      quickBlox.users().listUsers(params, function(err, res){
        expect(err).toBeNull();
        result = res;
        done = true;
      });
    });
    waitsFor(function isDone(){
      return done;
      }, 'filter users by email', TIMEOUT);
    runs(function(){
      expect(result).not.toBeNull();
      expect(result.items.length).toBe(1);
      expect(result.items[0].user.id).toBe(239647);
    });
  });

  describe('Create, update & delete Users', function(){
    var user, login = 'qb-temp' + Math.floor(Math.random()*1000);

    it('can create a user (' + login + ')', function() {
      var done;
      params = { 'login': login, 'password': 'someSecret', 'full_name': 'QuickBlox Test', 'website': 'http://quickblox.com' };
      runs(function(){
        done = false;
        quickBlox.users().create(params, function(err, res){
          done = true;
          expect(err).toBeNull();
          user = res;
        });
      });
      waitsFor(function isDone(){
        return done;
        }, 'create user', TIMEOUT);
      runs(function(){
        console.debug('User is',user);
        expect(user).not.toBeNull();
        expect(user.full_name).toBe('QuickBlox Test');
      });
    });

    it('can update a user (' + login + ')', function() {
      var done;
      runs(function(){
        done = false;
        quickBlox.login({login: login, password: 'someSecret'}, function(err, user){
          user.full_name = 'Updated QuickBlox Test';
          quickBlox.users().update(user, function(err, res){
            done = true;
            expect(err).toBeNull();
            if (res) {user = res;}
          });
        });
      });
      waitsFor(function isDone(){
        return done;
        }, 'update user', TIMEOUT);
      runs(function(){
        expect(user).not.toBeNull();
        expect(user.full_name).toBe('Updated QuickBlox Test');
      });
    });

    it('can delete a user (' + login + ')', function() {
      var done;
      runs(function(){
        done = false;
        quickBlox.users().delete(user.id, function(err, res){
          done = true;
          expect(err).toBeNull();
          user = res;
        });
      });
      waitsFor(function isDone(){
        return done;
        }, 'delete user', TIMEOUT);
      runs(function(){
        console.debug('User is', user);
        expect(user).toBeNull();
      });
    });
  });


  describe('Get Users', function(){
      var quickBlox = QB, session;

    beforeEach(function(){
      var done;
      quickBlox.init(CONFIG);
      runs(function(){
        done = false;
        quickBlox.createSession(function (err, result){
            expect(err).toBeNull();
            session = result;
            expect(session).not.toBeNull();
            done = true;
        });
      });
      waitsFor(function(){
        return done;
      },'create session', TIMEOUT);
    });

    it('can get users by login (qb-dan)', function() {
      var done, user;
      params = { 'login': 'qb-dan' };
      runs(function(){
        done = false;
        quickBlox.users().get(params, function(err, res){
          done = true;
          expect(err).toBeNull();
          user = res;
        });
      });
      waitsFor(function isDone(){
        return done;
        }, 'get users by login', TIMEOUT);
      runs(function(){
        expect(user).not.toBeNull();
        expect(user.id).toBe(239647);
      });
    });

    it('can get users by email (dan@quickblox.com)', function() {
      var done, user;
      params = { 'email': 'dan@quickblox.com' };
      runs(function(){
        done = false;
        quickBlox.users().get(params, function(err, res){
          done = true;
          expect(err).toBeNull();
          user = res;
        });
      });
      waitsFor(function isDone(){
        return done;
        }, 'get users by email', TIMEOUT);
      runs(function(){
        expect(user).not.toBeNull();
        expect(user.id).toBe(239647);
      });
    });

    it('can get users by id (239647)', function() {
      var done, user;
      params = 239647;
      runs(function(){
        done = false;
        quickBlox.users().get(params, function(err, res){
          done = true;
          expect(err).toBeNull();
          user = res;
        });
      });
      waitsFor(function isDone(){
        return done;
        }, 'get users by email', TIMEOUT);
      runs(function(){
        expect(user).not.toBeNull();
        expect(user.login).toBe('qb-dan');
      });
    });




  });

});
