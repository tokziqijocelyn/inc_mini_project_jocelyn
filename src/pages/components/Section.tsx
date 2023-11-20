import React, { useState, useEffect, useRef } from "react";
import DropdownOpt from "./DropdownOpt";
import { option } from "../../types";
import { SortableContext } from "@dnd-kit/sortable";
import { api } from "~/utils/api";
import NewQuestionGroupWizard from "./NewQuestionGroupWizard";
type Props = {
  formId: string;
  sectionTitle: string;
  sectionDesc: string;
  sectionId: string;
  sectionData: {
    sectionId: string;
    sectionIndex: number;
    sectionName: string;
    sectionDesc: string;
    formId: string;
  }[];
};

const Section = (props: Props) => {
  const [change, setChange] = useState(false);
  const [sectionTitle, setSectionTitle] = useState<string>(props.sectionTitle);
  const [sectionDesc, setSectionDesc] = useState<string>(props.sectionDesc);
  const [qnOptions, setQnOptions] = useState<option[]>([
    {
      questionId: props.formId,
      optionId: crypto.randomUUID(),
      optionTitle: "New question",
      value: "",
    },
  ]);
  const [qnType, setQnType] = useState<string>("text");
  const [showWizard, setShowWizard] = useState<boolean>(false);
  // This is the id of the question group
  const [newQuestionUUID, setQuestionUUID] = useState(crypto.randomUUID());

  const ctx = api.useUtils();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionTitle(e.target.value);
  };
  const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionDesc(e.target.value);
  };

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

  const {
    mutate: deleteSectionMutate,
    isLoading: isSectionDeleteLoading,
    isError: isSectionDeleteError,
  } = api.post.deleteSection.useMutation({
    onSuccess: () => {
      console.log("delete Section success");
      ctx.post.getAllSections.invalidate();
    },
    onError: (error) => {
      console.error(error);
      console.log("deleteSectionMutate error");
    },
  });

  const {
    mutate: updateSectionMutate,
    isLoading: isSectionUpdateLoading,
    isError: isSectionUpdateError,
  } = api.post.updateSection.useMutation({
    onSuccess: () => {
      console.log("update Section success");
      ctx.post.getAllSections.invalidate();
    },
    onError: (error) => {},
  });

  // useEffect(() => {
  //   console.log("QUESTION OPTIONS", qnOptions);
  // }, [qnOptions]);

  useEffect(() => {
    console.log("This is the length of the section", props.sectionData.length);
  }, [props.sectionData.length]);

  useEffect(() => {
    if (sectionTitle !== props.sectionTitle || sectionDesc !== props.sectionDesc){
      setChange(true);
    }
  }, [sectionDesc, sectionTitle]);

  return (
    <div className="p-3">
      <div className="rounded-md bg-violet-300 p-5">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <input
              type="text"
              value={sectionTitle}
              onChange={handleTitleChange}
              className="bg-violet-300 p-1 text-3xl"
            ></input>
            <input
              type="text"
              value={sectionDesc}
              onChange={handleDescChange}
              className="mb-5 bg-violet-300 p-1"
            ></input>
          </div>
          {change && (
            <div
              onClick={() => {
                updateSectionMutate({
                  sectionId: props.sectionId,
                  sectionName: sectionTitle,
                  sectionDesc,
                });
                setChange(false);
              }}
              className="text-green-800 hover:cursor-pointer"
            >
              Save changes
            </div>
          )}

          {props.sectionData.length > 1 && (
            <div
              className="hover:cursor-pointer"
              onClick={() => deleteSectionMutate(props.sectionId)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </div>
          )}
        </div>

        {/* <SortableContext items={[1, 2, 3]}> */}
        <NewQuestionGroupWizard
          qnType={qnType}
          showWizard={showWizard}
          setShowWizard={setShowWizard}
          newQuestionUUID={newQuestionUUID}
          qnOptions={qnOptions}
          setQnOptions={setQnOptions}
        />
        {/* </SortableContext> */}

        <div className="flex gap-4 p-5">
          <button
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => {
              createSectionMutate({ formId: props.formId });
            }}
          >
            Add Section
          </button>
          <DropdownOpt setQnType={setQnType} setShowWizard={setShowWizard} />
        </div>
      </div>
    </div>
  );
};

export default Section;
