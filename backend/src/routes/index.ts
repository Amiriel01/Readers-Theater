import {Router} from "express";
const router = Router();
import multer from 'multer';
import passport from "passport";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
})

const upload = multer({ storage: storage })

router.post("/upload-image-profile", passport.authenticate('jwt', {session: false}), upload.single("image"), async (req, res) => {
  const imageName = req.file.filename;
  res.json(imageName);
});

router.post("/upload-image-sign-up", upload.single("image"), async (req, res) => {
  const imageName = req.file.filename;
  res.json(imageName);
});

export default router;
