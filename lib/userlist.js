'use strict';

/**
 * UserList provides functions to handle credential.json
 */

var fs   = require('fs');
var path = require('path');

var UserList = function () {
  var self  = this;
  var file  = path.join(__dirname, '../credentials.json');
  var users = [];

  if (fs.existsSync(file)) {
    users = JSON.parse(fs.readFileSync(file));
  } else {
    fs.writeFileSync(file, JSON.stringify(users, null, 2));
  }

  var firstUsername = Object.keys(users)[0];
  if (firstUsername && typeof users[firstUsername] == 'string') {
    var userlist  = [];
    var adminFlag = true;

    for (var name in users) {
      userlist.push({
        username: name,
        password: users[name],
        group: adminFlag ? 'admin' : 'user'
      });
      adminFlag   = false;
    }
    users = userlist;
    fs.writeFileSync(file, JSON.stringify(users, null, 2));
  }

  /**
   * get a user with a given name
   * @param  {String} username
   * @return {Object} the user if found, otherwise null
   */
  self.get = function (username) {
    for (var i = users.length - 1; i >= 0; i--) {
      if (users[i].username == username) {
        return users[i];
      }
    }
    return null;
  };

  /**
   * add a user to the list and update credentials.json
   * @param {String} username
   * @param {Object} attributes password, group...
   * @return {Boolean} true if success, otherwise false
   */
  self.add = function (user) {
    if (!user.group) {
      user.group = users.length === 0 ? 'admin' : 'user';
    }
    if (!self.get(user.username)) {
      users.push(user);
      fs.writeFileSync(file, JSON.stringify(users, null, 2));
      return true;
    }
    return false;
  };

  /**
   * remove a user from the list and update credentials.json
   * @param {String} username
   * @return {Object} the deleted user if success, otherwise null
   */
  self.remove = function (username) {
    for (var i = users.length - 1; i >= 0; i--) {
      if (users[i].username == username) {
        var user = users.splice(i, 1);
        fs.writeFileSync(file, JSON.stringify(users, null, 2));
        return user;
      }
    }
    return null;
  };
};

module.exports = new UserList();