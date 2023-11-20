import React, { useState } from "react";
import { api } from "~/utils/api";

type Props = {};

const FormCreationWizard = (props: Props) => {
  const ctx = api.useUtils();


  
  const {
    mutate: createFormMutate,
    isLoading: isFormCreateLoading,
    isError: isFormError,
  } = api.post.createForm.useMutation({
    onSuccess: () => {
      console.log("createFormMutate success");
      
      ctx.post.getAllForms.invalidate();
    },
    onError: (error) => {
      console.error(error);
      console.log("createFormMutate error");
    },
  });

  return (
    <div className="h-75 bg-violet-100 p-4">
      <div className="flex justify-center ">
        <div
          className="flex h-40 w-32 flex-col items-center justify-center rounded-md bg-white px-6 py-6 hover:cursor-pointer"
          onClick={() => {
            createFormMutate();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-10 w-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Blank
        </div>
      </div>
    </div>
  );
};

export default FormCreationWizard;
