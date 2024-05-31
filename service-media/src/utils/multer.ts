import multer from "multer";

const storage = multer.memoryStorage();

const uploadMiddleware = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  storage: storage,
  fileFilter: function (req, file, callback) {
  
    const whitelist = ["image/png", "image/jpeg", "image/gif", "image/webp"];

    if (!whitelist.includes(file.mimetype)) {
      return callback(null, false);
    }

    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return callback(null, false);
    }

    callback(null, true);
  },
});

export default uploadMiddleware;
