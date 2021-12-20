import path from "path";
import { Post } from "./entities/Post";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "lireddit4",
  type: "postgresql",
  debug: !__prod__,
  user: "postgres",
  password: "password",
} as Parameters<typeof MikroORM.init>[0];
