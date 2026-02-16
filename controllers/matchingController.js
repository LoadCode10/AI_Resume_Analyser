const {cvJobMatching} = require("../services/analyses-logic");

const matchingController = async (req,res)=>{
  if(!req.files || !req.files.cv || !req.files.job){
    return res.status(400).json({
      error: "Both CV and Job files are required"
    })
  };

  const cvFile = req.files.cv[0];
  const jobFile = req.files.job[0];

  const matching = await cvJobMatching(cvFile.filename,jobFile.filename);

  res.json({
    message: "Files uploaded & analyzed successfully!",
    files: {
      cv: cvFile.originalname,
      job: jobFile.originalname
    },
    matching
  });
};

module.exports = {matchingController};