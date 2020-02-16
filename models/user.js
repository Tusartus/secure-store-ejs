var mongoose = require('mongoose');
//var crypto = require('crypto');
var Schema = mongoose.Schema;
var bcrypt  = require('bcryptjs');

/* The user schema attributes / characteristics / fields */
var UserSchema = new Schema({
  //isAdmin: { type: boolean, default: false },
  username: {
       type: String,
       index: true
   },
   password: {
       type: String
   },

   name: {
       type: String
   },
   profileimage: {
       type: String
   },
   isAdmin: {
     type:Boolean,
     default: false
   },

  email: { type: String, unique: true, lowercase: true},

  address: String,
  history: [{
    date: Date,
    paid: { type: Number, default: 0},
    item: { type: Schema.Types.ObjectId, ref: 'Product'}
    // item: { type: Schema.Types.ObjectId, ref: ''}
  }]
});

/*  Hash the password before we even save it to the database */
/*
UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});
*/

/* compare password in the database and the one that the user type in */
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}


/*

UserSchema.methods.gravatar = function(size) {
  if (!this.size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}
*/

//with passport local

// generating a hash
UserSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

//with passport local
// checking if password is valid
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};



module.exports = mongoose.model('User', UserSchema);
