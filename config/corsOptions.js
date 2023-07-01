const allowedOrigins = require('./allowedOriginsArray');
const corsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
    //methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    //allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true //to manage cookies using fetch()
}
module.exports = corsOptions;