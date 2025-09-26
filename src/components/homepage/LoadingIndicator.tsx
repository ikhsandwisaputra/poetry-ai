// 📁 components/homepage/LoadingIndicator.tsx
import { Bot } from 'lucide-react';

const LoadingIndicator = () => {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white">
        <Bot size={18} />
      </div>
      <div className="flex items-center gap-2 pt-1.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400 delay-0"></span>
        <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400 delay-150"></span>
        <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400 delay-300"></span>
      </div>
    </div>
  );
};

export default LoadingIndicator;