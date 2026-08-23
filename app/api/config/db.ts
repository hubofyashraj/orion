import mongoose from "mongoose";

const uri = process.env.MONGO_URI;

let connection: any = null;

async function connectToMongo() {
    if (connection) return;
    connection = await mongoose.connect(uri as string);
    console.log('database connection successfull');

}

export async function getConnection() {
    if (connection == null) await connectToMongo()
    return connection;
}

