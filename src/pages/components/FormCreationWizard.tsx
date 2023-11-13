import React, {useState,} from "react";
import { api } from "~/utils/api";

type Props = {};


const FormCreationWizard = (props: Props) => {
  const {mutate: createFormMutate, isLoading: isFormCreateLoading, isError: isFormError } = api.post.createForm.useMutation()
  const createForm = () =>{
    console.log("createForm button is pressed")
    createFormMutate((), {onSuccess: (data) => {
      console.log("createFormMutate success")
      console.log(data)
    }})
  }


  return (
    <div className="h-75 bg-green-100 p-4 font-sans">
      FormCreationWizard
      <div className="flex justify-center bg-red-500 px-6 py-6 ">
        <div className="flex h-40 w-32 flex-col items-center justify-center rounded-md bg-blue-500 px-6 py-6 hover:cursor-pointer" onClick={createForm}>
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
        </div>
      </div>
    </div>
  );
};

export default FormCreationWizard;
