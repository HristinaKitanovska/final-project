const mongoose = require('mongoose');

const contactBookSchema = mongoose.Schema({
    cookieID: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: false
    },
    contacts: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'contact',
            required: false
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('contactBook', contactBookSchema);