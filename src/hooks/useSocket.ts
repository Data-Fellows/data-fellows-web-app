import { getUser } from "@/helpers";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketProps {
  onNewMessage?: (message: any) => void;
  onUserTyping?: (data: { userId: string; isTyping: boolean }) => void;
}

export const useSocket = ({
  onNewMessage,
  onUserTyping,
}: UseSocketProps = {}) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    socketRef.current = io(socketUrl, {
      withCredentials: true,
    });

    const socket = socketRef.current;
    const currentUser = getUser();

    // Handle connection events
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);

      // Authenticate user with socket
      if (currentUser?._id) {
        socket.emit("authenticate", currentUser._id);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Handle new messages
    if (onNewMessage) {
      socket.on("newMessage", (message) => {
        // Set isCurrentUser flag based on current user
        const messageWithUserFlag = {
          ...message,
          sender: {
            ...message.sender,
            isCurrentUser: message.sender._id === currentUser?._id,
          },
        };
        onNewMessage(messageWithUserFlag);
      });
    }

    // Handle typing indicators
    if (onUserTyping) {
      socket.on("userTyping", onUserTyping);
    }

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, [onNewMessage, onUserTyping]);

  const joinMatch = (matchId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("joinMatch", matchId);
    }
  };

  const leaveMatch = (matchId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("leaveMatch", matchId);
    }
  };

  const sendTyping = (matchId: string, isTyping: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit("typing", { matchId, isTyping });
    }
  };

  return {
    socket: socketRef.current,
    joinMatch,
    leaveMatch,
    sendTyping,
  };
};
