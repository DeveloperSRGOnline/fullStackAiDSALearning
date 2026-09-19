const ImageKit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs');

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file) {
    const fileForUpload = await toFile(file.buffer, file.originalname);
    return await imagekit.files.upload({
        file: fileForUpload,
        fileName: file.originalname,
        folder: "Songs"
    });
}

module.exports = { uploadFile }
