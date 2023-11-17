import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Zod Validaition =================================
const FormInput = z.object({
  formName: z.string(),
});

const Form = z.object({
  formId: z.string(),
  formName: z.string(),
  formCreated: z.date(),
});
// =================================================

export const postRouter = createTRPCRouter({
  //To test the api
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  //to update to protectedProcedure when you have auth
  //FORM CREATION============================
  createForm: publicProcedure.mutation(async ({ ctx }) => {
    const inputData = {
      formName: "New Form",
    };

    // Validate the input against the FormCreateInput type
    const validInput = FormInput.parse(inputData);

    console.log("Form is created?");

    await ctx.db.form.create({
      data: validInput,
    });

    const latestForm = await ctx.db.form.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
      select: {
        formId: true,
      },
    });

    if (!latestForm) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Form not found",
      });
    }

    console.log(latestForm);

    const newFormSection = await ctx.db.formSection.create({
      data: {
        formId: latestForm.formId,
        sectionName: "New Section",
        sectionDesc: "New Section Description",
      },
    });

    return newFormSection;
  }),

  createSection: publicProcedure
    .input(z.object({ formId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log("MEOW");
      console.log("THIS IS THE FORMID IN SECTION CREATION", input.formId);
      return ctx.db.formSection.create({
        data: {
          formId: input.formId,
          sectionName: "New Section",
          sectionDesc: "New Section Description",
        },
      });
      // const newFormSection = await ctx.db.formSection.create({
      //   data: {
      //     formId: input.formId,
      //     sectionName: "New Section",
      //     sectionDesc: "New Section Description",
      //   },
      // });

      // return newFormSection;
    }),

  // ===========================================
  //READ FORMS==================================
  getAllForms: publicProcedure.query(async ({ ctx }) => {
    const forms = await ctx.db.form.findMany();
    const allForms = forms.map((form) =>
      Form.parse({
        formId: form.formId,
        formName: form.formName,
        formCreated: form.createdAt,
      }),
    );

    return allForms;
  }),

  getFormById: publicProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ ctx, input }) => {
      const form = await ctx.db.form.findUnique({
        where: { formId: input.formId },
      });

      if (!form) {
        throw new Error("Form not found");
      }
      return form;
    }),

  // GET ALL SECTIONS ==========================
  getAllSections: publicProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ ctx, input }) => {
      const sections = await ctx.db.formSection.findMany({
        where: { formId: input.formId },
      });
      return sections;
    }),

  //============================================
  //UPDATE FORMS================================
  updateForm: publicProcedure
    .input(z.object({ formId: z.string(), formName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!input || !input.formId) {
        throw new Error("Form not found");
      }
      let formUpdateData = {
        formName: input.formName,
      };

      // Fetch the current task with its associated contentId
      const formFound = await ctx.db.form.findUnique({
        where: { formId: input.formId },
      });

      if (!formFound) {
        throw new Error("Task not found");
      }

      if (input.formName) {
      }
      return ctx.db.form.update({
        where: {
          formId: input.formId,
        },
        data: {
          formName: input.formName,
        },
      });
    }),
  //============================================
  //FORM DELETION ==============================
  deleteForm: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.form.delete({
        where: {
          formId: input,
        },
      });
    }),
});
