import { useState } from "react";
import { ChevronRight, TrendingUp, Target, Award } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: TrendingUp,
      title: "Learn About Money",
      description: "Take fun quizzes and play games to understand how money works",
      color: "#2E8BC0",
    },
    {
      icon: Target,
      title: "Set Savings Goals",
      description: "Create goals and track your progress as you save for what you want",
      color: "#2EC4B6",
    },
    {
      icon: Award,
      title: "Earn Rewards",
      description: "Complete challenges and unlock badges and avatars",
      color: "#FFD447",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = steps[currentStep];

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep ? "w-8 bg-[#2E8BC0]" : "w-2 bg-[#E8EFF2]"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-[24px] p-12 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-center space-y-6">
          {/* Icon */}
          <div
            className="w-32 h-32 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${step.color}, ${step.color}CC)`,
            }}
          >
            <step.icon className="w-16 h-16 text-white" />
          </div>

          {/* Text */}
          <div className="space-y-4">
            <h1 className="text-[#1B262C]">{step.title}</h1>
            <p className="text-[#7D8B91] max-w-md mx-auto">{step.description}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handleSkip}
            className="flex-1 h-14 bg-white text-[#1B262C] rounded-2xl border-2 border-[#E8EFF2] hover:bg-[#F5F7FA] transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 h-14 bg-[#2E8BC0] text-white rounded-2xl hover:bg-[#2579a8] transition-colors flex items-center justify-center gap-2"
          >
            <span>{currentStep === steps.length - 1 ? "Get Started" : "Next"}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
