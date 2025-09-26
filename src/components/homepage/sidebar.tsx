// components/Sidebar.tsx
'use client';

import { clsx } from 'clsx';
import { Plus, MessageSquare, X, MoreHorizontal, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthUserContext';
import { db } from '@/firebase/client';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useEffect, useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onLoadChat: (chatId: string) => void;
  activeChatId: string | null;
};

type ChatHistory = {
  id: string;
  title: string;
};

const Sidebar = ({ isOpen, onClose, onNewChat, onLoadChat, activeChatId }: SidebarProps) => {
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  // Mengambil data riwayat secara real-time dari Firestore
  useEffect(() => {
    if (user?.uid) {
      const q = query(
        collection(db, 'chats'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const history: ChatHistory[] = [];
        querySnapshot.forEach((doc) => {
          history.push({ id: doc.id, title: doc.data().title });
        });
        setChatHistory(history);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleDeleteChat = async (chatId: string) => {
    // Ganti window.confirm dengan custom modal jika diperlukan di production
    if (window.confirm('Are you sure you want to delete this chat history?')) {
      try {
        await deleteDoc(doc(db, 'chats', chatId));
      } catch (error) {
        console.error("Error deleting chat: ", error);
        alert("Failed to delete chat.");
      }
    }
  };

  return (
    <>
      {/* Overlay untuk mobile, menutupi seluruh layar */}
      <div
        className={clsx(
          'fixed inset-0 z-20 bg-black/60 transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      {/* Konten Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 flex w-64 transform flex-col bg-gray-800 text-white transition-transform duration-300 ease-in-out',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1 p-2">
            {chatHistory.map((chat) => (
              <div key={chat.id} className="group relative flex items-center">
                <button
                  onClick={() => onLoadChat(chat.id)}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white",
                    chat.id === activeChatId ? "bg-gray-700 text-white" : ""
                  )}
                >
                  <MessageSquare size={16} className="shrink-0" />
                  <span className="truncate flex-1">{chat.title}</span>
                </button>

                {/* Wrapper Menu 3 Titik */}
                <Menu as="div" className="absolute right-2">
                  <Menu.Button className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-600 group-hover:opacity-100">
                    <MoreHorizontal size={16} />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    {/* 👇 PERBAIKAN UTAMA ADA DI SINI 👇 */}
                    <Menu.Items className="absolute right-0 top-full z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="p-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button onClick={() => handleDeleteChat(chat.id)} className={clsx('group flex w-full items-center rounded-md px-2 py-2 text-sm', active ? 'bg-red-500 text-white' : 'text-gray-900')}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-700 p-2">
          <button onClick={onNewChat} className="flex w-full items-center justify-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-700">
            <Plus size={16} />
            New Chat
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
