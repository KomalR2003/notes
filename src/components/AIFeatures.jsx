// components/AIFeatures.jsx - Version History Removed
import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import GlossaryHighlight from './GlossaryHighlight';
import AISummary from './AISummary';
import AITagSuggestion from './AITagSuggestion';
import GrammarCheck from './GrammarCheck';
import AITranslation from './AITranslation';
import AIInsights from './AIInsights';

/**
 * AI Features panel component
 */
const AIFeatures = ({ content, onAddTags, onApplyCorrection }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-50 border border-purple-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-purple-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold text-purple-700">AI Features</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-purple-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-600" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-purple-200">
          {/* Row 1: Summary & Glossary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3"> Summary</h3>
              <AISummary content={content} />
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3"> Glossary</h3>
              <GlossaryHighlight content={content} />
            </div>
          </div>

          {/* Row 2: Tags & Grammar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3"> Tag Suggestions</h3>
              <AITagSuggestion content={content} onAddTags={onAddTags} />
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3"> Grammar Check</h3>
              <GrammarCheck content={content} onApplyCorrection={onApplyCorrection} />
            </div>
          </div>

          {/* Row 3: Translation */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3"> Translation</h3>
            <AITranslation content={content} />
          </div>

          {/* Row 4: AI Insights */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3"> AI Insights</h3>
            <AIInsights content={content} />
          </div>

         
        </div>
      )}
    </div>
  );
};

export default AIFeatures;