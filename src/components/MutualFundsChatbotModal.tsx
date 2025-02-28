import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import SpeechRecognition from "./dashboard/SpeechRecognition";

interface Message {
  type: 'user' | 'bot';
  content: string;
}

interface MutualFundsChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MutualFundsChatbotModal({ isOpen, onClose }: MutualFundsChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/suggest-mutual-fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        type: 'bot',
        content: data.suggestion || "Sorry, I couldn't process that request."
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "Sorry, something went wrong. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Mutual Funds Assistant</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4 border rounded-md">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-lg p-3 ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  {message.type === 'bot' ? (
                    <ReactMarkdown
                      className="prose dark:prose-invert max-w-none"
                      components={{
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-4 mb-2" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-md font-semibold mt-3 mb-1" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2" {...props} />,
                        li: ({node, ...props}) => <li className="my-1" {...props} />,
                        hr: ({node, ...props}) => <hr className="my-4" {...props} />,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about mutual funds..."
            disabled={isLoading}
          />
          <SpeechRecognition 
            onResult={(text) => setInput((prev) => prev + " " + text)}
            onStart={() => setInput("")}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}