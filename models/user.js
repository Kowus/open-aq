const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    securePassword = require('secure-password'),
    gib = require('../lib/gibberish')
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
User.pre('validate', next => {
    let user = this;
    if (this.isNew) {
        user.account_stat.confirmed.key = gib();
        return next();
    } else {
        next();
    }
})

User.pre('save', next => {
    let user = this;

    if (this.isModified('password') || this.isNew) {
        let user_password = Buffer.from(user.password);
        pwd.hash(user_password, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    } else {
        return next();
    }
});


User.methods.comparePasswords = (password, cb) => {
    const hashbuf = Buffer.alloc(securePassword.HASH_BYTES);
    hashbuf.set(this.password);
    pwd.verify(Buffer.from(password), hashbuf, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch === securePassword.VALID)
    })
}


User.methods.comparePasswords = (password, cb) => {
    const hashbuf = Buffer.alloc(securePassword.HASH_BYTES);
    hashbuf.set(this.password);
    pwd.verify(Buffer.from(password), hashbuf, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch === securePassword.VALID)
    })
}

module.exports = mongoose.model('User', User);