const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  },

  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    unique: true
  },

  hashed_password: {
    type: String,
    required: true,
  },

  salt: String,

  role: {
    type: String,
    default: "subscriber"
  },

  reset_passwordLink: {
    type: String,
    default: "subscriber"
  }

}, { timestamps: true})



userSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// methods
userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password; // true false
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};

module.exports = mongoose.model('User', userSchema);
