import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: "text",unique:true })
  username!: string;

  @Property({ type: "text"})
  password!: string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}