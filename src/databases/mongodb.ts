import dotenv from "dotenv"
import * as mongo from "mongodb"

dotenv.config()

export const collection = {}

const mongoDB = async () => {
    const client = await mongo.MongoClient.connect(process.env.MONGO_URI || "mongodb://localhost:27017")

    const db = client.db(process.env.MONGO_DB || "test")

    Object.keys(collection).forEach((key) => {
        collection[key] = db.collection(key)
    })

    console.log("MongoDB connected")
}

export default mongoDB