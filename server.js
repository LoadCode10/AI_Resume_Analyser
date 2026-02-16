require("dotenv").config();
const express = require('express');
const app = express();
// const multer = require('multer');
const path = require('path');
const upload = require('./middlewares/upload.js');

const PORT = process.env.PORT || 5050;

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(express.static(path.join(__dirname,'/public')));

//all my routes should be below

app.use('/',require('./routes/cv-analyser.js'));
app.use('/api/upload',require('./routes/api/upload.js'));
app.use('/api/cv-analyse',require('./routes/api/cv-analyse.js'));

app.use((req,res)=>{
  res.status(404);
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname,'views','404.html'));
  }else if(req.accepts('json')){
    res.json({'error':"404 Not Found!"});
  }else{
    res.type('text').send('404 Not Found');
  }
  res.status(404)
});

app.listen(PORT,()=>{
  console.log(`server listening on http://localhost:${PORT}`);
})