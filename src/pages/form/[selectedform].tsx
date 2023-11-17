import { useRouter } from "next/router";
import React, { ReactNode, useState, useEffect } from "react";
import { api } from "~/utils/api";
import QuestionCreationWizard from "../components/QuestionCreationWizard";
import { error } from "console";
import { set } from "zod";
import FormTitle from "../components/FormTitle";

const Form = () => {
  const router = useRouter();
  let { selectedform: formId} = router.query;
  formId = formId as string;

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <FormTitle formId={formId}/>
      <QuestionCreationWizard formId={formId as string} />
      
    </div>
  );
};

export default Form;
