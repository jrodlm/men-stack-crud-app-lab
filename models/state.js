const mongoose = require('mongoose')

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  flower: { type: String, required: false },
  visited: Boolean,
})

const State = mongoose.model('State', stateSchema)
module.exports = State