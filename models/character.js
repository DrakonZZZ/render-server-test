const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 6,
    required: true,
  },
  important: Boolean,
});

characterSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Character', characterSchema);
