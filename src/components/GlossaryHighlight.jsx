
import React, { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { useAI } from '../hooks/useAI';

const GlossaryHighlight = ({ content, onHighlight }) => {
  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { loading, getGlossary } = useAI();

  const handleExtract = async () => {
    const result = await getGlossary(content);
    if (result.success) {
      setGlossaryTerms(result.data);
      setIsOpen(true);
      if (onHighlight) {
        onHighlight(result.data);
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleExtract}
        disabled={loading || !content}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <Lightbulb className="w-4 h-4" />
        {loading ? 'Analyzing...' : 'Highlight Terms'}
      </button>

      {/* Glossary Panel */}
      {isOpen && glossaryTerms.length > 0 && (
        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-purple-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Key Terms ({glossaryTerms.length})
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-purple-200 rounded transition-colors"
            >
              <X className="w-4 h-4 text-purple-600" />
            </button>
          </div>
          <div className="space-y-3">
            {glossaryTerms.map((item, index) => (
              <div key={index} className="bg-white rounded p-3 border border-purple-100">
                <div className="font-medium text-purple-900 mb-1">{item.term}</div>
                <div className="text-sm text-gray-600">{item.definition}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlossaryHighlight;