import { Message } from "@/types/bizpilot";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import FaqSuggestions from "./FaqSuggestions";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  isListening: boolean;
  onToggleListen: () => void;
  chatClosed?: boolean;
  isPlayingAudio?: boolean;
  onStopAudio?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  showConfirmation?: boolean;
  onConfirmEnd?: () => void;
  onContinueChat?: () => void;
  showFaqSuggestions?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  isListening,
  onToggleListen,
  chatClosed = false,
  isPlayingAudio = false,
  onStopAudio = () => {},
  isMuted = false,
  onToggleMute = () => {},
  showConfirmation = false,
  onConfirmEnd = () => {},
  onContinueChat = () => {},
  showFaqSuggestions: showFaqSuggestionsProp = true,
}) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if we should show FAQ suggestions
  const userMessages = messages.filter((msg) => msg.role === "user");
  const showFaqSuggestions =
    showFaqSuggestionsProp &&
    userMessages.length === 0 &&
    !isProcessing &&
    !chatClosed &&
    !isTyping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing && !chatClosed) {
      onSendMessage(input);
      setInput("");
      setIsTyping(false);
    }
  };

  const handleFaqSelect = (question: string) => {
    if (!isProcessing && !chatClosed) {
      onSendMessage(question);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white rounded-xl overflow-hidden shadow-2xl border border-gray-100">
      {/* Chat header */}
      <div className="py-4 px-6 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#1d3f51] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">
                BizPilot Assistant
              </h2>
              <p className="text-xs text-gray-500">
                {isPlayingAudio
                  ? "Speaking..."
                  : isListening
                  ? "Listening..."
                  : isProcessing
                  ? "Processing..."
                  : "Online"}
              </p>
            </div>
          </div>

          {/* Mute button */}
          <button
            onClick={onToggleMute}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isMuted
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            aria-label={isMuted ? "Unmute AI speech" : "Mute AI speech"}
            title={isMuted ? "Unmute AI speech" : "Mute AI speech"}
          >
            {isMuted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent">
        {messages.map(
          (message, index) =>
            message.role !== "system" && (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-[#1d3f51] text-white rounded-br-none shadow-md"
                      : "bg-white border border-gray-100 rounded-bl-none shadow-md"
                  }`}
                >
                  <div
                    className={`${
                      message.role === "user" ? "text-white" : "text-gray-800"
                    } text-sm leading-relaxed`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* FAQ Suggestions - positioned above input */}
      <FaqSuggestions
        isVisible={showFaqSuggestions}
        onSelectQuestion={handleFaqSelect}
      />

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-100 bg-white p-4"
      >
        {showConfirmation ? (
          <div className="flex items-center justify-center space-x-4 py-2">
            <button
              type="button"
              onClick={onConfirmEnd}
              className="px-6 py-3 bg-[#1d3f51] text-white rounded-lg hover:bg-[#2c5875] transition-all duration-200 font-medium shadow-md"
              disabled={isProcessing}
            >
              Yes, show me recommendations
            </button>
            <button
              type="button"
              onClick={onContinueChat}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
              disabled={isProcessing}
            >
              I have more to share
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 rounded-full bg-gray-50 px-4 py-2 border border-gray-200 focus-within:border-[#1d3f51] focus-within:ring-2 focus-within:ring-[#e8eef2] transition-all duration-200">
            {isPlayingAudio ? (
              <button
                type="button"
                onClick={onStopAudio}
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-red-500 text-white shadow-md"
                aria-label="Stop audio"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={onToggleListen}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening
                    ? "bg-red-500 text-white shadow-md animate-pulse"
                    : "bg-[#1d3f51] text-white hover:bg-[#2c5875] shadow-md"
                }`}
                disabled={isProcessing || chatClosed}
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
            )}

            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={
                chatClosed
                  ? "Chat ended. I'm preparing some options for you..."
                  : isListening
                  ? "Listening..."
                  : "Type your message..."
              }
              className="flex-1 bg-transparent p-2 focus:outline-none text-gray-700"
              disabled={
                isProcessing || isListening || isPlayingAudio || chatClosed
              }
            />

            <button
              type="submit"
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isProcessing ||
                isListening ||
                isPlayingAudio ||
                !input.trim() ||
                chatClosed
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#1d3f51] text-white hover:bg-[#2c5875] shadow-md"
              }`}
              disabled={
                isProcessing ||
                isListening ||
                isPlayingAudio ||
                !input.trim() ||
                chatClosed
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInterface;
