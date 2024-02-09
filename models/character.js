const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecing to', url)

mongoose
  .connect(url)
  .then(() => console.log('connnected to mongoDB'))
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const characterSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 6,
    required: true,
  },
  important: Boolean,
})

characterSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Character', characterSchema)
