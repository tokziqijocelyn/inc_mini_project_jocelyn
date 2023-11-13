import React from "react";

type Props = {};

const NewQuestion = () => {
  return (
    <div className="m-4 bg-emerald-300 p-4">
      <h1>
        Question title: <input type="text" />
      </h1>
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            value="option1"
          />
          Text
        </label>

        <label>
          <input
            type="radio"
            value="option2"
          />
          Number
        </label>

        <label>
          <input
            type="radio"
            value="option3"

          />
          Single Choice
        </label>
        <label>
          <input
            type="radio"
            value="option3"

          />
          Multi-choices
        </label>


      </div>
    </div>
  );
};

const QuestionCreationWizard = (props: Props) => {
  return (
    <div className="flex flex-col">
      <div className=" flex gap-4 bg-orange-200 p-5">
        <button className="rounded-lg bg-red-100 p-2">+ New Question</button>
        <button className="rounded-lg bg-red-100 p-2">+ New Section</button>
      </div>
      <NewQuestion />
    </div>
  );
};

export default QuestionCreationWizard;
