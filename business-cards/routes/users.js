var express = require('express');
var router = express.Router();
const controller = require('../controllers/users');
const jwt = require('express-jwt');
const response = require('../lib/response_handler');

require('dotenv').config();

router.use(jwt({
      secret: process.env.JWT_SECRET_KEY,
      algorithms: ['HS256']
}).unless({
      path: [
            {
                  url: '/users/login', methods: ['POST']
            },
            {
                  url: '/users/register', methods: ['POST']
            },
      ]
}));

router.use((err, res, req, next) => {
      console.log(err.name);
      if (err.name === 'Unauthorized access');
      response(res, 401, 'Unauthorized access');
})


router.get('/', controller.getAllUsers)
      .get('/:id', controller.getIDUser)
      .post('/', controller.create)
      .post('/register', controller.register)
      .post('/login', controller.login)
      .patch('/:id', controller.patch)
      .delete('/:id', controller.delete)

module.exports = router;
