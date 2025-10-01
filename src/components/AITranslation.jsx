// components/AITranslation.jsx
import React, { useState } from 'react';
import { Languages, Copy, Check } from 'lucide-react';
import { useAI } from '../hooks/useAI';

/**
 * AI Translation component
 */
const AITranslation = ({ content }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish');
  const [translatedText, setTranslatedText] = useState('');
  const [copied, setCopied] = useState(false);
  const { loading, translate } = useAI();

  const languages = [
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Korean',
    'Arabic',
    'Hindi',
    'Russian',
    'Dutch'
  ];

  const handleTranslate = async () => {
    const result = await translate(content, selectedLanguage);
    if (result.success) {
      setTranslatedText(result.data);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex gap-2">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <button
          onClick={handleTranslate}
          disabled={loading || !content}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Languages className="w-4 h-4" />
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>

      {translatedText && (
        <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Translation ({selectedLanguage})
            </h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default AITranslation;