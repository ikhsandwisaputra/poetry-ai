'use client'
// src/app/page.tsx
import { AuthForm } from "@/components/loginpage/authForm";
import { IllustrationPane } from "@/components/loginpage/illustrationPane";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Kolom Form, akan memenuhi layar di mobile */}
      <AuthForm />
      
      {/* Kolom Ilustrasi, akan muncul di layar besar */}
      <IllustrationPane />
    </main>
  );
}

