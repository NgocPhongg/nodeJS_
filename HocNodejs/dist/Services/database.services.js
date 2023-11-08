"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
// tải dotenv để config vào
const dotenv_1 = require("dotenv");
//khi nào có process.env thì phải gọi config()
(0, dotenv_1.config)();
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@atlascluster.eml4bmb.mongodb.net/?retryWrites=true&w=majority`;
class DatabaseService {
    client;
    db;
    constructor() {
        this.client = new mongodb_1.MongoClient(uri);
        this.db = this.client.db(process.env.DB_NAME);
    }
    async connect() {
        try {
            await this.db.command({ ping: 1 });
            console.log('Pinged your deployment. You successfully connected to MongoDB!');
        }
        catch (error) {
            console.log('Error', error);
            throw error;
        }
    }
    get users() {
        return this.db.collection(process.env.DB_USERS_COLECTION);
    }
    get reFreshToken() {
        return this.db.collection(process.env.DB_RESFRESHTOKEN_COLECTION);
    }
    get address() {
        return this.db.collection(process.env.DB_ADDRESS_COLECTIOM);
    }
    get role() {
        return this.db.collection(process.env.DB_ROLE_COLECTIOM);
    }
}
// run().catch(console.dir)
// tạo obj từ class databaseservice
const databaseservice = new DatabaseService();
exports.default = databaseservice;
