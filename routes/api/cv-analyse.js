const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const fileController = require('../../controllers/fileController');
const matchingController = require("../../controllers/matchingController")

router.post('/',upload.single("file"),fileController.fileController);

// router.post('/',upload.fields([
//   { name: "cv", maxCount: 1 },
//   { name: "job", maxCount: 1 }
// ]),matchingController.matchingController)

module.exports = router;