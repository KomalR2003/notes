
import React, { useState } from 'react';
import { Brain, TrendingUp, Smile, Meh, Frown } from 'lucide-react';
import { useAI } from '../hooks/useAI';

/**
 * AI Insights component - provides intelligent recommendations
 */
const AIInsights = ({ content }) => {
  const [insights, setInsights] = useState(null);
  const { loading, getInsights } = useAI();

  const handleGetInsights = async () => {
    const result = await getInsights(content);
    if (result.success) {
      setInsights(result.data);
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="w-5 h-5 text-green-600" />;
      case 'negative':
        return <Frown className="w-5 h-5 text-red-600" />;
      default:
        return <Meh className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div>
      <button
        onClick={handleGetInsights}
        disabled={loading || !content}
        className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <Brain className="w-4 h-4" />
        {loading ? 'Analyzing...' : 'Get AI Insights'}
      </button>

      {insights && (
        <div className="mt-4 bg-pink-50 border border-pink-200 rounded-lg p-4">
          <h3 className="font-semibold text-pink-900 flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4" />
            AI-Driven Insights
          </h3>

          {/* Sentiment */}
          {insights.sentiment && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sentiment Analysis</h4>
              <div className={`flex items-center gap-2 px-3 py-2 rounded border ${getSentimentColor(insights.sentiment)}`}>
                {getSentimentIcon(insights.sentiment)}
                <span className="capitalize font-medium">{insights.sentiment}</span>
              </div>
            </div>
          )}

          {/* Key Points */}
          {insights.keyPoints && insights.keyPoints.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Key Points
              </h4>
              <ul className="space-y-2">
                {insights.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 bg-white rounded p-2 border border-pink-100">
                    <span className="text-pink-600 font-bold mt-0.5">•</span>
                    <span className="text-sm text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {insights.recommendations && insights.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
              <ul className="space-y-2">
                {insights.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 bg-white rounded p-2 border border-pink-100">
                    <span className="text-pink-600 font-bold mt-0.5">→</span>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsights;