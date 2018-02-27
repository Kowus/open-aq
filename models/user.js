const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    securePassword = require('secure-password')
    ;
let pwd = securePassword(),
    User = new Schema({
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        given_name: {
            type: String,
            required: true
        },
        family_name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        group: {
            type: String,
            default: 'user'
        },
        account_stat: {
            confirmed: {
                status: {
                    type: Boolean,
                    default: false
                },
                key: {
                    type: String
                }
            }
        }

    });



module.exports = mongoose.model('User', User);