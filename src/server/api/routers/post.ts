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
      const newFormSection = await ctx.db.formSection.create({
        data: {
          formId: input.formId,
          sectionName: "New Section",
          sectionDesc: "New Section Description",
        },
      });

      return newFormSection;
    }),

  createQuestion: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
        questionName: z.string(),
        questionDesc: z.string(),
        questionType: z.string(),
        required: z.boolean(),
        formSectionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("This is the input!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", input);

      return ctx.db.question.create({
        data: {
          questionId: input.questionId,
          questionName: input.questionName,
          questionDesc: input.questionDesc,
          questionType: input.questionType,
          required: input.required,
          formSectionId: input.formSectionId,
        },
      });
    }),

  createOption: publicProcedure
    .input(
      z.object({
        optionTitle: z.string(),
        value: z.string(),
        questionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("This is the input!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", input);
      const options = await ctx.db.questionOptions.create({
        data: {
          optionTitle: input.optionTitle,
          value: input.value,
          questionId: input.questionId,
        },
      });

      console.log(options);
      return options;
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

  getAllQuestionsBySections: publicProcedure
    .input(z.object({ sectionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const questions = await ctx.db.question.findMany({
        where: { formSectionId: input.sectionId },
      });
      return questions;
    }),

  getAllOptionsByQuestions: publicProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const options = await ctx.db.questionOptions.findMany({
        where: { questionId: input.questionId },
      });
      return options;
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

  updateSection: publicProcedure
    .input(
      z.object({
        sectionId: z.string(),
        sectionName: z.string(),
        sectionDesc: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input || !input.sectionId) {
        throw new Error("Section not found");
      }

      return ctx.db.formSection.update({
        where: {
          sectionId: input.sectionId,
        },
        data: {
          sectionName: input.sectionName,
          sectionDesc: input.sectionDesc,
        },
      });
    }),

  updateQuestion: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
        questionName: z.string(),
        questionDesc: z.string(),
        required: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input || !input.questionId) {
        throw new Error("Question not found");
      }

      return ctx.db.question.update({
        where: {
          questionId: input.questionId,
        },
        data: {
          questionName: input.questionName,
          questionDesc: input.questionDesc,
          required: input.required,
        },
      });
    }),

  updateOptions: publicProcedure
    .input(
      z.object({
        optionTitle: z.string(),
        optionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input || !input.optionId) {
        throw new Error("Question not found");
      }

      return ctx.db.questionOptions.update({
        where: {
          optionId: input.optionId,
        },
        data: {
          optionTitle: input.optionTitle,
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
  deleteSection: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.formSection.delete({
        where: {
          sectionId: input,
        },
      });
    }),
});
