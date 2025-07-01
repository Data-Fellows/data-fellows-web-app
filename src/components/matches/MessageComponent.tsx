import { Message } from "@/api/match-communication";
import { getUser } from "@/helpers";
import {
  useMatchMessages,
  useSendMessage,
} from "@/hooks/useMatchCommunication";
import { useSocket } from "@/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  CheckCheck,
  FileText,
  Image,
  Paperclip,
  Send,
  Upload,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiLoader } from "react-icons/fi";

interface MessageFile {
  _id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

interface MessageComponentProps {
  matchId: string;
  otherUser: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    photoUrl?: string;
  };
}

export function MessageComponent({
  matchId,
  otherUser,
}: MessageComponentProps) {
  // React Query hooks for fetching and sending messages
  const { messages, isLoading: loading, error } = useMatchMessages(matchId);
  const sendMessageMutation = useSendMessage(matchId);
  const queryClient = useQueryClient();

  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket integration
  const { joinMatch, leaveMatch, sendTyping } = useSocket({
    onNewMessage: useCallback(
      (message: Message) => {
        // Update React Query cache with new message
        queryClient.setQueryData(
          ["messages", matchId],
          (old: Message[] | undefined) => {
            if (!old) return [message];
            return [...old, message];
          }
        );
        scrollToBottom();
      },
      [queryClient, matchId]
    ),
    onUserTyping: useCallback(
      (data: { userId: string; isTyping: boolean }) => {
        if (data.userId !== currentUser?._id) {
          setOtherUserTyping(data.isTyping);
        }
      },
      [currentUser]
    ),
  });

  // Helper function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user);
  }, []);

  // Join match room on component mount
  useEffect(() => {
    if (matchId) {
      joinMatch(matchId);
      return () => {
        leaveMatch(matchId);
      };
    }
  }, [matchId, joinMatch, leaveMatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle typing indicators
  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(matchId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(matchId, false);
    }, 1000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (!newMessage.trim() && selectedFiles.length === 0) ||
      sendMessageMutation.isPending
    )
      return;

    try {
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        sendTyping(matchId, false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }

      await sendMessageMutation.mutateAsync({
        message: newMessage.trim(),
        files: selectedFiles.length > 0 ? selectedFiles : undefined,
      });

      // Clear the form on successful send
      setNewMessage("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Error handling is already done in the mutation's onError callback
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = new Date(message.timestamp).toDateString(); // Use timestamp instead of createdAt
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FiLoader className="h-5 w-5 animate-spin" />
          Loading messages...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Failed to load messages
          </h3>
          <p className="text-sm text-muted-foreground">
            There was an error loading the conversation. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-[600px] bg-background border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card rounded-t-lg">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {otherUser.profilePicture || otherUser.photoUrl ? (
            <img
              src={otherUser.profilePicture || otherUser.photoUrl}
              alt={`${otherUser.firstName} ${otherUser.lastName}`}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-primary" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {otherUser.firstName} {otherUser.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(messageGroups).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                No messages yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Start the conversation by sending a message below.
              </p>
            </div>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, dayMessages]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-full border border-border">
                  {formatDate(date)}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Messages for this date */}
              <div className="space-y-3">
                {dayMessages.map((message, index) => {
                  const isCurrentUser = message.sender.isCurrentUser; // Use sender.isCurrentUser from backend
                  const showAvatar =
                    !isCurrentUser &&
                    (index === 0 ||
                      dayMessages[index - 1]?.sender._id !==
                        message.sender._id); // Use sender._id

                  return (
                    <div
                      key={message._id}
                      className={`flex gap-3 ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isCurrentUser && (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {showAvatar ? (
                            // Prioritize company logo over profile photo
                            message.sender.companyLogo ? (
                              <img
                                src={message.sender.companyLogo}
                                alt={`${
                                  message.sender.companyName ||
                                  message.sender.firstName
                                } ${message.sender.lastName}`}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : message.sender.photoUrl ? (
                              <img
                                src={message.sender.photoUrl}
                                alt={`${message.sender.firstName} ${message.sender.lastName}`}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-4 w-4 text-primary" />
                            )
                          ) : null}
                        </div>
                      )}

                      <div
                        className={`max-w-[70%] ${
                          isCurrentUser ? "order-first" : ""
                        }`}
                      >
                        <div
                          className={`px-4 py-3 rounded-lg ${
                            isCurrentUser
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-card border border-border rounded-bl-sm"
                          }`}
                        >
                          {message.messageType === "offer" && (
                            <div className="flex items-center gap-2 mb-2 text-sm opacity-80">
                              <Paperclip className="h-3 w-3" />
                              Price Offer
                            </div>
                          )}

                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.message}
                          </p>

                          {/* Display Files */}
                          {message.files && message.files.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.files.map((file) => (
                                <div
                                  key={file._id}
                                  className={`flex flex-col rounded-lg p-3 ${
                                    isCurrentUser
                                      ? "bg-primary-foreground/10"
                                      : "bg-gray-50 dark:bg-gray-800"
                                  }`}
                                >
                                  <div className="flex min-w-0 items-center">
                                    <div className="flex-1">
                                      <p
                                        className={`truncate text-sm font-medium ${
                                          isCurrentUser
                                            ? "text-primary-foreground"
                                            : "text-gray-800 dark:text-gray-200"
                                        }`}
                                      >
                                        {file.name}
                                      </p>
                                      <p
                                        className={`text-xs ${
                                          isCurrentUser
                                            ? "text-primary-foreground/70"
                                            : "text-gray-500 dark:text-gray-400"
                                        }`}
                                      >
                                        {file.type.split("/")[1]?.toUpperCase()}{" "}
                                        • {formatFileSize(file.size)}
                                      </p>
                                    </div>
                                    {!file.type.startsWith("image/") && (
                                      <button
                                        onClick={() =>
                                          window.open(file.url, "_blank")
                                        }
                                        className={`ml-2 px-3 py-1 text-xs rounded transition-transform hover:scale-105 ${
                                          isCurrentUser
                                            ? "bg-primary-foreground/20 text-primary-foreground"
                                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                        }`}
                                      >
                                        View
                                      </button>
                                    )}
                                  </div>
                                  {file.type.startsWith("image/") && (
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 block"
                                    >
                                      <img
                                        src={file.url}
                                        alt={`Uploaded image ${file.name}`}
                                        className="h-auto max-w-full rounded-md transition-transform hover:scale-[1.02] hover:shadow-md"
                                      />
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Legacy attachments support - remove since we use files */}
                        </div>

                        <div
                          className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span>{formatTime(message.timestamp)}</span>
                          {isCurrentUser &&
                            (message.readAt ? (
                              <CheckCheck className="h-3 w-3 text-blue-500" />
                            ) : (
                              <Check className="h-3 w-3" />
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {otherUserTyping && (
          <div className="flex items-start gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {otherUser.photoUrl ? (
                <img
                  src={otherUser.photoUrl}
                  alt={`${otherUser.firstName} ${otherUser.lastName}`}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="max-w-[70%]">
              <div className="px-4 py-3 rounded-lg bg-card border border-border rounded-bl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-border bg-card rounded-b-lg"
      >
        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-3 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {selectedFiles.length} file(s) selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedFiles([])}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-background rounded border"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0">
                      {file.type.startsWith("image/") ? (
                        <Image className="h-4 w-4 text-blue-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 text-sm ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTypingStart();
              }}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none bg-background text-foreground"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={sendMessageMutation.isPending}
            />
          </div>

          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={sendMessageMutation.isPending}
            className="h-12 w-12 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Upload className="h-5 w-5" />
          </button>

          <button
            type="submit"
            disabled={
              (!newMessage.trim() && selectedFiles.length === 0) ||
              sendMessageMutation.isPending
            }
            className="h-12 w-12 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {sendMessageMutation.isPending ? (
              <FiLoader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageComponent;
