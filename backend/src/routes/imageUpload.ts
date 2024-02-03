// import { Router } from "express";
// const router = Router();
// import multer from 'multer';
// import PassportAuth from '../utility/authentication.ts';

// router.use(PassportAuth);

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/")
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now()
//       cb(null, uniqueSuffix + file.originalname)
//     }
//   })
  
//   const upload = multer({ storage: storage })
  
//   router.post("/upload-image", upload.single("image"), async (req, res) => {
//     console.log(req.body);
//     const imageName = req.file.filename;
//     res.json(imageName)
//     console.log(imageName)
//   });
  
//   export default router;
