const User = require('../models/user');
const bcrypt = require('bcryptjs');
const response = require('../lib/response_handler');
const jwt = require('jsonwebtoken');
const AccessControl = require('accesscontrol');
const ac = new AccessControl();

ac.grant('admin')
    .createAny('user')
    .deleteAny('user')
    .updateAny('user')
    .readAny('user');
ac.deny('client')
    .createAny('user')
    .deleteAny('user')
    .updateAny('user')
    .readAny('user');
ac.grant('client')
    .readOwn('user');
ac.deny('designer')
    .createAny('user')
    .deleteAny('user')
    .updateAny('user')
    .readAny('user');
    

module.exports = {
    getAllUsers: async (req, res) => {
        if (!req.user) { 
            res.status(401).send('You are not login'); 
            return
        }
        const permission = ac.can(req.user.role).readAny('user');
        if (!permission.granted) {
            res.status(403).send('Unauthorize permission');
            return
        } 
        const users = await User.find();
        res.send({
            error: false,
            message: 'All users from database',
            users: users
        });
    },

    getIDUser: async (req, res) => {
        if (!req.user) { 
            res.status(401).send('You are not login'); 
            return
        }
        const permission = ac.can(req.user.role).readAny('user');

        if (!permission.granted) {
            const permissionOwn = ac.can(req.user.role).readOwn('user');

            if ( !( permissionOwn.granted && req.params.id === req.user.id ) ) {
                res.status(403).send('Unauthorize permission');
                return
            }
        } 

        try {
            const user = await User.findById(req.params.id);
            res.send({
                error: false,
                message: `User with id #${user._id}`,
                user: user
            });
        } catch (error) {
            return response(res, 400, 'User doesen\'t exist');
            }
    },

    create: async (req, res) => {
        console.log(req.user)

        if (!req.user) { 
            res.status(401).send('You are not login'); 
            return
        }

        const permission = ac.can(req.user.role).createAny('user');
        if (!permission.granted) {
            res.status(403).send('Unauthorize permission');
            return
        }
        try {
            let dbUser = await User.findOne({ email: req.body.email });

            if (dbUser) {
                return response(res, 400, 'Bad request. User exists with the provided email');
            }

            req.body.password = bcrypt.hashSync(req.body.password);
            const user = await User.create(req.body);

            res.send({
                error: false,
                message: 'New user has been created',
                user: user
            });
        } catch (error) {
            response(res, 500, error.msg);
        }
    },

    register: async (req, res) => {
        req.body.role = 'client'

        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return response(res, 400, 'Bad request. User exists with the provided email');
            }

            req.body.password = bcrypt.hashSync(req.body.password);

            user = await User.create(req.body);

            response(res, 201, 'New user has been registered', { user })
        } catch (error) {
            response(res, 500, error.msg);
        }
    },

    login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const payload = {
                        id: user._id,
                        email: user.email,
                        first_name: user.first_name,
                        role: user.role
                    }
                    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                        expiresIn: '1y'
                    });

                    response(res, 200, 'You have logged in successfully', { token })
                } else {
                    response(res, 401, 'Invalid credentials');
                }
            } else {
                response(res, 401, 'Invalid credentials');
            }
        } catch (error) {
            response(res, 500, error.msg);
        }
    },

    patch: async (req, res) => {
        await User.findByIdAndUpdate(req.params.id, req.body);
        const user = await User.findById(req.params.id);
        res.send({
            error: false,
            message: `User with id #${user._id} has been updated`,
            user: user
        });
    },

    delete: async (req, res) => {
        console.log(req.user)
        const permission = ac.can(req.user.role).deleteAny('user');
        if (!permission.granted) {
            res.status(403).send('Unauthorize permission');
            return
        } 

        await User.findByIdAndDelete(req.params.id);
        res.send({
            error: false,
            message: `User with id #${req.params.id} has been deleted`
        });
    }
}