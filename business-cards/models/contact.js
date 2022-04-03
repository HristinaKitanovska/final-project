const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        required: false
    },
    contact_info: {
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

module.exports = mongoose.model('contact', contactSchema);