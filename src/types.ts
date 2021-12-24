import { EntityManager } from "@mikro-orm/postgresql";
import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";

export type MyContext = {
  // req: Request & { session: Session & Partial<SessionData> & {
  //     userId: number | null};
  //   };
  req: Request & { session?: Session & { userId?: number } };
  res: Response;
  em: EntityManager;
  redis: Redis;
};
