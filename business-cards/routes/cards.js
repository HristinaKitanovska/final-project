var express = require('express');
var router = express.Router();
const controller = require('../controllers/cards');
const jwt = require('express-jwt');
const response = require('../lib/response_handler');

require('dotenv').config();

router.use(jwt({
      secret: process.env.JWT_SECRET_KEY,
      algorithms: ['HS256']
}));

router.use((err, res, req, next) => {
      console.log(err.name);
      if (err.name === 'Unauthorized access');
      response(res, 401, 'Unauthorized access');
})

router.get('/', controller.getAllCards)  
      .get('/mine', controller.getMyCards)
      .get('/available-cards', controller.availableCards)  
      .get('/:id', controller.getIDCard)
      .post('/', controller.purchaseCard)
      .post('/take', controller.takeCard)
      .delete('/:id', controller.delete) 
      .patch('/:id', controller.update) // samo za admin
      .patch('/status/:id', controller.updateStatus) // za designer 
      .patch('/card-details/:id', controller.updateCardDetails) 

module.exports = router;
