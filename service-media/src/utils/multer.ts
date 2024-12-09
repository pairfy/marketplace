import multer from "multer";

const storage = multer.memoryStorage();

const uploadMiddleware = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  storage: storage,
  fileFilter: function (req, file, callback) {

    console.log(file);

    const whitelist = ["image/png", "image/jpeg", "image/webp"];

    if (!whitelist.includes(file.mimetype)) {
      return callback(null, false);
    }

    if (file.fieldname !== 'image') {
      return callback(null, false);
    }

    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      return callback(null, false);
    }

    callback(null, true);
  },
});

export default uploadMiddleware;
