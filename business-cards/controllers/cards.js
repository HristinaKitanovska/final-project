const Card = require('../models/card');
const bcrypt = require('bcryptjs');
const response = require('../lib/response_handler');
const jwt = require('jsonwebtoken');
const AccessControl = require('accesscontrol');
const { find } = require('../models/card');
const card = require('../models/card');
const ac = new AccessControl();

ac.grant('admin')
    .createAny('card')
    .readAny('card')
    .updateAny('card')
    .deleteAny('card');
ac.grant('designer')
    .readAny('card')
    .updateAny('card');
ac.deny('designer')
    .createAny('card')
    .deleteAny('card');
ac.grant('client')
    .createAny('card')
    .updateOwn('card')
    .readOwn('card');
ac.deny('client')
    .deleteAny('card');
     

module.exports = {
    getAllCards: async (req, res) => {
        if (!req.user) { 
            res.status(401).send('You are not login'); 
            return
        }
        
        if (!(req.user.role === "admin")) {
            res.status(403).send('Unauthorize permission');
            return
        }

        const cards = await Card.find();
        res.send({
            error: false,
            message: 'All cards from database',
            cards: cards
        });
    },

    getIDCard: async (req, res) => {
        const card = await Card.findById(req.params.id).populate('owner');
        if (!req.user) { 
            res.status(401).send('You are not login'); 
            return
        }

        // TODO: - Clean up the if-else statements
        if (!(req.user.role === "admin")) {
            if (card.owner !== undefined) {
                if (req.user.id === card.owner.id) { }
                else if (card.designer !== undefined) {
                    if (req.user.id !== card.designer.id) {
                        res.status(403).send('Unauthorize permission');
                        return
                    }
                } else {
                    res.status(403).send('Unauthorize permission');
                    return
                }
            }
        } 

        try {
            const card = await Card.findById(req.params.id);
            res.send({
                error: false,
                message: `Card with id #${card._id}`,
                card: card
            });
        } catch (error) {
            return response(res, 400, 'Card doesen\'t exist');
        }
    },

    getMyCards: async (req, res) => {
        if (!req.user) { 
            res.status(401).send('You are not login'); 
            return
        }
        
        if (!(req.user.role === "designer")) {
            res.status(403).send('Unauthorize permission');
            return
        }

        try {
            const myCards = await Card.find({ designer: req.user.id })

            res.status(200).send({
                error: false,
                myCards: myCards
            })
        } catch(error) {
            res.status(500).send(error.message)
        }
    },

    purchaseCard: async (req, res) => {

        if (!req.user) { 
            res.status(401).send('You are not login'); 
            return
        }

        const permission = ac.can(req.user.role).createAny('card');
        if (!permission.granted) {
            res.status(403).send('Unauthorize permission');
            return
        }
        
        try {
            req.body.owner = req.user.id
            req.body.status = "purchased"
            const card = await Card.create(req.body);

            res.send({
                error: false,
                message: 'New card has been created',
                card: card
            });
        } catch (error) {
            response(res, 500, error.msg);
        }
    },

    update: async (req, res) => {
        if (!req.user) { 
            res.status(401).send('You are not login'); 
            return
        }

        if (!(req.user.role === "admin")) {
            res.status(403).send('Unauthorize permission');
            return
        }

        await Card.findByIdAndUpdate(req.params.id, req.body);
        const card = await Card.findById(req.params.id);
        res.send({
            error: false,
            message: `Card with id #${card._id} has been updated`,
            card: card
        });
    },

    delete: async (req, res) => {
        if (!req.user) { 
            res.status(401).send('You are not login'); 
            return
        }

        if (!(req.user.role === "admin")) {
            res.status(403).send('Unauthorize permission');
            return
        }

        await Card.findByIdAndDelete(req.params.id);
        res.send({
            error: false,
            message: `Card with id #${req.params.id} has been deleted`,
        });
    },

    updateStatus: async (req, res) => {
        if (!req.user) { 
            res.status(401).send('You are not login'); 
            return
        }

        if ((req.user.role === "client")) {
            res.status(403).send('Unauthorize permission');
            return
        }

        await Card.findByIdAndUpdate(req.params.id, { status: req.body.status })
        res.status(200).send("Successful status update")
    },

    availableCards: async (req, res) => {
        if (!req.user) { 
            res.status(401).send('You are not login'); 
            return
        }

        if (!(req.user.role === "designer")) {
            res.status(403).send('Unauthorize permission');
             return
        }

        const availableCards = await Card.find({ status: "purchased" })
        res.send({
            error: false,
            availableCards: availableCards
        });

        
    },

    takeCard: async (req, res) => {
        if (!req.user) { 
            res.status(401).send('You are not login'); 
            return
        }

        if (!(req.user.role === "designer")) {
            res.status(403).send('Unauthorize permission');
             return
        }

        const cardId = req.body.id

        if (cardId) {
            const cardModel = await Card.findOne({ _id: cardId })

            if (cardModel.designer === undefined) {
                await Card.findByIdAndUpdate(cardId, {designer: req.user.id, status: "in progress" })
                res.status(200).send({
                    error: false,
                    message: "The card was successfully taken"
                })
                return
            }
            
            res.status(401).send("This card already has a designer")
        } else {
            res.status(500).send('Bad request');
            return
        }

    },

    updateCardDetails: async (req, res) => {
    
    },

    myContacts: async (req, res) => {

    },

    addContact: async (req, res) => {

    }
}