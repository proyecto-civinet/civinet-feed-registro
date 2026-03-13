const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadImage = (buffer, folder = 'ongs') => { return new Promise((resolve, reject) => {   const stream = cloudinary.uploader.upload_stream(     { folder },     (error, result) => error ? reject(error) : resolve(result.secure_url)   );   streamifier.createReadStream(buffer).pipe(stream); });
};

module.exports = { uploadImage };