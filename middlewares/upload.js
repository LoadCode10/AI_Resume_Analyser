const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null, "uploads/");
  },
  filename: (req,file,cb)=>{
    cb(null,file.originalname);
  }
});

const  upload = multer({
  storage,
  fileFilter: (req,file,cb)=>{
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if(allowed.includes(file.mimetype)){
      cb(null, true);
    }else{
      cb(new Error("Only PDF or DOCX files are allowed"));
    }
  },
  limits:{
    fileSize: 50 * 1024 * 1024
  }
});

module.exports = upload;