import React from "react";
import { api } from "~/utils/api";
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

  if (sectionLoading) {
    return <div>Loading...</div>;
  }
 
  return (
    <div className="flex flex-col">
      {sectionData?.map((section) => (
        <div key={section.sectionId}>
         <Section sectionData={sectionData} sectionId={section.sectionId} formId={props.formId} sectionTitle={section.sectionName} sectionDesc={section.sectionDesc}/>
        </div>
      ))}
    </div>
  );
};

export default QuestionCreationWizard;
