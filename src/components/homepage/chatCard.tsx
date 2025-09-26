// components/homepage/chatCard.tsx
'use client';

import ChatHeader from './chatHeader';
import PromptSuggestion from './promptSuggestion';
import ChatInput from './chatInput';
import { useAuth } from '@/context/AuthUserContext';
import { useEffect, useRef, useState } from 'react';
import ChatMessage, { type Message } from './chatMessage';
import LoadingIndicator from './LoadingIndicator';

type ChatCardProps = {
  messages: Message[];
  isLoading: boolean;
  authLoading: boolean; // Terima prop baru
  onSendMessage: (message: string) => Promise<void>; // Tipe diubah ke Promise<void>
};

const ChatCard = ({ messages, isLoading, authLoading, onSendMessage }: ChatCardProps) => {

  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSuggestionClick = (text: string) => {
    const cleanedText = text.replace(/^"|"$/g, '');
    setPrompt(cleanedText);
  };

  const handleSendMessageWrapper = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;
    await onSendMessage(messageContent);
    setPrompt('');
  };

  return (
    <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-3xl bg-white/70 p-2 shadow-2xl backdrop-blur-lg md:p-4">
      <ChatHeader />

      <div className="flex flex-1 flex-col gap-8 overflow-hidden px-4">
        {messages.length === 0 ? (
          <div className="my-auto text-center">
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Hello, {user ? user.displayName?.split(' ')[0] : 'Guest'}!
            </h1>
            <p className="mt-4 text-base text-gray-500">
              Start a new chat or select one from your history.
            </p>
            <div className="mt-12">
              <PromptSuggestion onSuggestionClick={handleSuggestionClick} />
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto p-1 pr-2">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        <div className="mt-auto pb-4">
          <ChatInput
            prompt={prompt}
            setPrompt={setPrompt}
            isLoading={isLoading}
            onSendMessage={handleSendMessageWrapper}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatCard;