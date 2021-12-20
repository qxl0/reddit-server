import { Ctx, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Ctx() { em }: MyContext
  ): Promise<Post[]> {
    return await em.find(Post, {});
  }
}