import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  console.log(orm.em); // access EntityManager via `em` property

  const post = orm.em.create(Post, { title: "my first post" });
  await orm.em.persistAndFlush(post);

  const app = express();
  app.get("/", (_, res) => res.send("Hello Qiang"));
  app.listen(4000, () => console.log("Listening on port 4000"));
};

main();
