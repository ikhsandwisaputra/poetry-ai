// src/components/IllustrationPane.tsx
import Image from 'next/image';

export function IllustrationPane() {
  return (
    // Hidden on mobile, flex on large screens
    <aside className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-green-50/50 p-8 rounded-l-3xl">
      <div className="relative w-full max-w-md">
             
        
        {/* Ganti dengan path ke gambar ilustrasi Anda di folder /public */}
        <Image
          src="/login-img.jpg" // Pastikan gambar ada di /public/illustration.svg
          alt="Illustration of a person organizing tasks"
          width={500}
          height={500}
          priority
        />
      </div>
  
    </aside>
  );
}