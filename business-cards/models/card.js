const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    designer: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: false
    },
    status: {
        type: String,
        required: true
    },
    card_design_info: {
        website_link: {
            type: String,
            required: false
        },
        logo: {
            type: String,
            required: false
        },
        prefered_font: {
            type: String,
            required: false
        },
        prefered_main_color: {
            type: String,
            required: false
        }
    },
    card_content_info: {
        profile_picture: {
            type: String,
            required: false
        },
        cv: {
            type: String,
            required: false
        },
        info_text: {
            type: String,
            required: false
        },
        phone_number: {
            type: String,
            required: false
        },
        links: [
            {
                name: {
                    type: String,
                    required: false
                },
                hyperlink: {
                    type: String,
                    required: false
                },
                icon: {
                    type: String,
                    required: false
                },    
            }
        ]
    }
}, { timestamps: true });

module.exports = mongoose.model('card', cardSchema);