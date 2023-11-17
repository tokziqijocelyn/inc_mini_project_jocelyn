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

  useEffect(() => {
    console.log("QUESTION OPTIONS", qnOptions);
  }, [qnOptions]);

  return (
    <div>
      {" "}
      <div>
        <div>{props.sectionTitle}</div>
        <div>{props.sectionDesc}</div>

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
        <div className="flex gap-4 bg-orange-200 p-5">
          <button className="rounded-lg bg-red-100 p-2">+ New Section</button>
          <DropdownOpt setQnType={setQnType} setShowWizard={setShowWizard} />
        </div>
      </div>
    </div>
  );
};

export default Section;
