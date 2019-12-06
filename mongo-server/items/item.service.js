const config = require('../config.json');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Item = db.Item;

module.exports = {
	addItem,
	getAllItems,
	getUserItems,
};

async function addItem(itemObj) {
	const item = await new Item(itemObj);
	await item.save();
}

async function getAllItems() {
	const items = await Item.find({}, {_id:0});
	return items.toObject();
}

async function getUserItems(userId) {
	const items = await Item.find({userId:userId});
	return items.toObject();
}
