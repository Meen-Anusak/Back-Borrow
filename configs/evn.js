require('dotenv').config();

module.exports = {
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    IMAGE_URL: process.env.IMAGE_URL,
    IMAGEPRODUCT_URL: process.env.IMAGEPRODUCT_URL,
}