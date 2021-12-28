import { isAuth } from "../middleware/isAuth";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { getConnection } from "typeorm";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(()=>String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 50);
  }

  @Query(() => PaginatedPosts) 
  async posts(
    @Arg("limit", () => Int!) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
      select p.*,
      json_build_object('id', u.id, 'username', u.username) creator
      from post p inner join public.user u on p."creatorId" = u.id
      ${cursor?`where p."createdAt" < $2`: ""}
      order by p."createdAt" DESC
      limit $1
      `,
      replacements
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    }
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Post)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) return null;
    if (typeof title !== "undefined") {
      post.title = title;
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => Int) id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
