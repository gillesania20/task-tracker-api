const ACCESS_TOKEN_EXPIRES_IN = (process.env.NODE_ENV === 'production')?'5s':'60s';
const REFRESH_TOKEN_EXPIRES_IN = '1d';
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24;
const COOKIE_HTTP_ONLY = true;
const COOKIE_SAME_SITE = (process.env.NODE_ENV === 'production')?'none':false;
//sameSite: false === for development
//sameSite: 'none' === for production
const COOKIE_SECURE = (process.env.NODE_ENV === 'production')?true:false;
//secure: false === for development
//secure: true === for production
module.exports = {
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN,
    COOKIE_MAX_AGE,
    COOKIE_HTTP_ONLY,
    COOKIE_SAME_SITE,
    COOKIE_SECURE
}