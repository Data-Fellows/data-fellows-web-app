"use client";

import { useToast } from "@/context/ToastContext";
import { getUser, setUser } from "@/helpers";
import ChatInterface from "@/services/bizpilot/ChatInterface";
import ResultsDisplay from "@/services/bizpilot/ResultsDisplay";
import TransitionScreen from "@/services/bizpilot/TransitionScreen";
import { ConversationState, Message } from "@/types/bizpilot";
import {
  SpeechRecognition,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionEvent,
  initSpeechRecognition,
  playAudioStream,
  stopAudioPlayback,
  textToSpeech,
} from "@/utils/bizpilot/audioUtils";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

// Import BizPilot config
const bizPilotConfig = {
  systemPrompt: `<system_prompt>
    <identity>
      You are BizPilot, a trusted business consultant who genuinely cares about helping owners succeed.
      You listen first, empathise with challenges, and build rapport naturally.
    </identity>

    <conversation_approach>
      • Show genuine interest in their journey  
      • Relate to struggles with empathy  
      • Build trust through authentic conversation, not interrogation  
      • Position yourself as a growth partner, not a data collector
    </conversation_approach>

    <conversation_flow>
      Engage in a natural, empathetic dialogue that uncovers—within ~4–5 exchanges—  
      1️⃣ Their current relationship with business data (if any)  
      2️⃣ Tools they use and how well they work  
      3️⃣ Specific challenges with data or operations  
      4️⃣ Business goals and their definition of success  

      <timing>After 4–5 back-and-forths, shift to offering insights.</timing>
    </conversation_flow>

    <conversation_style>
      • Provide immediate, observation-level value (mini-insights, pattern spotting)  
      • Connect their situation to broader business opportunities  
      • Never echo the user's words verbatim—always add unique value  
      • Speak as an experienced consultant who's seen similar cases  
      • Keep technical jargon minimal while maximising strategic context
    </conversation_style>

    <natural_discovery>
      Elicit information indirectly with prompts like:  
        – "Tell me about your biggest business challenges right now."  
        – "What keeps you up at night about your business?"  
        – "How are you currently tracking performance?"  
        – "What would make day-to-day operations smoother?"  
      Let their answers guide you; avoid direct tool checklists.
    </natural_discovery>
  </system_prompt>`,
  initialGreeting:
    "Hello! I'm BizPilot, your AI business consultant. I'm here to understand your business challenges and help you discover opportunities for growth. Let's start with what's on your mind - what are the biggest challenges you're facing in your business right now?",
};

interface BizPilotStepProps {
  setPage: (page: number) => void;
}

