import {Router} from "express";
const router = Router();
import multer from 'multer';
import passport from "passport";

router.use((req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
          // Forward any passport-related errors to the error handler
          return next(err); 
      }

      if (!user) {
          // If there is no user, return an error
          return res.status(401).json({ error: 'Unauthorized' });
      }

      // If there is a user, proceed to the next middleware
      return next();
  })(req, res, next);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage })

router.post("/upload-image", upload.single("image"), async (req, res) => {
  console.log(req.body);
  const imageName = req.file.filename;
  res.json(imageName)
  console.log(imageName)
});

export default router;
