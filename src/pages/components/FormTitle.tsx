

import { useRouter } from "next/router";
import React, { ReactNode, useState, useEffect } from "react";
import { api } from "~/utils/api";
import QuestionCreationWizard from "../components/QuestionCreationWizard";
import { error } from "console";
import { set } from "zod";

type Props = {
    formId: string;
};


const FormTitle = (props: Props): ReactNode => {

  const [change, setChange] = useState(false);

  const { data, isLoading, error } = api.post.getFormById.useQuery({
    formId: props.formId as string,
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
    <div className="bg-violet-600 rounded-md mt-3 mb-3 p-4 text-4xl text-white">
      <input
        type="text"
        className="bg-violet-600 rounded-md p-4"
        value={formName}
        onChange={(e) => {
          handleInputChange(e);
        }}
      />
      {change && <button onClick={handleSaveChanges} className="p-4">Save changes</button>}
    </div>
  );
};

export default FormTitle;