const Storage = {
  _storage: wx,
  _expiration_key_prefix: '__expired___storage__',

  getTimestamp: function() {
    return Math.floor(((new Date()).getTime()) / 1000);
  },

  setStorageSync: function(key, value, expiration) {
    try {
      this._storage.setStorageSync(key, value);
    } catch (e) {
      // 1. 第一次失败，先清理过期的数据
      this.clearExpiredStorage();
      try {
        this._storage.setStorageSync(key, value);
      } catch (error) {
        // 2. 第二次失败，则抛出错误
        console.error(`当前存储的key为${key}，其value已超出微信数据缓存限制：`)
        console.error('单个 key 允许存储的最大数据长度为 1MB')
        console.error('所有数据存储上限为 10MB。')
        return error
      }
    }
    // 默认过期时间为 7 天
    this.updateExpiration(key, expiration || (3 * 24 * 60 * 60) - 3600);
    // this.updateExpiration(key, expiration ||  60);
  },

  getStorageSync: function(key) {
    if (this.isExpired(key)) {
      this.removeStorageSync(key);
      return null;
    }
    return this._storage.getStorageSync(key) || null;
  },

  peek: function(key) {
    let result = {
      value: this._storage.getStorageSync(key),
      timeLeft: this.getTimeLeft(key)
    };
    result.isExpired = result.timeLeft !== null && result.timeLeft <= 0;
    return result;
  },

  getTimeLeft: function(key) {
    let expireTime = parseInt(this._storage.getStorageSync(this._expiration_key_prefix + key), 10);
    if (expireTime && !isNaN(expireTime)) {
      return expireTime - this.getTimestamp();
    }
    return null;
  },

  isExpired: function(key) {
    let timeLeft = this.getTimeLeft(key);
    console.log("timeLeft____", timeLeft)
    console.log("timeLeft____", key)
    return timeLeft !== null && timeLeft <= 0;
  },

  updateExpiration: function(key, expiration) {
    return this._storage.setStorageSync(this._expiration_key_prefix + key, this.getTimestamp() + expiration);
  },

  removeStorageSync: function(key) {
    this._storage.removeStorageSync(key);
    this._storage.removeStorageSync(this._expiration_key_prefix + key);
  },

  keys: function(includeExpired) {
    let keyList = [];
    this._iterKeys(storageKey => {
      if (storageKey.indexOf(this._expiration_key_prefix) !== 0) {
        if (includeExpired || !this.isExpired(storageKey)) {
          keyList.push(storageKey);
        }
      }
    });
    return keyList;
  },

  _iterKeys: function(callback) {
    const storageInfo = wx.getStorageInfoSync();
    if (storageInfo.keys) {
      storageInfo.keys.forEach(key => {
        callback(key);
      });
    }
  },

  clearStorageSync: function() {
    try {
      this._storage.clearStorageSync();
    } catch (err) {
      console.log('Storage clear', err);
    }
  },

  clearExpiredStorage: function() {
    let resultList = [];
    this._iterKeys((storageKey) => {
      if (storageKey.indexOf(this._expiration_key_prefix) === 0) {
        let itemKey = storageKey.substr(this._expiration_key_prefix.length);
        if (this.isExpired(itemKey)) {
          this.removeStorageSync(itemKey);
          resultList.push(itemKey);
        }
      }
    });
    return resultList;
  }
};

module.exports = Storage;