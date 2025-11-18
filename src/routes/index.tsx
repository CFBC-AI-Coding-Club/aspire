import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ECDMovementGame } from "@/components/learning/ECDMovementGame";
import { QuizScreen } from "@/components/learning/QuizScreen";
import { KidDashboard } from "@/components/prototype/KidDashboard";
import { LearningHub } from "@/components/prototype/LearningHub";
import { Onboarding } from "@/components/prototype/Onboarding";
import { Splash } from "@/components/prototype/Splash";
import { WhosUsing } from "@/components/prototype/WhosUsing";
import { Settings } from "@/components/settings/Settings";
import { Wallet } from "@/components/wallet/Wallet";

export const Route = createFileRoute("/")({ component: App });

type Screen =
  | "splash"
  | "whosUsing"
  | "onboarding"
  | "dashboard"
  | "learning"
  | "quiz"
  | "game"
  | "wallet"
  | "settings";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");

  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        setCurrentScreen("whosUsing");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  if (currentScreen === "splash") {
    return <Splash />;
  }

  if (currentScreen === "whosUsing") {
    return <WhosUsing onContinue={() => navigateTo("onboarding")} />;
  }

  if (currentScreen === "onboarding") {
    return <Onboarding onComplete={() => navigateTo("dashboard")} />;
  }

  if (currentScreen === "dashboard") {
    return (
      <KidDashboard
        onNavigateLearn={() => navigateTo("learning")}
        onNavigateWallet={() => navigateTo("wallet")}
        onNavigateSettings={() => navigateTo("settings")}
      />
    );
  }

  if (currentScreen === "learning") {
    return (
      <LearningHub
        onBack={() => navigateTo("dashboard")}
        onStartQuiz={() => navigateTo("quiz")}
        onStartGame={() => navigateTo("game")}
      />
    );
  }

  if (currentScreen === "quiz") {
    return <QuizScreen onBack={() => navigateTo("learning")} />;
  }

  if (currentScreen === "game") {
    return <ECDMovementGame onBack={() => navigateTo("learning")} />;
  }

  if (currentScreen === "wallet") {
    return <Wallet onBack={() => navigateTo("dashboard")} />;
  }

  if (currentScreen === "settings") {
    return <Settings onBack={() => navigateTo("dashboard")} />;
  }

  return null;
}
