"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Minimize2, Maximize2 } from "lucide-react";

const RESPONSES: Record<string, string> = {
  default: "I'm AkiraUshi Aki's AI assistant. Ask me about skills, projects, or how to get in touch!",
  hi: "Hey there! 👋 I'm the portfolio AI. What would you like to know about AkiraUshi Aki?",
  hello: "Hello! Welcome to AkiraUshi Aki's portfolio. Feel free to ask me anything!",
  skills: "AkiraUshi Aki is skilled in React, Next.js, TypeScript, TailwindCSS, Framer Motion, GSAP, Three.js, Node.js, and more!",
  projects: "Check out the Projects section! You'll find work like Quantum Dashboard, Aura E-Commerce, and Neon Wallet.",
  contact: "You can reach AkiraUshi Aki via the Contact form below, or head to the Contact section. Email is always welcome!",
  experience: "AkiraUshi Aki has worked at top companies including Apple, Stripe, and Linear — building world-class frontend experiences.",
  hire: "AkiraUshi Aki is available for freelance and full-time opportunities! Scroll to the Contact section or press Ctrl+K to quickly navigate.",
  tech: "The tech stack includes Next.js 16, React 19, TypeScript, TailwindCSS v4, Framer Motion, GSAP, and Three.js!",
  github: "You can find the GitHub profile linked in the dock at the bottom of the page!",
  about: "AkiraUshi Aki is a Fresh Graduate with a passion for frontend development, creating clean, modern, and visually stunning digital experiences."
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const key of Object.keys(RESPONSES)) {
    if (key !== "default" && lower.includes(key)) {
      return RESPONSES[key];
    }
  }
  return RESPONSES.default;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

let msgId = 0;

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: msgId++,
      role: "assistant",
      text: "Hi! I'm your AI assistant. Ask me about skills, projects, or how to collaborate! 🚀"
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput("");

    const newMsg: Message = { id: msgId++, role: "user", text: userText };
    setMessages((prev) => [...prev, newMsg]);

    setTyping(true);
    setTimeout(() => {
      const replyText = getBotReply(userText);
      setMessages((prev) => [...prev, { id: msgId++, role: "assistant", text: replyText }]);
      setTyping(false);
    }, 800);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Trigger button */}
      {!open && (
        <motion.button
          id="ai-assistant-toggle"
          onClick={() => setOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 5.5, type: "spring" }}
          className="fixed left-4 bottom-24 z-[400] w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg hover:shadow-indigo-500/25 hover:scale-105 transition-all"
          aria-label="Open AI Assistant"
        >
          <Bot className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed left-4 bottom-24 z-[450] w-80 sm:w-96 bg-[#0c0d12]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all ${
              minimized ? "h-14" : "h-[420px]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">AkiraUshi&apos;s AI Assistant</h4>
                  <p className="text-[10px] font-mono text-green-400">● Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-white/40">
                <button
                  id="ai-minimize-btn"
                  onClick={() => setMinimized(!minimized)}
                  className="p-1 hover:text-white transition-colors"
                  aria-label={minimized ? "Maximize chat" : "Minimize chat"}
                >
                  {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  id="ai-close-btn"
                  onClick={() => setOpen(false)}
                  className="p-1 hover:text-white transition-colors"
                  aria-label="Close AI Assistant"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!minimized && (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                          m.role === "user"
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-white/[0.05] border border-white/[0.08] text-white/90 rounded-bl-none"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {typing && (
                    <div className="flex justify-start">
                      <div className="bg-white/[0.05] border border-white/[0.08] px-3.5 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 bg-indigo-400/60 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Quick Prompts */}
                <div className="px-4 pb-2 flex gap-2 flex-wrap">
                  {["Skills", "Projects", "Hire me"].map((prompt) => (
                    <button
                      key={prompt}
                      id={`ai-prompt-${prompt.toLowerCase().replace(" ", "-")}`}
                      onClick={() => setInput(prompt)}
                      className="text-[10px] px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.06]">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-white/20 transition-colors"
                    aria-label="Chat input"
                  />
                  <button
                    id="ai-send-btn"
                    onClick={sendMessage}
                    className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 transition-colors shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
