const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    item_id: { type: String, unique: true, required: true },
    item_name: { type: String },
	item_descr: { type: String },
	price: { type: String },
	userId: { type: String },
	area_code: { type: String },
	seller_id: { type: String },
	date_added: { type: String },
	sold: { type: String }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Item', schema);