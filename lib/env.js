module.exports = {
    database: {
        url: process.env.MONGODB_URI
    },
    jwt: {
        key: process.env.JWT_KEY,
        secret: process.env.JWT_KEY,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
    },
    redis: {
        url: process.env.REDIS_URL
    },
    session: {
        secret: process.env.SESSION_SECRET
    }
}