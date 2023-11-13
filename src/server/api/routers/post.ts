import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Zod Validaition =================================
const FormInput = z.object({
  formName: z.string(),
  formSection: z.array(z.number()), // Assuming formSection is an array of numbers
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
      formSection: [0],
    };

    // Validate the input against the FormCreateInput type
    const validInput = FormInput.parse(inputData);

    console.log("Form is created?")

    return ctx.db.form.create({
      data: validInput,
    });
  }),
  // ==========================================
  //READ FORMS==================================
  getAllForms: publicProcedure.query(async ({ ctx }) => {
    const forms = await ctx.db.form.findMany();
    const allForms = forms.map((form) => Form.parse({formId: form.formId, formName:form.formName, formCreated: form.createdAt}));
    console.log("GET ALL FORMS WAS CALLED")
    console.log(allForms)
    return allForms;
  }),
  //============================================
  //UPDATE FORMS================================
  updateForm: publicProcedure.input(Form).mutation(async ({ ctx, input }) => {
    if (!input || input.formId) {
      throw new Error("Form not found");
    }

    let formUpdateData = {
      formName: input.formName,
      formCreated: input.formCreated,
    };

    // Fetch the current task with its associated contentId
    const formFound = await ctx.db.form.findUnique({
      where: { formId: input.formId },
    });

    if (!formFound) {
      throw new Error("Task not found");
    }

    if (input.formName){

    }
    const form = await ctx.db.form.update({
      where: {
        formId: input.formId,
      },
      data: {
        formName: input.formName,
      },
    });

    return Form.parse(form);
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
