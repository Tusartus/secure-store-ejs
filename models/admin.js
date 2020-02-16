
/*
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var adminSchema = new mongoose.Schema({

    admincode: {type: String, required:true},
    email: {type: String, required: true},
    password: { type: String }
    //passwordResetToken: {type: String, default: ' ' },
    //passwordResetExpires: {type: Date, defauft: Date.now},
    //facebook:{type: String, default: ''},
    //tokens: Array
    /*company:{
      name:{type: String, default: ''},
      image:{type:String, defauft: ''}

    }, */
   //});

  /*
  facebook: {
    id: String,
    token: String,
    email: String,
    password: String
  },
  twitter: {
    id: String,
    token: String,
    email: String,
    password: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    password: String
  }
*/

/*
// generating a hash
adminSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
adminSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


/* compare password in the database and the one that the user type in */
/*
adminSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}
*/

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
/*
adminSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
*/
/*
// create the model for user and expose it to our app
module.exports = mongoose.model('Admin', adminSchema);


*/