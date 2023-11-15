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

    return ctx.db.form.create({
      data: validInput,
    });
  }),
  // ==========================================
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

  //============================================
  //UPDATE FORMS================================
  updateForm: publicProcedure.input(z.object({formId: z.string(), formName: z.string()})).mutation(async ({ ctx, input }) => {
    if (!input || !input.formId) {
      throw new Error("Form not found");
    }
    let formUpdateData = {
      formName: input.formName
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
