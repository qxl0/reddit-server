"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const express_1 = __importDefault(require("express"));
const Post_1 = require("./entities/Post");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    console.log(orm.em);
    const post = orm.em.create(Post_1.Post, { title: "my first post" });
    await orm.em.persistAndFlush(post);
    const app = (0, express_1.default)();
    app.get("/", (_, res) => res.send("Hello Qiang"));
    app.listen(4000, () => console.log("Listening on port 4000"));
};
main();
//# sourceMappingURL=index.js.map