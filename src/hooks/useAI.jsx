import { useState } from 'react';
import {
  summarizeNote,
  suggestTags,
  extractGlossaryTerms,
  checkGrammar,
  translateNote,
  generateInsights
} from '../utils/groqAPI';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic AI call wrapper
  const callAI = async (fn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fn(...args);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Individual AI actions
  const summarize = content => callAI(summarizeNote, content);
  const getTags = content => callAI(suggestTags, content);
  const getGlossary = content => callAI(extractGlossaryTerms, content);
  const checkGrammarErrors = content => callAI(checkGrammar, content);
  const translate = (content, language) => callAI(translateNote, content, language);
  const getInsights = content => callAI(generateInsights, content);

  return {
    loading,
    error,
    summarize,
    getTags,
    getGlossary,
    checkGrammarErrors,
    translate,
    getInsights
  };
};
