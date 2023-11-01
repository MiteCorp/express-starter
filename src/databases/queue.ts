import kue from "kue"
import dotenv from "dotenv"
import fs from "fs"
process.env.TZ = "Asia/Jakarta"

dotenv.config()

export const queue = kue.createQueue({
    prefix: "jobs",
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: +process.env.REDIS_PORT! || 6379,
        auth: process.env.REDIS_PASSWORD || '',
    }
})

const dispatch = async (name: string, data: any) => {
    const job = queue.create(name, data)
    job.attempts(3)
    job.backoff({ delay: 60 * 1000, type: "fixed" })
    
    job.on("failed", async (err) => {
        console.log(`Job ${job.id} failed with error ${err.message}`)
        fs.appendFileSync("logs/queue.log", `Job ${job.id} failed with error ${err.message}\n`)
    })
    
    job.save()
}

export default dispatch