import React, { useState, useEffect, useRef } from "react";
import DropdownOpt from "./DropdownOpt";
import { option } from "../../types";
import { SortableContext } from "@dnd-kit/sortable";
import { api } from "~/utils/api";
import NewQuestionGroupWizard from "./NewQuestionGroupWizard";
import Section from "./Section";

type Props = {
  formId: string;
};

const QuestionCreationWizard = (props: Props) => {
  const {
    data: sectionData,
    isLoading: sectionLoading,
    error: sectionError,
  } = api.post.getAllSections.useQuery({ formId: props.formId });

 
  return (
    <div className="flex flex-col">
      {sectionData?.map((section) => (
        <div className="bg-orange-200" key={section.sectionId}>
         <Section newQuestionUUID={props.formId} sectionTitle={section.sectionName} sectionDesc={section.sectionDesc}/>
        </div>
      ))}

      <h1>MEOW</h1>
      {/* <div className="bg-orange-200">
        <SortableContext items={[1, 2, 3]}>
          <NewQuestionGroupWizard
            qnType={qnType}
            showWizard={showWizard}
            setShowWizard={setShowWizard}
            newQuestionUUID={newQuestionUUID}
            qnOptions={qnOptions}
            setQnOptions={setQnOptions}
          />
        </SortableContext>
        <div className=" flex gap-4 bg-orange-200 p-5">
          <button className="rounded-lg bg-red-100 p-2">+ New Section</button>
          <DropdownOpt setQnType={setQnType} setShowWizard={setShowWizard} />
        </div>
      </div> */}
    </div>
  );
};

export default QuestionCreationWizard;
