import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({unique: true})
  username!: string;

  @Field()
  @Column({unique: true})
  password!: string;

  @Field()
  @Column({unique: true})
  email!: string;

  @OneToMany(()=> Post, (post)=>post.creator)
  posts: Post[];

  @OneToMany(()=> Updoot, (updoot)=>updoot.user)
  updoots: Updoot[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date = new Date();
}