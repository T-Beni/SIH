import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./AIChat.css";

const MAX_CHARS = 1000;

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Salut! Sunt AI Chat-ul Smart Invoice Hub. Conversațiile nu se salvează. Pot face greșeli, așa că verifică informațiile importante înainte de orice decizie.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();

    if (!trimmed) {
      setError("Nu poți trimite un mesaj gol.");
      return;
    }

    if (trimmed.length > MAX_CHARS) {
      setError(`Mesajul poate avea maximum ${MAX_CHARS} caractere.`);
      return;
    }

    if (isGenerating) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Trebuie să fii conectat pentru a folosi AI Chat.");
      return;
    }

    setError("");

    const userMessage = {
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsGenerating(true);
    scrollToBottom();

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.role !== "system")
            .slice(-12),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "AI-ul nu a putut genera un răspuns.");
        return;
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);

      scrollToBottom();
    } catch {
      setError("Serverul AI nu este disponibil.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="chat-page">
      <div className="chat-card">
        <h1>AI Chat</h1>

        <p className="chat-disclaimer">
          Conversațiile nu se salvează. AI-ul poate face greșeli; responsabilitatea pentru verificarea și prevenirea erorilor revine utilizatorului, nu platformei.
        </p>

        <div className="chat-box">
          {messages.map((message, index) => (
            <div
              className={`message ${
                message.role === "user" ? "user-message" : "ai-message"
              }`}
              key={index}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ))}

          {isGenerating && (
            <div className="message ai-message typing-message">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {error && <div className="chat-error">{error}</div>}

        <div className="chat-counter">
          {input.length}/{MAX_CHARS}
        </div>

        <div className="chat-input">
          <textarea
            value={input}
            placeholder="Scrie un mesaj..."
            maxLength={MAX_CHARS}
            disabled={isGenerating}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            disabled={isGenerating || input.trim().length === 0}
          >
            {isGenerating ? "Se generează..." : "Trimite"}
          </button>
        </div>
      </div>
    </main>
  );
}