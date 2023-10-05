import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  currentUser: publicProcedure.query(async () => {
    // const userData = await ctx.prisma.user.findFirst({
    //   where: {
    //     id: ctx.session.user.id,
    //   },
    //   include: {
    //     role: true,
    //   },
    // });
    // if (!userData) {
    //   throw new TRPCError({ code: "NOT_FOUND" });
    // }
    return { success: true };
  }),
});