export default function BizPilotStep({ setPage }: BizPilotStepProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [state, setState] = useState<ConversationState>({
    messages: [
      {
        role: "system",
        content: bizPilotConfig.systemPrompt,
      },
      {
        role: "assistant",
        content: bizPilotConfig.initialGreeting,
      },
    ],
    problems: [],
    conversationStage: "introduction",
    isProcessing: false,
    isListening: false,
    hasEnoughInfo: false,
    pendingAudio: undefined,
    sessionStarted: false,
  });
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [transcription, setTranscription] = useState("");
  const [interactionEnabled, setInteractionEnabled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // For silence detection
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef("");
  const silenceThreshold = 2000; // 2 seconds of silence before stopping

  const [showDashboard, setShowDashboard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [chatClosed, setChatClosed] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  // Load mute preference from localStorage on component mount
  useEffect(() => {
    const savedMutePreference = localStorage.getItem("bizpilot-muted");
    if (savedMutePreference === "true") {
      setIsMuted(true);
    }
  }, []);

  // Toggle mute function
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem("bizpilot-muted", newMutedState.toString());

    // If muting while audio is playing, stop the audio
    if (newMutedState && isPlayingAudio) {
      stopAudio();
    }
  };

  useEffect(() => {
    // Only initialize speech recognition, don't set up event handlers here
    recognitionRef.current = initSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array to run only once

  const stopListening = (skipSendingMessage = false) => {
    // Clear any silence detection timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    // First set listening state to false to prevent onend handler from firing
    setState((prev) => ({ ...prev, isListening: false }));

    // Stop the recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }

    // Process the final transcript if we have one and are not skipping sending message
    if (!skipSendingMessage && transcription.trim()) {
      // Use setTimeout to break the call stack
      setTimeout(() => {
        handleSendMessage(transcription);
        setTranscription("");
      }, 10);
    } else if (skipSendingMessage) {
      setTranscription("");
    }
  };

  useEffect(() => {
    if (transcription) {
      // Reset silence detection
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      // Set new silence detection timeout
      silenceTimeoutRef.current = setTimeout(() => {
        console.log("Silence detected, stopping listening");
        if (state.isListening && recognitionRef.current) {
          stopListening();
        }
      }, silenceThreshold);
    }
  }, [transcription, state.isListening, stopListening]);

  // Start conversation and enable voice interaction
  const startInteractiveSession = async () => {
    // Request microphone permission first
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");
    } catch (err) {
      console.error("Microphone permission denied:", err);
      alert(
        "Microphone permission is required for voice interaction. Please allow microphone access."
      );
    }

    setInteractionEnabled(true);
    setState((prev) => ({ ...prev, sessionStarted: true }));

    // Play welcome message only if not muted
    const firstMessage = state.messages.find((m) => m.role === "assistant");
    if (firstMessage && !isMuted) {
      try {
        setIsPlayingAudio(true);
        const audioStream = await textToSpeech(firstMessage.content);
        if (audioStream) {
          await playAudioStream(audioStream);
          setIsPlayingAudio(false);
          // Removed automatic startListening() - users must manually activate mic
        }
      } catch (error) {
        console.error("Error playing welcome message:", error);
        setIsPlayingAudio(false);
        // Removed automatic startListening() - users must manually activate mic
      }
    }
    // Removed else clause that automatically started listening when muted
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      console.error("Speech recognition is not supported or not initialized");
      return;
    }

    if (state.isListening || state.isProcessing) {
      console.log(
        "Already listening or processing, not starting another session"
      );
      return;
    }

    try {
      // First make sure any existing session is properly stopped
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.log("Error aborting previous recognition:", e);
        }
      }

      console.log("Starting speech recognition...");

      // Recreate the recognition instance to ensure a fresh start
      recognitionRef.current = initSpeechRecognition();

      if (!recognitionRef.current) {
        console.error("Failed to reinitialize speech recognition");
        return;
      }

      // Reset silence detection
      lastTranscriptRef.current = "";
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      // Re-attach event handlers
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        console.log("Speech recognition result received", event);
        const transcript = Array.from(
          Array.from(
            { length: event.results.length },
            (_, i) => event.results[i]
          )
        )
          .map((result) => result[0]?.transcript || "")
          .join("");
        setTranscription(transcript);
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        // Only update state if we're still in listening mode
        // This prevents race conditions with other state updates
        if (state.isListening) {
          setState((prev) => ({ ...prev, isListening: false }));
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        // Ignore aborted errors - these happen when we manually stop recognition
        if (event.error === "aborted") {
          console.log(
            "Speech recognition was aborted - this is expected behavior when stopping"
          );
          return;
        }

        console.error("Speech recognition error:", event);
        console.error("Error type:", event.error);

        // Handle specific error types
        if (event.error === "not-allowed") {
          alert(
            "Microphone access was denied. Please allow microphone access in your browser settings and refresh the page."
          );
        } else if (event.error === "network") {
          console.error("Network error in speech recognition");
        }

        // Update state
        setState((prev) => ({ ...prev, isListening: false }));

        // Try to restart listening after a short delay for non-critical errors
        if (event.error && !["not-allowed", "aborted"].includes(event.error)) {
          setTimeout(() => {
            if (!state.isListening && !state.isProcessing) {
              console.log("Attempting to restart after error:", event.error);
              startListening();
            }
          }, 1000);
        }
      };

      setTranscription("");
      recognitionRef.current.start();
      console.log("Speech recognition started successfully");
      setState((prev) => ({ ...prev, isListening: true }));
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      alert(
        "There was an error starting the microphone. Please refresh and try again."
      );
    }
  };

  const stopAudio = () => {
    stopAudioPlayback();
    setIsPlayingAudio(false);
  };

  const handleSendMessage = async (message: string) => {
    // First ensure we stop listening but skip sending message to prevent recursion
    if (state.isListening && recognitionRef.current) {
      stopListening(true); // Pass true to skip sending message
    }

    // Stop any playing audio
    stopAudio();

    // Wait a moment for cleanup
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 100);
    });

    // Add user message to state
    const updatedMessages: Message[] = [
      ...state.messages,
      { role: "user", content: message },
    ];

    setState((prev) => ({
      ...prev,
      messages: updatedMessages,
      isProcessing: true,
      isListening: false, // Ensure we're not listening while processing
    }));

    try {
      // Count user messages to force conclusion after 4-5 exchanges
      const userMessageCount = updatedMessages.filter(
        (msg) => msg.role === "user"
      ).length;

      let messagesToSend = [...updatedMessages];

      // After 4-5 user messages, prompt the AI to ask for confirmation
      if (userMessageCount >= 4) {
        messagesToSend = [
          {
            role: "system",
            content: `The user has now sent ${userMessageCount} messages. You should wrap up the conversation by acknowledging what they've shared and asking: "Based on what you've shared, I have some great recommendations for you. Ready to see them?" Do not ask any more exploratory questions.`,
          },
          ...updatedMessages,
        ];
      }

      // Send messages to the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messagesToSend }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = data.response;

      // Check if the assistant is asking for confirmation to show recommendations
      const isAskingForConfirmation =
        assistantMessage.content.toLowerCase().includes("ready to see") ||
        assistantMessage.content.toLowerCase().includes("recommendations") ||
        userMessageCount >= 5;

      const newMessages: Message[] = [...updatedMessages, assistantMessage];

      // Update the UI with the response
      setState((prev) => ({
        ...prev,
        messages: newMessages,
        isProcessing: false,
        conversationStage: isAskingForConfirmation
          ? "confirmation"
          : prev.conversationStage,
      }));

      // Automatically play the response only if not muted
      try {
        if (!isMuted) {
          setIsPlayingAudio(true);
          const audioStream = await textToSpeech(assistantMessage.content);
          if (audioStream) {
            await playAudioStream(audioStream);
            setIsPlayingAudio(false);
          }
        }
      } catch (error) {
        console.error("Error with audio response:", error);
        setIsPlayingAudio(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setState((prev) => ({
        ...prev,
        isProcessing: false,
      }));
    }
  };

  const handleConfirmEnd = async () => {
    // Add a confirmation message from the user
    const confirmationMessage: Message = {
      role: "user",
      content: "Yes, show me the recommendations!",
    };

    const updatedMessages = [...state.messages, confirmationMessage];

    setState((prev) => ({
      ...prev,
      messages: updatedMessages,
      hasEnoughInfo: true,
      conversationStage: "conclusion",
    }));

    // Generate problems
    generateProblems(updatedMessages);
  };

  const handleContinueChat = async () => {
    // Add a message indicating user wants to continue
    const continueMessage: Message = {
      role: "user",
      content: "I have a bit more to share first.",
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, continueMessage],
      conversationStage: "exploration",
      isProcessing: true,
    }));

    try {
      // Send a message to the AI to continue the conversation briefly
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "The user wants to share a bit more. Ask ONE follow-up question to clarify what they want to add, then you MUST wrap up and ask if they are ready to see recommendations.",
            },
            ...state.messages,
            continueMessage,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = data.response;

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isProcessing: false,
      }));

      // Play audio response if not muted
      if (!isMuted) {
        try {
          setIsPlayingAudio(true);
          const audioStream = await textToSpeech(assistantMessage.content);
          if (audioStream) {
            await playAudioStream(audioStream);
            setIsPlayingAudio(false);
          }
        } catch (error) {
          console.error("Error playing audio:", error);
          setIsPlayingAudio(false);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setState((prev) => ({
        ...prev,
        isProcessing: false,
      }));
    }
  };

  const generateProblems = async (messages: Message[]) => {
    setChatClosed(true);
    setShowTransition(true);
    setState((prev) => ({
      ...prev,
      isProcessing: true,
    }));

    try {
      // Save the conversation before generating problems
      const conversationToSave = {
        messages: messages.filter((m) => m.role !== "system"), // Don't save system messages
        context: "onboarding",
        timestamp: new Date().toISOString(),
      };

      // Save to localStorage as backup
      try {
        localStorage.setItem(
          "bizpilot-conversation",
          JSON.stringify(conversationToSave)
        );
        console.log("Conversation saved to localStorage");
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }

      // Also try to save to API
      try {
        const saveResponse = await fetch("/api/bizpilot/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(conversationToSave),
        });

        if (!saveResponse.ok) {
          console.error("Failed to save conversation to API");
        } else {
          console.log("Conversation saved to API successfully");
        }
      } catch (error) {
        console.error("Error saving conversation to API:", error);
      }

      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate problems");
      }

      const data = await response.json();

      console.log("suggestions", data);

      // Optional: Save suggested problems to backend (commented out until endpoint is implemented)
      /*
      try {
        const { saveSuggestedProblems } = await import('@/api/problems');
        await saveSuggestedProblems({ suggestions: data.problems });
        console.log("Suggested problems saved successfully");
      } catch (error) {
        console.error("Failed to save suggested problems:", error);
        showToast("Failed to save suggested problems", "error");
      }
      */

      // Call structure extraction API after problems are generated
      try {
        const structureRes = await fetch("/api/problems/structure", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages, generatedProblems: data.problems }),
        });
        if (structureRes.ok) {
          const structureData = await structureRes.json();
          console.log("Structured Extraction:", structureData.structuredResult);

          const profileResponse = await fetch("/api/profile/employer-details", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(structureData.structuredResult),
          });

          if (!profileResponse.ok) {
            console.error("Failed to update employer profile");
          }
        } else {
          console.error("Failed to extract structure");
        }
      } catch (err) {
        console.error("Error calling structure extraction API:", err);
      }

      // Mark user as fully onboarded after BizPilot completion
      try {
        const onboardingResponse = await fetch("/api/profile/mark-onboarded", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ onboarded: true }),
        });

        if (onboardingResponse.ok) {
          // Update local user data using helper function
          const user = getUser();
          if (user) {
            const updatedUser = { ...user, onboarded: true };
            setUser(updatedUser);
          }
          console.log("User marked as onboarded successfully");
        } else {
          console.error("Failed to mark user as onboarded");
        }
      } catch (err) {
        console.error("Error marking user as onboarded:", err);
      }

      setState((prev) => ({
        ...prev,
        problems: data.problems,
        isProcessing: false,
        conversationStage: "results",
      }));

      // Add a delay to show transition screen for at least 2 seconds before continuing to next step
      setTimeout(() => {
        setShowTransition(false);
        // Move to completion step
        setPage(2);
      }, 2000);
    } catch (error) {
      console.error("Error generating problems:", error);
      setState((prev) => ({
        ...prev,
        isProcessing: false,
      }));
      setShowTransition(false);
    }
  };

  return showOnboarding ? (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#e8eef2] to-white">
      <div className="flex h-[500px] flex-col items-center justify-center rounded-xl bg-white p-12 shadow-2xl">
        <h2 className="mb-4 text-3xl font-bold text-[#1d3f51]">
          Welcome to BizPilot
        </h2>
        <p className="mb-8 max-w-xl text-center text-lg text-gray-700">
          BizPilot is your AI-powered business consultant. Get tailored advice
          and solutions for your business challenges in just a few quick steps.
        </p>
        <button
          onClick={() => setShowOnboarding(false)}
          className="rounded-lg bg-[#1d3f51] px-8 py-4 text-xl font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#2c5875]"
        >
          Next
        </button>
      </div>
    </main>
  ) : (
    <main className="min-h-screen bg-gradient-to-br from-[#e8eef2] to-white">
      <header className="bg-gradient-to-r from-[#1d3f51] to-[#2c5875] py-8 text-white shadow-lg">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white p-2 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#1d3f51]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3-2a1 1 0 00-1 1v5a1 1 0 102 0v-5a1 1 0 00-1-1zm-3 3a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">BizPilot</h1>
                  <p className="text-[#c9dae6]">Your AI Business Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Show chat interface unless dashboard is shown */}
          {!showDashboard && (
            <div className="mb-12">
              <div className="h-[600px] overflow-hidden rounded-xl shadow-2xl">
                {!interactionEnabled ? (
                  <div className="flex h-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white p-8 text-center shadow-2xl">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#e8eef2]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-[#1d3f51]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="mb-4 text-2xl font-bold text-gray-800">
                      Ready to get started?
                    </h2>
                    <p className="mb-8 max-w-lg text-gray-600">
                      BizPilot will ask you a few questions about your business
                      to understand your needs and suggest tailored solutions.
                    </p>
                    <button
                      onClick={startInteractiveSession}
                      className="flex items-center space-x-3 rounded-lg bg-[#1d3f51] px-8 py-4 text-xl font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#2c5875]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Start Interactive Session</span>
                    </button>
                  </div>
                ) : showTransition ? (
                  <TransitionScreen />
                ) : (
                  <ChatInterface
                    messages={state.messages.filter((m) => m.role !== "system")}
                    onSendMessage={handleSendMessage}
                    isProcessing={state.isProcessing}
                    isListening={state.isListening}
                    onToggleListen={() =>
                      state.isListening ? stopListening() : startListening()
                    }
                    chatClosed={chatClosed}
                    isPlayingAudio={isPlayingAudio}
                    onStopAudio={stopAudio}
                    isMuted={isMuted}
                    onToggleMute={toggleMute}
                    showConfirmation={
                      state.conversationStage === "confirmation"
                    }
                    onConfirmEnd={handleConfirmEnd}
                    onContinueChat={handleContinueChat}
                    showFaqSuggestions={false}
                  />
                )}
              </div>
              {/* Processing spinner/message */}
              {interactionEnabled && state.isListening && (
                <div className="mt-6 rounded-lg border border-[#c9dae6] bg-white p-4 text-center shadow-md">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="relative">
                      <div className="absolute h-4 w-4 animate-ping rounded-full bg-red-500 opacity-75"></div>
                      <div className="relative h-4 w-4 rounded-full bg-red-500"></div>
                    </div>
                    <p className="font-medium text-gray-700">Listening...</p>
                  </div>
                  <p className="mt-2 max-h-20 overflow-y-auto text-sm text-gray-600">
                    {transcription}
                  </p>
                </div>
              )}
              {state.isProcessing && (
                <div className="mt-6 rounded-lg border border-[#c9dae6] bg-white p-4 text-center shadow-md">
                  <div className="flex items-center justify-center space-x-2">
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-[#1d3f51]"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-[#1d3f51]"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-[#1d3f51]"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Processing your response...
                  </p>
                </div>
              )}
            </div>
          )}
          {/* Show the dashboard/results only if showDashboard is true */}
          {showDashboard && (
            <div className="transform transition-all duration-500">
              <div className="mb-8 flex flex-col items-center">
                <button
                  onClick={() => setShowDashboard(false)}
                  className="mb-4 rounded-lg bg-gray-200 px-6 py-2 font-medium text-[#1d3f51] shadow transition-all duration-200 hover:bg-gray-300"
                >
                  ← Back to Chat
                </button>
              </div>
              <ResultsDisplay problems={state.problems} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
