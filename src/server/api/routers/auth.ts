import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
      }),
  });
  