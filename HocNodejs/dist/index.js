"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./Routes/user.routes"));
const database_services_1 = __importDefault(require("./Services/database.services"));
const error_middleware_1 = require("./Middlewares/error.middleware");
const cors_1 = __importDefault(require("cors"));
const imageMedias_routes_1 = __importDefault(require("./Routes/imageMedias.routes"));
const file_1 = require("./Utils/file");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
database_services_1.default.connect();
const port = process.env.PORT || 4000;
// console.log(options.development)
// minimits
// console.log(process.argv)
app.use(express_1.default.json());
app.use('/user', user_routes_1.default);
app.use('/imageMedias', imageMedias_routes_1.default);
app.use(error_middleware_1.defaultErrorHandler);
// tạo folder upload
(0, file_1.initFolder)();
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
