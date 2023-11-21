import React, { useState, useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { option } from "../../types";
import Switch from "./Switch";
import { api } from "~/utils/api";
import { set } from "zod";

const NewQuestionGroupWizard = ({
  qnType,
  showWizard,
  setShowWizard,
  newQuestionUUID,
  qnOptions,
  setQnOptions,
  sectionId,
  setNewQuestionUUID,
}: {
  qnType: string;
  showWizard: boolean;
  setShowWizard: React.Dispatch<React.SetStateAction<boolean>>;
  newQuestionUUID: string;
  qnOptions: option[];
  setQnOptions: React.Dispatch<React.SetStateAction<option[]>>;
  sectionId: string;
  setNewQuestionUUID: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [qnTitle, setQnTitle] = useState<string>("New Question");
  const [qnDesc, setQnDesc] = useState<string>("New Question");
  const [required, setRequired] = useState<boolean>(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "unique-id",
  });

  const ctx = api.useUtils();

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

  
  const {
    mutate: createQuestionOptions,
    isLoading: isQuestionOptionsCreateLoading,
    isError: isQuestionOptionsCreateError,
  } = api.post.createOption.useMutation({
    onSuccess: () => {
      ctx.post.getAllQuestionsBySections.invalidate();
    },
    onError: (error) => {
      console.error(error);
      console.log("createQuestionOptions error");
    },
  });

  const {
    mutate: createQuestionMutate,
    isLoading: isQuestionCreateLoading,
    isError: isQuestionCreateError,
  } = api.post.createQuestion.useMutation({
    onSuccess: () => {
      qnOptions.map((option) =>
        createQuestionOptions({
          questionId: newQuestionUUID,
          optionTitle: option.optionTitle,
          value: option.value,
        }),
      ),
      setNewQuestionUUID(crypto.randomUUID());
      setQnOptions([
        {
          questionId: newQuestionUUID,
          optionId: "",
          optionTitle: "",
          value: "",
        },
      ]);
      setQnTitle("New Question");
      setQnDesc("New Description");
      ctx.post.getAllQuestionsBySections.invalidate();
    },
    onError: (error) => {
      console.error(error);
      console.log("createQuestionMutate error");
    },
  });


  const createQuestionAndOptions = async () => {
    console.log("Creating Question...", newQuestionUUID);
    createQuestionMutate({
      questionId: newQuestionUUID,
      questionName: qnTitle,
      questionDesc: qnDesc,
      questionType: qnType,
      formSectionId: sectionId,
      required: required,
    });

    console.log("Creating QuestionOptions...", qnOptions);
    await Promise.all(
      qnOptions.map((option) =>
        createQuestionOptions({
          questionId: newQuestionUUID,
          optionTitle: option.optionTitle,
          value: option.value,
        }),
      ),
    );

    ctx.post.getAllOptionsByQuestions.invalidate();

    setNewQuestionUUID(crypto.randomUUID());
    setQnOptions([
      { questionId: newQuestionUUID, optionId: "", optionTitle: "", value: "" },
    ]);
    setQnTitle("New Question");
    setQnDesc("New Description");

    console.log("Finished creating Question and QuestionOptions");
  };

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

  const handleQnTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQnTitle(e.target.value);
  };

  const handleQnDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQnDesc(e.target.value);
  };

  switch (qnType) {
    case "text":
      questionContent = (
        <div>
          <input
            className="m-4 rounded-md border-b p-2"
            placeholder="Long Text answer"
            type="text"
            disabled
          />
        </div>
      );

      break;
    case "number":
      questionContent = (
        <div className="flex gap-4">
          Number Input
          <input type="number" disabled />
        </div>
      );
      break;
    case "single":
      questionContent = (
        <div>
          <div className="flex flex-col justify-start bg-red-300">
            <form>
              {qnOptions.map((option) => {
                return (
                  <div
                    key={option.optionId}
                    className="flex flex-row justify-start gap-3 bg-green-300 p-2"
                  >
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
          <div className="flex flex-col justify-start">
            <form>
              {qnOptions.map((option) => {
                return (
                  <div
                    key={option.optionId}
                    className="flex flex-row justify-start bg-green-300"
                  >
                    <input
                      className="bg-blue-200"
                      type="checkbox"
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
    default:
      questionContent = (
        <div>
          text
          <input className="bg-red-200" type="text" disabled />
        </div>
      );
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
    console.log("QNOPTIONS", qnOptions);
  }, [qnOptions]);

  return (
    <div style={{ display: showWizard ? "block" : "none" }}>
      {/* This div will be appended regardless of the qnType */}
      <div className="m-4 bg-emerald-300 p-4">
        <h1>
          {qnOptions.length}

          <input
            type="text"
            value={qnTitle}
            onChange={handleQnTitleChange}
            className=" m-2 p-3 text-4xl "
          />
          <input
            type="text"
            value={qnDesc}
            onChange={handleQnDescChange}
            className="m-2 mb-10 p-3"
          />
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
        <div className="mt-10 flex gap-4 p-4">
          <div
            className="rounded-md bg-green-300 p-2 hover:cursor-pointer"
            onClick={() => {
              createQuestionMutate({
                questionId: newQuestionUUID,
                questionName: qnTitle,
                questionDesc: qnDesc,
                questionType: qnType,
                formSectionId: sectionId,
                required: required,
              });
              setShowWizard(false);
            }}
          >
            Save Question
          </div>
          <div
            className="rounded-md bg-red-100 p-2 hover:cursor-pointer"
            onClick={() => setShowWizard(false)}
          >
            Cancel Question
          </div>
        </div>
        Required <Switch required={required} setRequired={setRequired} />
      </div>
    </div>
  );
};

export default NewQuestionGroupWizard;
