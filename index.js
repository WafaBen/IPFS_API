const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const {ipfsClient} = require("ipfs-http-client")

const ipfs = new ipfsClient({host:'192.168.174.153',port:'5001',protocol:'http'})
const app = express();
app.use(bodyParser,urlencode({extended: true}));
app.use(fileUpload());
app.post('/upload',(req,res)=>{
    const file = req.files.file
    const fileName = req.body.fileName;
    const filePath = '/files' + fileName;
    file.mv(filePath,async(err)=>{
        if(err){
            console.log("Error occured");
            return res.status(500).send(err);
        }
        const fileHash = await addFile(fileName, filePath);
        fs.unlink(filePath,(err)=>{
            if(err){
                console.log(err)
            }
        });
        res.render('upload',{fileName,fileHash});
    })
})

const addFile= async(fileName,filePath)=>{
    fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({path:fileName,content:file});
    const fileHash = fileAdded[0].hash;
    return fileHash;
}

app.listen(3000,()=>{
    console.log("Server is listening on port 3000")
})