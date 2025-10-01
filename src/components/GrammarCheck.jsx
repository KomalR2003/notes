// components/GrammarCheck.jsx
import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useAI } from '../hooks/useAI';

/**
 * Grammar Check component
 */
const GrammarCheck = ({ content, onApplyCorrection }) => {
  const [grammarIssues, setGrammarIssues] = useState([]);
  const { loading, checkGrammarErrors } = useAI();

  const handleCheck = async () => {
    const result = await checkGrammarErrors(content);
    if (result.success) {
      setGrammarIssues(result.data);
    }
  };

  const handleApplyFix = (issue) => {
    if (onApplyCorrection) {
      onApplyCorrection(issue.error, issue.correction);
    }
    setGrammarIssues(prev => prev.filter(i => i !== issue));
  };

  return (
    <div>
      <button
        onClick={handleCheck}
        disabled={loading || !content}
        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <CheckCircle className="w-4 h-4" />
        {loading ? 'Checking...' : 'Check Grammar'}
      </button>

      {grammarIssues.length > 0 && (
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4" />
            Issues Found ({grammarIssues.length})
          </h3>
          <div className="space-y-2">
            {grammarIssues.map((issue, index) => (
              <div key={index} className="bg-white rounded p-3 border border-orange-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        {issue.type}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-red-600 line-through">{issue.error}</span>
                      <span className="mx-2">→</span>
                      <span className="text-green-600 font-medium">{issue.correction}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApplyFix(issue)}
                    className="ml-2 px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                  >
                    Fix
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {grammarIssues.length === 0 && !loading && content && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            No grammar issues found!
          </p>
        </div>
      )}
    </div>
  );
};

export default GrammarCheck;