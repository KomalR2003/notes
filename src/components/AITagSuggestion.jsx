// components/AITagSuggestion.jsx
import React, { useState } from 'react';
import { Tag, Plus } from 'lucide-react';
import { useAI } from '../hooks/useAI';

/**
 * AI Tag Suggestion component
 */
const AITagSuggestion = ({ content, currentTags = [], onAddTags }) => {
  const [suggestedTags, setSuggestedTags] = useState([]);
  const { loading, getTags } = useAI();

  const handleGetSuggestions = async () => {
    const result = await getTags(content);
    if (result.success) {
      // Filter out tags that are already added
      const newTags = result.data.filter(
        tag => !currentTags.includes(tag.toLowerCase())
      );
      setSuggestedTags(newTags);
    }
  };

  const handleAddTag = (tag) => {
    if (onAddTags) {
      onAddTags([tag]);
    }
    setSuggestedTags(prev => prev.filter(t => t !== tag));
  };

  const handleAddAll = () => {
    if (onAddTags && suggestedTags.length > 0) {
      onAddTags(suggestedTags);
      setSuggestedTags([]);
    }
  };

  return (
    <div>
      <button
        onClick={handleGetSuggestions}
        disabled={loading || !content}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <Tag className="w-4 h-4" />
        {loading ? 'Analyzing...' : 'Suggest Tags'}
      </button>

      {suggestedTags.length > 0 && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Suggested Tags ({suggestedTags.length})
            </h3>
            <button
              onClick={handleAddAll}
              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
            >
              Add All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleAddTag(tag)}
                className="flex items-center gap-1 bg-white border border-blue-200 px-3 py-1 rounded-full text-sm text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AITagSuggestion;