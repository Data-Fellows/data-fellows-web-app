/**
 * Backend WebSocket Integration Guide
 * 
 * Add these socket events to your match routes in the backend to enable real-time messaging:
 */

// In your match routes (e.g., when sending a message):

// 1. After successfully saving a message to the database
export const sendMessage = async (req, res) => {
  try {
    // ... existing message saving logic ...
    
    const newMessage = await Message.create({
      // ... message data
    });
    
    // Populate the message with sender details
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'firstName lastName email photoUrl companyName companyLogo')
      .lean();
    
    // Add isCurrentUser flag for each participant
    const io = req.app.get('io');
    const matchParticipants = await Match.findById(matchId).select('employer fellow');
    
    // Emit to all users in the match room
    io.to(matchId).emit('newMessage', {
      ...populatedMessage,
      sender: {
        ...populatedMessage.sender,
        isCurrentUser: false // This will be set correctly on the frontend
      }
    });
    
    res.status(201).json({
      status: "OK",
      data: populatedMessage
    });
  } catch (error) {
    // ... error handling
  }
};

// 2. Add typing indicator events
export const handleTyping = (socket) => {
  socket.on('typing', ({ matchId, isTyping }) => {
    // Broadcast to all other users in the match except the sender
    socket.to(matchId).emit('userTyping', {
      userId: socket.userId, // You'll need to set this when user connects
      isTyping
    });
  });
  
  socket.on('joinMatch', (matchId) => {
    socket.join(matchId);
  });
  
  socket.on('leaveMatch', (matchId) => {
    socket.leave(matchId);
  });
};

// 3. Update your Socket.IO connection handler:
io.on('connection', (socket) => {
  // Store user ID on socket for typing indicators
  socket.on('authenticate', (userId) => {
    socket.userId = userId;
  });
  
  socket.on('joinMatch', (matchId) => {
    socket.join(matchId);
  });
  
  socket.on('leaveMatch', (matchId) => {
    socket.leave(matchId);
  });
  
  socket.on('typing', ({ matchId, isTyping }) => {
    socket.to(matchId).emit('userTyping', {
      userId: socket.userId,
      isTyping
    });
  });
});

/**
 * Frontend Integration Notes:
 * 
 * 1. The useSocket hook handles:
 *    - Connecting to WebSocket
 *    - Joining/leaving match rooms
 *    - Listening for new messages
 *    - Handling typing indicators
 * 
 * 2. Real-time features implemented:
 *    - Instant message delivery
 *    - Typing indicators
 *    - Auto-scroll to new messages
 *    - Company logo display priority
 * 
 * 3. The MessageComponent now:
 *    - Uses React Query for data fetching/caching
 *    - Integrates WebSocket for real-time updates
 *    - Shows typing indicators
 *    - Displays company logos when available
 *    - Handles file uploads
 */
