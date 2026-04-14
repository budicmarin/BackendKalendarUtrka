"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = exports.client = void 0;
exports.connectDB = connectDB;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGO_URI;
if (!uri) {
    console.error("Nedostaje MONGO_URI u .env datoteci.");
    process.exit(1);
}
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
exports.client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
let db;
async function connectDB() {
    try {
        // Connect the client to the server
        await exports.client.connect();
        // Send a ping to confirm a successful connection
        await exports.client.db().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        db = exports.client.db(); // Uses database named in the URI, e.g. "kalendar_utrka"
    }
    catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
}
const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};
exports.getDB = getDB;
//# sourceMappingURL=db.js.map