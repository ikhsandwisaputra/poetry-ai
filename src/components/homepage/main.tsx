// app/page.tsx
'use client';

import ChatCard from '@/components/homepage/chatCard';
import Sidebar from './sidebar';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { type Message } from './chatMessage';
import { useAuth } from '@/context/AuthUserContext';
import { db } from '@/firebase/client';
import { 
  addDoc, 
  collection, 
  serverTimestamp, 
  query, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
   const {  loading, signOut } = useAuth();
    const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
useEffect(() => {
      if (!loading && !user) {
          window.alert('belum login ente')
        router.replace("/login");
      }
    }, [user, loading, router]);
  
    if (loading || !user) {
      return (
        <main style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
          <p>Loading...</p>
        </main>
      );
    };
  // Fungsi untuk memulai chat baru (mereset state)
  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setIsSidebarOpen(false);
  };

  // ==================================================================
  // PERBAIKAN 1: Mengisi penuh logika untuk memuat chat lama
  // ==================================================================
  const handleLoadChat = async (chatId: string) => {
    setIsLoading(true);
    setIsSidebarOpen(false);
    
    try {
      // 1. Ambil semua pesan dari sub-koleksi 'messages' di dalam chat yang dipilih
      const messagesQuery = query(
        collection(db, `chats/${chatId}/messages`),
        orderBy('createdAt', 'asc') // Urutkan dari yang paling lama ke baru
      );
      
      const querySnapshot = await getDocs(messagesQuery);
      
      // 2. Format data ke dalam bentuk yang bisa ditampilkan UI
      const loadedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        loadedMessages.push(doc.data() as Message);
      });
      
      // 3. Update state untuk menampilkan chat yang dimuat
      setMessages(loadedMessages);
      setActiveChatId(chatId);

    } catch (error) {
      console.error("Failed to load chat history:", error);
      alert("Error loading chat. Please try again.");
      handleNewChat(); // Reset jika gagal
    } finally {
      setIsLoading(false);
    }
  };
  
  // ==================================================================
  // PERBAIKAN 2: Memperbarui logika untuk menyimpan SETIAP pesan
  // ==================================================================
  const handleSendMessage = async (messageContent: string) => {
    if (!user) {
      alert("You must be logged in to start a chat.");
      return;
    }

    const userMessage: Message = { role: 'user', content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let currentChatId = activeChatId;

    try {
      // Langkah A: Buat dokumen chat utama jika ini adalah chat baru
      if (!currentChatId) {
        const chatRef = await addDoc(collection(db, 'chats'), {
          userId: user.uid,
          title: messageContent.substring(0, 30) + '...',
          createdAt: serverTimestamp(),
        });
        currentChatId = chatRef.id;
        setActiveChatId(chatRef.id);
      }

      // Langkah B: Simpan pesan dari PENGGUNA ke sub-koleksi
      await addDoc(collection(db, `chats/${currentChatId}/messages`), {
        ...userMessage,
        createdAt: serverTimestamp(),
      });
      
      // Langkah C: Panggil API OpenAI
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: messageContent }),
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to get response from AI. Status: ' + apiResponse.status);
      }

      const data = await apiResponse.json();
      const aiMessage: Message = { role: 'assistant', content: data.response };

      // Langkah D: Simpan pesan dari AI ke sub-koleksi
      await addDoc(collection(db, `chats/${currentChatId}/messages`), {
        ...aiMessage,
        createdAt: serverTimestamp(),
      });
      
      // Langkah E: Tampilkan pesan AI di UI
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: (error as Error).message || 'Sorry, a critical error occurred.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gray-100">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onLoadChat={handleLoadChat}
        activeChatId={activeChatId}
      />
      <main className="flex flex-1 flex-col transition-all duration-300 md:ml-64">
        <div className="absolute left-4 top-4 z-10 md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-md bg-white p-2 text-gray-800 shadow-md"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
        </div>
        
        <div className="flex h-full flex-1 items-center justify-center p-2 md:p-6">
          <ChatCard
            messages={messages}
            authLoading={authLoading}
            isLoading={isLoading || authLoading}
            onSendMessage={handleSendMessage}
          />
        </div>
      </main>
    </div>
  );
}