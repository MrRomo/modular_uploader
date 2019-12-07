const aws = require('aws-sdk');
const sharp = require('sharp')
const uuid = require('uuid/v4')

class uploader_s3 {
    constructor(env) {
        this.s3client = new aws.S3({
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

    async crop(data, { width, height }) {
        return await sharp(data).resize({ width, height }).toBuffer()

    }
    async convert(data, format) {
        return await sharp(data).toFormat(format).toBuffer()
    }
    async prepare(data, params) {
        data = await this.crop(data, params.size)
        data = await this.convert(data, params.format)
        params.filename = uuid() + '.' + params.format
        params.key = params.path + '/' + params.filename //ruta del archivo
        this.uploadParams.Body = data
        this.uploadParams.Key = params.key
        params.bucket = this.uploadParams.Bucket
        return { database: params, params: this.uploadParams }
    }
    async upload(data, params) {
        params = await this.prepare(data, params)
        console.log('Tamaño de la foto:', Math.round(params.params.Body.byteLength / 1024), ' KB')

        const res = await new Promise((resolve, reject) => {
            this.s3client.upload(params.params, (err, data) => {
                if (err == null) {
                    console.log(`File uploaded successfully. ${data.Location}`);
                    resolve(params.database)
                } else {
                    params.database.result = err
                    reject(params.database)
                }
            })
        })
        return res
    }
}

module.exports = { uploader_s3 }



