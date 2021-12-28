"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const constants_1 = require("./constants");
const ioredis_1 = __importDefault(require("ioredis"));
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const main = async () => {
    const conn = await (0, typeorm_1.createConnection)({
        type: "postgres",
        database: "lireddit4",
        username: "postgres",
        password: "password",
        logging: true,
        synchronize: true,
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        entities: [Post_1.Post, User_1.User],
    });
    console.log("conn is ", conn.isConnected);
    await conn.runMigrations();
    const app = (0, express_1.default)();
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default();
    app.use((0, express_session_1.default)({
        name: "qid",
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
        },
        saveUninitialized: false,
        secret: "asdfasdfasdfasdf",
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [post_1.PostResolver, user_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res, redis }),
    });
    apolloServer.applyMiddleware({
        app,
        cors: { origin: "http://localhost:3000", credentials: true },
    });
    app.listen(4000, () => console.log("Listening on port 4000"));
};
main();
//# sourceMappingURL=index.js.map