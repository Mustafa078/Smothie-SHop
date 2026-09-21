import chatData from "../../data/chatData";
import { useState } from "react";
import "./chatBot.css";

const findAnswer = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();

  const match = chatData.find((entry) => {
    return entry.keywords.some((keyword) => lowerMessage.includes(keyword));
  });

  return match
    ? match.message
    : "I'm not sure about that — try asking about products, shipping, or orders!";
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    const botReply = findAnswer(input);

    setMessages([
      ...messages,
      { sender: "user", text: input },
      { sender: "bot", text: botReply },
    ]);

    setInput("");
  };

  return (
    <div className="chatbot">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {isOpen ? (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <p
                key={index}
                className={`chat-message chat-message--${msg.sender}`}
              >
                <span className="chat-message__sender">
                  {msg.sender === "user" ? "You" : "Assistant"}:
                </span>{" "}
                {msg.text}
              </p>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              className="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />

            <button className="chat-send" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ChatBot;
