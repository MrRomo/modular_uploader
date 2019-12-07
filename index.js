const aws = require('aws-sdk');
const sharp = require('sharp')

class uploader_s3 {
    constructor(env) {
        this.client = new aws.S3({
            accessKeyId: env.AWS_ACCESS_KEY,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            region: env.REGION
        })
        this.uploadParams = {
            Bucket: env.Bucket,
            Key: '', // pass key
            Body: null, // pass file body
            ACL: env.ACL
        }
    }
    
    async crop(data,{width,height}){
        return await sharp(data).resize({ width, height }).toBuffer()
        
    }
    async convert(data, format){
        return await sharp(data).toFormat(format).toBuffer()
    }
    async prepare(data,params){        
        data = await this.crop(data,params.size)
        data = await this.convert(data,params.format)        
        return data
    }
    async upload()

}

module.exports = {uploader_s3}



