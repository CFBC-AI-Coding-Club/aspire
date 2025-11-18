import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";

interface QuizScreenProps {
  onBack: () => void;
}

export function QuizScreen({ onBack }: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const totalQuestions = 10;

  const question = {
    text: "What is the best way to save money?",
    answers: [
      "Spend everything you earn",
      "Put aside a portion of your money regularly",
      "Only save when you have extra money",
      "Wait until you're older to start saving",
    ],
    correctAnswer: 1,
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete
      alert("Quiz completed!");
      onBack();
    }
  };

  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* App Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#E8EFF2] transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#1B262C]" />
            </button>
            <div>
              <h2 className="text-[#1B262C]">Money Basics Quiz</h2>
              <p className="text-[#7D8B91]">
                Question {currentQuestion} of {totalQuestions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-6 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-2 bg-[#E8EFF2] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2E8BC0] to-[#2EC4B6] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          {/* Question */}
          <div className="bg-white rounded-[20px] p-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <h2 className="text-[#1B262C]">{question.text}</h2>
          </div>

          {/* Answer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`p-6 rounded-[20px] text-left transition-all ${
                  selectedAnswer === index
                    ? "bg-[#2E8BC0] text-white shadow-[0_8px_24px_rgba(46,139,192,0.3)]"
                    : "bg-white text-[#1B262C] shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswer === index
                        ? "border-white bg-white"
                        : "border-[#E8EFF2]"
                    }`}
                  >
                    {selectedAnswer === index && (
                      <Check className="w-4 h-4 text-[#2E8BC0]" />
                    )}
                  </div>
                  <p className={selectedAnswer === index ? "text-white" : "text-[#1B262C]"}>
                    {answer}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`w-full h-14 rounded-2xl transition-all ${
              selectedAnswer !== null
                ? "bg-[#2E8BC0] text-white hover:bg-[#2579a8]"
                : "bg-[#E8EFF2] text-[#7D8B91] cursor-not-allowed"
            }`}
          >
            {currentQuestion === totalQuestions ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
}
