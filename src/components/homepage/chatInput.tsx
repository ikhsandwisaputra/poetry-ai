// components/homepage/chatInput.tsx
'use client';

import { ArrowRight, Pencil } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type ChatInputProps = {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  isLoading: boolean; // Prop ini sekarang mewakili GABUNGAN loading
  onSendMessage: (message: string) => void;
};

const ChatInput = ({ prompt, setPrompt, isLoading, onSendMessage }: ChatInputProps) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendMessage(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="relative mt-auto w-full">
      <Pencil className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={isLoading ? "Authenticating, please wait..." : "write me a poem or short story!"}
        disabled={isLoading} // disabled jika SALAH SATU loading aktif
        className="w-full rounded-full border border-gray-300 bg-white/80 py-3 pl-11 pr-14 text-gray-800 placeholder-gray-400 transition-all focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gray-800 p-2 text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400"
        aria-label="Send prompt"
        disabled={!prompt.trim() || isLoading}
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </form>
  );
};

export default ChatInput;