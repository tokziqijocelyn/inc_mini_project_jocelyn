import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { api } from "~/utils/api";
import QuestionCreationWizard from "../components/QuestionCreationWizard";

type Props = {};

const FormTitle = (): ReactNode => {
  const { data, isLoading } = api.post.getFormById.useQuery({
    formId: "clox3yfd80000ureglk39kd0b",
  });

  return (
    <div className="bg-red-100 p-4">
      FORM TITLE: {data ? data.formName : "no data found"}
    </div>
  );
};

const Form = () => {
  const router = useRouter();
  const { selectedform: formId } = router.query;

  if (!formId) {
    return <div>Not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <FormTitle />
      <QuestionCreationWizard />
    </div>
  );
};

export default Form;
