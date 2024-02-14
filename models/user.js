const mongoose = require('mongoose');
const uniqueVal = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  passwordHash: String,
  characterList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character',
    },
  ],
});

userSchema.plugin(uniqueVal);

userSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject._v;
    delete returnObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
