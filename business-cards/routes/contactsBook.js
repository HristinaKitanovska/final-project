var express = require('express');
var router = express.Router();
const controller = require('../controllers/contactsBook');
const response = require('../lib/response_handler');

require('dotenv').config();

router.use((err, res, req, next) => {
      console.log(err.name);
      if (err.name === 'Unauthorized access');
      response(res, 401, 'Unauthorized access');
})


router.get('/', controller.getAllContactsBook) // admin
      .post('/', controller.create) // admin & clientOwn
      .post('/add-contact', controller.addContact)
      .delete('/:id', controller.delete) // admin
      .delete('/delete-contact/:id', controller.deleteContact)

module.exports = router;