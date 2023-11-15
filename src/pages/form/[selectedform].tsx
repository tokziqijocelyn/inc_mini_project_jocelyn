import { useRouter } from "next/router";
import React, { ReactNode, useState, useEffect } from "react";
import { api } from "~/utils/api";
import QuestionCreationWizard from "../components/QuestionCreationWizard";
import { error } from "console";
import { set } from "zod";

type Props = {};
type FormTitleProps = {
  name: string;
  setFormName: React.Dispatch<React.SetStateAction<string>>;
};

const FormTitle = (): ReactNode => {
  const router = useRouter();
  const { selectedform: formId } = router.query;

  const [change, setChange] = useState(false);

  const { data, isLoading, error } = api.post.getFormById.useQuery({
    formId: formId as string,
  });

  if (!data && !isLoading) return <div></div>;
  const [formName, setFormName] = useState<string>("");
  const [id, setId] = useState<string>("");
  useEffect(() => {
    if (data) {
      setFormName(data.formName as string);
      setId(data.formId as string);
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value);
    console.log(formName);
    setChange(true);
  };

  const {
    mutate: updateFormName,
    isLoading: isUpdating,
    error: updateError,
  } = api.post.updateForm.useMutation();

  const handleSaveChanges = () => {
    console.log("save changes");
    // const {mutate, isLoading, error} = api.post.updateForm.useMutation({formId: id  , formName: formName});
    updateFormName({ formId: id, formName: formName });
    setChange(false);
  };

  return (
    <div className="bg-red-100 p-4">
      FORM TITLE:
      <input
        type="text"
        value={formName}
        onChange={(e) => {
          handleInputChange(e);
        }}
      />
      {change && <button onClick={handleSaveChanges}>Save changes</button>}
    </div>
  );
};

const Form = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <FormTitle />
      <QuestionCreationWizard />
    </div>
  );
};

export default Form;
