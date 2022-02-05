import { useState } from "react";
import QuestionChoice from "./QuestionChoice";
import QuestionEssay from "./QuestionEssay";

function SurveyCreateFormBody({ register, unregister, nowCategory }) {
  const [questions, setQuestions] = useState([]);
  const [qCnt, setQCnt] = useState(1);

  const handleQuestionChoiceAdd = () => {
    setQuestions([...questions, { id: qCnt, type: "1" }]);
    setQCnt((state) => state + 1);
  };

  const handleQuestionChoiceFiveAdd = () => {
    setQuestions([...questions, { id: qCnt, type: "1" }]);
    setQCnt((state) => state + 1);
  };

  const handleQuestionEssayAdd = () => {
    setQuestions([...questions, { id: qCnt, type: "2" }]);
    setQCnt((state) => state + 1);
  };

  const handleQuestionDelete = (inputId) => {
    setQuestions(questions.filter((q) => q.id !== inputId));
    unregister(`Q${inputId}`);
    unregister(`Q${inputId}E`);
    setQCnt((state) => state + 1);
  };

  const paintQuestions = questions.map((q) => {
    return (
      <div key={q.id} className="d-flex align-items-start">
        {q.type === "1" ? (
          <QuestionChoice
            unregister={unregister}
            register={register}
            q={q}
            category={nowCategory}
          />
        ) : (
          <QuestionEssay unregister={unregister} register={register} q={q} />
        )}
        <button
          className="btn material-icons p-0"
          onClick={() => handleQuestionDelete(q.id)}
        >
          highlight_off
        </button>
      </div>
    );
  });

  return (
    <div className="w-100 d-flex flex-column survey-form-body mt-3">
      {paintQuestions}
      <div className="p-2 d-flex justify-content-center gap-2 mt-3">
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={handleQuestionChoiceFiveAdd}
        >
          <span>5지선다</span>
          <span className="material-icons">add_circle_outline</span>
        </button>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={handleQuestionChoiceAdd}
        >
          <span>객관식</span>
          <span className="material-icons">add_circle_outline</span>
        </button>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={handleQuestionEssayAdd}
        >
          <span>주관식</span>
          <span className="material-icons">add_circle_outline</span>
        </button>
      </div>
    </div>
  );
}

export default SurveyCreateFormBody;
