"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Loader2,
  Leaf,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "👋 Hi there! I'm **Fikra**, your gardening assistant. How can I help you today?\n\nI can help you with:\n• Finding the perfect gardening products\n• Learning about regenerative gardening\n• Understanding our vendor program\n• Answering questions about orders",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response, timestamp: new Date() },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm sorry, something went wrong. Please try again.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    "Tell me about regenerative gardening",
    "How do I become a vendor?",
    "What's your commission rate?",
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg"
          size="icon"
        >
          <Bot className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
        </Button>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
        </span>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-64 shadow-xl cursor-pointer" onClick={() => setIsMinimized(false)}>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Bot className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Fikra</p>
              <p className="text-xs text-gray-500 truncate">Click to continue chat</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 shrink-0">
              {messages.length}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed z-50 transition-all duration-300 ease-in-out",
      isMaximized 
        ? "inset-4 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[550px] sm:h-[700px]" 
        : "bottom-0 right-0 w-full sm:bottom-6 sm:right-6 sm:w-[420px] h-[75vh] sm:h-auto"
    )}>
      <Card className="h-full shadow-2xl flex flex-col overflow-hidden border-emerald-100">
        <CardHeader className="p-4 bg-emerald-600 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-base">Fikra</CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <p className="text-emerald-100 text-[10px] sm:text-xs">Gardening Assistant • Online</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10 hidden sm:flex"
                onClick={() => {
                  setIsMaximized(!isMaximized);
                  if (isMinimized) setIsMinimized(false);
                }}
                title={isMaximized ? "Restore" : "Maximize"}
              >
                {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline text-xl leading-none -mt-1">—</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10 ml-0.5"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col bg-white">
          {/* Messages */}
          <ScrollArea className={cn(
            "flex-1",
            isMaximized ? "h-full" : "h-[350px] sm:h-[450px]"
          )} ref={scrollRef}>
            <div className="p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
                    msg.role === "user" && "justify-end"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-emerald-600" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 max-w-[85%] shadow-sm",
                      msg.role === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/50"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <p className={cn(
                      "text-[10px] mt-1 opacity-70",
                      msg.role === "user" ? "text-right" : "text-left"
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-tl-none border border-gray-200/50">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce font-bold"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100">
              <p className="text-[10px] uppercase font-semibold text-gray-400 mb-2 tracking-wider">Suggested for you</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors shadow-sm"
                    onClick={() => {
                      setInput(action);
                      setTimeout(() => sendMessage(), 100);
                    }}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2 items-center">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 h-10 border-gray-200 focus:border-emerald-500 focus-visible:ring-emerald-500 rounded-full px-4 text-sm"
                disabled={loading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="bg-emerald-600 hover:bg-emerald-700 h-10 w-10 rounded-full shrink-0 shadow-md"
                size="icon"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
              <Leaf className="h-3 w-3 text-emerald-400" />
              Powered by Fikrago AI • Optimized for all devices
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
