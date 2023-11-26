import { useRouter } from "next/router";
import React, { ReactNode, useState, useEffect } from "react";
import { api } from "~/utils/api";
import QuestionCreationWizard from "../../components/QuestionCreationWizard";
import { error } from "console";
import { set } from "zod";
import FormTitle from "../../components/FormTitle";

const Form = () => {
  const router = useRouter();
  let { selectedform: formId} = router.query;
  formId = formId as string;
  const ctx = api.useUtils();

  const {
    mutate: createSectionMutate,
    isLoading: isSectionCreateLoading,
    isError: isSectionError,
  } = api.post.createSection.useMutation({
    onSuccess: () => {
      console.log("createSectionMutate success");
      ctx.post.getAllSections.invalidate();
    },
    onError: (error) => {
      console.error(error);

      console.log("createSectionMutate error");
    },
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 rounded-md">
      <FormTitle formId={formId}/>
      <QuestionCreationWizard formId={formId as string} />

      <button
        className="rounded-md mt-4 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        onClick={() => {
          createSectionMutate({ formId: formId as string });
        }}
      >
        Add Section
      </button>
    </div>
  );
};

export default Form;
