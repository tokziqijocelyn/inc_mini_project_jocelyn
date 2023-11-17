import React, { useState, useEffect, useRef } from "react";
import DropdownOpt from "./DropdownOpt";
import { option } from "../../types";
import { SortableContext } from "@dnd-kit/sortable";
import { api } from "~/utils/api";
import NewQuestionGroupWizard from "./NewQuestionGroupWizard";
type Props = {
  newQuestionUUID: string;
  sectionTitle: string;
  sectionDesc: string;
};

const Section = (props: Props) => {
  const [qnOptions, setQnOptions] = useState<option[]>([
    {
      questionId: props.newQuestionUUID,
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

  useEffect(() => {
    console.log("QUESTION OPTIONS", qnOptions);
  }, [qnOptions]);

  return (
    <div>
      <div className="rounded-md bg-violet-300 p-5">
        <div className="p-1 text-3xl">{props.sectionTitle}</div>
        <div className="mb-5 p-1">{props.sectionDesc}</div>

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
          <button className="rounded-md bg-red-100 p-1" onClick={()=>{createSectionMutate({formId: newQuestionUUID})}}>
            + New Section
          </button>
          <DropdownOpt setQnType={setQnType} setShowWizard={setShowWizard} />
        </div>
      </div>
    </div>
  );
};

export default Section;
