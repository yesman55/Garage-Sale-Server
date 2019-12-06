const express = require('express');
const router = express.Router();
const userService = require('./user.service.js');
const itemService = require('../items/item.service.js');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.post('/addItem', addItem);
router.get('/getAllItems', getAllItems);
router.get('/getItemsById/:userId', getUserItems);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function addItem(req, res, next) {
    itemService.addItem(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllItems(req, res, next) {
    itemService.getAllItems()
    .then(items => items ? res.json(items) : res.sendStatus(404))
    .catch(err => next(err));
}

function getUserItems(req, res, next) {
    console.log(req.params.userId);
    itemService.getUserItems(req.params.userId)
    .then(items => items ? res.json(items) : res.sendStatus(404))
    .catch(err => next(err));
}
