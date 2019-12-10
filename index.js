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
    async prepare(data, { path, format, size }) {
        data = await this.crop(data, size)
        data = await this.convert(data, format)
        const uploadParams = this.uploadParams
        const database = {}
        const filename = uuid() + '.' + format
        database.filename = filename
        uploadParams.Key = database.Key = path + '/' + filename //ruta del archivo
        uploadParams.Body = data
        database.Bucket = uploadParams.Bucket
        database.path = path
        database.size = Math.round(data.byteLength / 1024)

        const result = {
            database,
            uploadParams,
            result: null,
            error: null
        }
        return result
    }
    async upload(data, params) {
        try {
            const result = await this.prepare(data, params)
            console.log('Tamaño de la foto:', Math.round(result.database.size), ' KB')
            const res = await new Promise((resolve, reject) => {
                this.s3client.upload(result.uploadParams, (err, data) => {
                    if (err == null) {
                        result.result = `File uploaded successfully. ${data.Location}`
                        resolve(result)
                    } else {
                        result.error = err.message
                        reject(result)
                    }
                })
            })
            return res
        } catch (error) {
            return (error.error) ? error : { error };


        }
    }
}

module.exports = { uploader_s3 }



