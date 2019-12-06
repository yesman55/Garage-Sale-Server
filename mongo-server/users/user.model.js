const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    id_photo: { type: String },
    validated: { type: Boolean }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);