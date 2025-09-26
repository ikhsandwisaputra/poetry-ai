// 📁 components/homepage/chatHeader.tsx
'use client';

import { Menu, Transition } from '@headlessui/react';
import { Bot, LogOut, Mail, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { Fragment } from 'react';
import { useAuth } from '@/context/AuthUserContext'; // Pastikan path ini benar

const ChatHeader = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bot className="h-7 w-7 text-gray-800" />
        <span className="text-lg font-semibold text-gray-800">Poetry AI</span>
      </div>
      
      {user ? (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 ring-2 ring-white ring-offset-2 ring-offset-gray-100 transition-all hover:ring-purple-400 focus:outline-none">
              <span className="sr-only">Open user menu</span>
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'User Avatar'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-6 w-6 text-gray-600" />
              )}
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.displayName || 'Welcome'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={signOut}
                      className={`${
                        active ? 'bg-purple-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                      Sign Out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      ) : (
        // Tampilan jika user belum login (opsional)
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200">
            <UserIcon className="h-6 w-6 text-gray-500" />
        </div>
      )}
    </header>
  );
};

export default ChatHeader;