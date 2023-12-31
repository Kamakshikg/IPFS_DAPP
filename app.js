import * as IPFS from 'ipfs-core';
import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import EventEmitter from 'events';

class Emitter extends EventEmitter { }

const emitter = new Emitter();
emitter.setMaxListeners(100);

// const IPFS=require('ipfs-core');
// const express=require('express');
// const bodyParser=require('body-parser');
// const fileUpload=require('express-fileupload');
// const fs=require('fs');

// const ipfs=new ipfsClient({host:'localhost',port:'5001',protocol:'http'});
const ipfs = await IPFS.create();
const app=express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

app.get('/',(req,res)=>{
	res.render('home');
});

app.post('/upload',(req,res)=>{
	const file=req.files.file1;
	const fileName=req.body.fileName;
	const filePath='files/'+fileName;

	file.mv(filePath,async(err)=>{
		if(err)
		{
			console.log('Failed to download the file');
			return res.status(500).send(err);
		}

		// const ipfs = await IPFS.create()
		// const fileHash=await addFile(fileName,filePath);
		// fs.unlink(filePath,(err)=>{
		// 	if(err)
		// 	{
		// 		console.log(err);
		// 	}
		// });

		res.render('upload',{fileName,fileHash});
	});
});

const addFile=async(fileName,filePath)=>{
	const file=fs.readFileSync(filePath);
	console.log(file);
	const fileAdded = await ipfs.add({path: fileName,content: file});
	// const fileHash=fileAdded[0].hash;

	return fileAdded.cid.toString();
};

app.listen(5000,()=>{
	console.log('Server is listening...');
});