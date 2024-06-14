import { createTRPCRouter, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  current: protectedProcedure.query(async ({ ctx }) => {
    return {
      user: ctx.session.user,
      isClient: ctx.isClient,
      isCompany: ctx.isCompany,
      isAdministrator: ctx.isAdministrator,
    };
  }),
});
