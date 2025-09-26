// 📁 components/homepage/ChatMessage.tsx
'use client';

import { Bot, User } from 'lucide-react';
import { clsx } from 'clsx'; // Kita install ini di awal

// Definisikan tipe untuk pesan
export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatMessageProps = {
  message: Message;
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={clsx(
        'flex items-start gap-4 p-4 rounded-lg',
        isUser ? 'bg-gray-100' : 'bg-purple-50' // Warna latar berbeda
      )}
    >
      <div
        className={clsx(
          'flex h-8 w-8 items-center justify-center rounded-full',
          isUser ? 'bg-gray-600 text-white' : 'bg-purple-500 text-white'
        )}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div className="prose prose-sm max-w-none pt-0.5 text-gray-800">
        {/* Kita akan perbaiki formatting markdown nanti jika perlu */}
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;