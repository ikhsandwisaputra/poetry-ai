import { Mail, Pencil, BrainCircuit } from 'lucide-react';

const suggestions = [
  {
    icon: <Pencil className="h-6 w-6 text-gray-600" strokeWidth={1.5} />,
    text: '"Write a poem about a brief encounter at a rainy station, where two strangers exchange smiles before the train separates them."',
  },
  {
    icon: <Mail className="h-6 w-6 text-gray-600" strokeWidth={1.5} />,
    text: '"Write a short story about someone who finds an old book in a small library. Every time he opens its pages, memories of his past resurface with vivid clarity."',
  },
  {
    icon: <BrainCircuit className="h-6 w-6 text-gray-600" strokeWidth={1.5} />,
    text: "Write a short story about a child who tries to find the light of the last candle in the middle of a city trapped in long darkness.",
  },
];

// Definisikan tipe untuk props
type PromptSuggestionProps = {
  onSuggestionClick: (text: string) => void;
};
const PromptSuggestion = ({ onSuggestionClick }: PromptSuggestionProps) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {suggestions.map((item, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(item.text)} // Panggil fungsi dari props
          className="cursor-pointer rounded-xl border border-gray-200 bg-white/60 p-4 text-left transition-all hover:bg-white/80 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <div className="mb-2">{item.icon}</div>
          <p className="text-sm text-gray-700">{item.text}</p>
        </button>
      ))}
    </div>
  );
};

export default PromptSuggestion;