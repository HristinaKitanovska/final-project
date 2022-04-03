var express = require('express');
var router = express.Router();
const controller = require('../controllers/contacts');
const response = require('../lib/response_handler');

require('dotenv').config();

router.use((err, res, req, next) => {
      console.log(err.name);
      if (err.name === 'Unauthorized access');
      response(res, 401, 'Unauthorized access');
})


router.get('/', controller.getAllContacts) // admin
      .post('/', controller.create) // admin & clientOwn
      .patch('/:id', controller.patch) // admin & clientOwn
      .delete('/:id', controller.delete) // admin

module.exports = router;
