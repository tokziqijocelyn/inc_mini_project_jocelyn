import React, { useState, useEffect, useRef } from "react";
import DropdownOpt from "./DropdownOpt";
import { error } from "console";
import {SortableContext} from '@dnd-kit/sortable';

type Props = {};

const NewQuestionGroupWizard = ({
  qnType,
  showWizard,
  setShowWizard,
}: {
  qnType: string;
  showWizard: boolean;
  setShowWizard: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  //==================================================================================================
  // This is the id of the question group
  const [newQuestionUUID, setQuestionUUID] = useState(crypto.randomUUID());

  type option = {
    questionId: string;
    optionId: string;
    optionTitle: string;
    value: string;
  };

  // This is when the user clicks the add option button
  const addOptionHandler = (optionTitle: string) => {
    setQnOptions([
      ...qnOptions,
      {
        questionId: newQuestionUUID,
        optionId: crypto.randomUUID(),
        optionTitle: "New Question",
        value: "",
      },
    ]);
  };
  let questionContent;

  const [qnOptions, setQnOptions] = useState<option[]>([
    {
      questionId: newQuestionUUID,
      optionId: crypto.randomUUID(),
      optionTitle: "New question",
      value: "",
    },
  ]);

  const handleInputChange = (index: number, valueOfTitle: string) => {
    console.log("meow");
    const newItems = [...qnOptions];

    if (!newItems[index]) {
      return;
    }

    newItems[index] = {
      questionId: newQuestionUUID,
      optionId: newItems[index]?.optionId ?? "",
      optionTitle: valueOfTitle,
      value: newItems[index]?.value ?? "",
    };

    setQnOptions(newItems);
  };

  switch (qnType) {
    case "text":
      questionContent = (
        <div>
          text
          <input className="bg-red-200" type="text" />
        </div>
      );

      break;
    case "number":
      questionContent = (
        <div>
          number <input type="number" />
        </div>
      );
      break;
    case "single":
      questionContent = (
        <div>
          I need them labels boi
          <div className="flex flex-col justify-start bg-red-300">
            <form>
              {qnOptions.map((option) => {
                return (
                  <div
                    key={option.optionId}
                    className="flex flex-row justify-start bg-green-300"
                  >
                    {newQuestionUUID}
                    <input
                      className="bg-blue-200"
                      type="text"
                      value={qnOptions[qnOptions.indexOf(option)]?.optionTitle}
                      onChange={(e) => {
                        handleInputChange(
                          qnOptions.indexOf(option),
                          e.target.value,
                        );
                        console.log("KINDA RUDE CB", e.target.value);
                      }}
                    />
                    <input
                      type="radio"
                      name={option.questionId}
                      value={option.value}
                    />
                  </div>
                );
              })}
            </form>
          </div>
        </div>
      );
      break;

    case "multi":
      questionContent = (
        <div>
          multi NEED LABELS TOO
          <div className="flex flex-col justify-start bg-red-300">
            <form>
              {qnOptions.map((option) => {
                return (
                  <div
                    key={option.optionId}
                    className="flex flex-row justify-start bg-green-300"
                  >
                    <input
                      type="checkbox"
                      name={option.questionId}
                      value={option.value}
                    />
                    <input
                      className="bg-blue-200"
                      type="text"
                      value={qnOptions[qnOptions.indexOf(option)]?.optionTitle}
                      onChange={(e) => {
                        handleInputChange(
                          qnOptions.indexOf(option),
                          e.target.value,
                        );
                        console.log("KINDA RUDE CB", e.target.value);
                      }}
                    />
                  </div>
                );
              })}
            </form>
          </div>
        </div>
      );
      break;
  }

  useEffect(() => {
    setQnOptions([
      {
        questionId: newQuestionUUID,
        optionId: crypto.randomUUID(),
        optionTitle: "New question",
        value: "",
      },
    ]);
  }, [qnType]);

  useEffect(() => {
    console.log("QNOPTIONS", qnOptions[1]?.optionId);
  }, [qnOptions]);

  return (
    <div style={{ visibility: showWizard ? "visible" : "hidden" }}>
      {/* This div will be appended regardless of the qnType */}
      <div className="m-4 bg-emerald-300 p-4">
        <h1>
          Question title: <input type="text" />
        </h1>

        {questionContent}

        {qnType == "multi" || qnType == "single" ? (
          <div>
            <button
              onClick={() => {
                addOptionHandler("This is the label");
              }}
              className="m-3 rounded-md bg-green-400 p-3"
            >
              Add Option
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div>Save Question</div>
      <div className="bg-red-100" onClick={() => setShowWizard(false)}>
        Cancel Question
      </div>
    </div>
  );
};

const QuestionCreationWizard = (props: Props) => {
  const [qnType, setQnType] = useState<string>("text");
  const [showWizard, setShowWizard] = useState<boolean>(false);

  useEffect(() => {
    console.log("qnType", qnType);
  }, [qnType]);

  return (
    <div className="flex flex-col">
      <SortableContext items={[1,2,3]}>
        <div className=" flex gap-4 bg-orange-200 p-5">
          <button className="rounded-lg bg-red-100 p-2">+ New Section</button>
          <DropdownOpt setQnType={setQnType} setShowWizard={setShowWizard} />
        </div>

        <NewQuestionGroupWizard
          qnType={qnType}
          showWizard={showWizard}
          setShowWizard={setShowWizard}
        />
      </SortableContext>
    </div>
  );
};

export default QuestionCreationWizard;
