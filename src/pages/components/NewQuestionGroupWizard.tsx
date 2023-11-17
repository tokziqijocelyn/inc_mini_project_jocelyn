import React, { useState, useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { option } from "../../types";

const NewQuestionGroupWizard = ({
  qnType,
  showWizard,
  setShowWizard,
  newQuestionUUID,
  qnOptions,
  setQnOptions,
}: {
  qnType: string;
  showWizard: boolean;
  setShowWizard: React.Dispatch<React.SetStateAction<boolean>>;
  newQuestionUUID: string;
  qnOptions: option[];
  setQnOptions: React.Dispatch<React.SetStateAction<option[]>>;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "unique-id",
  });

  //==================================================================================================
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

  const handleInputChange = (index: number, valueOfTitle: string) => {
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
          <input className="bg-red-200" type="text" disabled />
        </div>
      );

      break;
    case "number":
      questionContent = (
        <div>
          number <input type="number" disabled />
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
                      disabled
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
                      type="check"
                      name={option.questionId}
                      value={option.value}
                      disabled
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
    <div style={{ display: showWizard ? "block" : "none" }}>
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

export default NewQuestionGroupWizard;
