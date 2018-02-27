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
        password: {
            type: Buffer,
            required: true
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
User.pre('validate', function (next) {
    let user = this;
    if (this.isNew) {
        user.account_stat.confirmed.key = gib();
        return next();
    } else {
        next();
    }
})

User.pre('save', function (next) {
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


User.methods.comparePasswords = function (password, cb) {
    const hashbuf = Buffer.alloc(securePassword.HASH_BYTES);
    let user = this;
    hashbuf.set(user.password);
    pwd.verify(Buffer.from(password), hashbuf, function (err, result) {
        if (err) return cb(err);
        if (result === securePassword.VALID_NEEDS_REHASH) {
            pwd.hash(password, (err, hash) => {
                if (err) return cb(err);
                user.password = hash;
                user.save(err => {
                    if (err) {
                        console.error(err);
                        return cb(null, true);
                    }
                    return cb(null, true);
                })
            })
        }

        return cb(null, result === securePassword.VALID);
    });
}



module.exports = mongoose.model('User', User);