import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import '../App.css';

function GroupChat({ user }) {
  const [groupId, setGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!groupId) return;
    
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`/chat/${groupId}`);
      setMessages(response.data);
    } catch (err) {
      setError(err.response?.data || "Failed to fetch messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !groupId) return;

    setError("");
    try {
      await axios.post(`/chat/${groupId}`, { message });
      setMessage("");
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data || "Failed to send message");
    }
  };

  return (
    <div className="chat-container">
      <h2>Group Chat</h2>
      
      <div className="chat-controls">
        <input
          type="text"
          placeholder="Enter Group ID"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
        <button onClick={fetchMessages} disabled={!groupId}>
          Join Group
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div>Loading messages...</div>}

      {groupId && (
        <>
          <div className="messages-container">
            {messages.length === 0 ? (
              <p>No messages in this group yet.</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="message">
                  <span className="sender">{msg.sender}: </span>
                  <span className="message-text">{msg.message}</span>
                  <span className="timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} className="message-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              required
            />
            <button type="submit" disabled={!message.trim()}>
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default GroupChat;