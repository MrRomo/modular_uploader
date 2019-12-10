# Modular Uploader
A module for prepare, transform and conver any photo, upload to the cloud (AWS,Azure,GCloud) and return the schema ready to save on data base.
The way to use is:
- Import the module an instance with env variables

``` js
const uploader = require('./modular_uploader')

const env = {
	AWS_ACCESS_KEY: '<your access key>',
	AWS_SECRET_ACCESS_KEY: '<your secret>',
	REGION : '<bucket region>',
	Bucket: '<bucket name>',
	ACL: 'public-read'
};
const uploaderator = new uploader.uploader_s3(env)
```

## Methods 
All modules methods, are async functions, the "data" param, is a buffer array from the image to you want upload.

``` js
async crop(data, { width, height })
async convert(data, format)
async prepare(data, params)
async upload(data, params) 
``` 

Until now, the module only upload to AWS, but in the future works with Azure and Google Cloud.
