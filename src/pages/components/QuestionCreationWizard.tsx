import React, { useState, useEffect } from "react";
import DropdownOpt from "./DropdownOpt";

type Props = {};

const NewQuestion = ({ qnType }: { qnType: string }) => {
  switch (qnType) {
    case "text":
      return <div>text</div>;
    case "number":
      return <div>number</div>;
    case "single":
      return <div>single</div>;
    case "multi":
      return <div>multi</div>;
    default:
      break;
  }
  return (
    <div className="m-4 bg-emerald-300 p-4">
      <h1>
        Question title: <input type="text" />
      </h1>

      <button className="m-3 rounded-md bg-green-400 p-3">Add Question</button>
    </div>
  );
};

const QuestionCreationWizard = (props: Props) => {
  const [qnType, setQnType] = useState<string>("");
  useEffect(() => {
    console.log("qnType", qnType);
  }, [qnType]);

  return (
    <div className="flex flex-col">
      <div className=" flex gap-4 bg-orange-200 p-5">
        <button className="rounded-lg bg-red-100 p-2">+ New Section</button>
        <DropdownOpt setQnType={setQnType} />
      </div>

      <NewQuestion qnType={qnType} />
    </div>
  );
};

export default QuestionCreationWizard;
