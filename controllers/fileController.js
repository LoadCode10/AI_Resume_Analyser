const {analyseResume} = require("../services/analyses-logic.js");

const fileController = async (req,res)=>{
  // res.send("uploaded successfully!");
  if(!req.file){
    return res.status(400).json({
      error: "No file Uploaded"
    })
  };

  console.log("Uploaded file:", req.file);

  const analysis = await analyseResume(req.file.filename);
  // res.json({
  //   message : 'file uploaded successfully!',
  //   filename: req.file.originalname,
  //   filepath : req.file.path,
  //   filesize: req.file.size
  // },
  // analysis);
  return res.json({
    message: "File uploaded & analyzed successfully!",
    file: {
      original: req.file.originalname,
      storedAs: req.file.filename,
      filepath: req.file.path,
      filesize: req.file.size
    },
    analysis
  });

};

module.exports =  { fileController };