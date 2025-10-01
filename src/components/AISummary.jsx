// components/AISummary.jsx
import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { useAI } from '../hooks/useAI';

/**
 * AI Summary component
 */
const AISummary = ({ content }) => {
  const [summary, setSummary] = useState('');
  const [copied, setCopied] = useState(false);
  const { loading, summarize } = useAI();

  const handleSummarize = async () => {
    const result = await summarize(content);
    if (result.success) {
      setSummary(result.data);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <button
        onClick={handleSummarize}
        disabled={loading || !content}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <FileText className="w-4 h-4" />
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>

      {summary && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-green-900 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Summary
            </h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
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
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default AISummary;