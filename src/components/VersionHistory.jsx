// components/VersionHistory.jsx
import React, { useState } from 'react';
import { History, RotateCcw, Eye, X } from 'lucide-react';

/**
 * Version History component
 */
const VersionHistory = ({ versions = [], onRestore }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getPreview = (html) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  const handleRestore = (versionId) => {
    if (onRestore && window.confirm('Are you sure you want to restore this version?')) {
      onRestore(versionId);
      setIsOpen(false);
      setPreviewVersion(null);
    }
  };

  if (versions.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No version history available
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <History className="w-4 h-4" />
        Version History ({versions.length})
      </button>

      {isOpen && (
        <div className="mt-4 bg-gray-50 border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <History className="w-4 h-4" />
              Previous Versions
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {versions.map((version, index) => (
              <div key={version.id} className="bg-white rounded p-3 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">
                      Version {versions.length - index} • {formatDate(version.timestamp)}
                    </div>
                    <div className="text-sm text-gray-700">
                      {getPreview(version.content)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setPreviewVersion(previewVersion?.id === version.id ? null : version)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    {previewVersion?.id === version.id ? 'Hide' : 'Preview'}
                  </button>
                  <button
                    onClick={() => handleRestore(version.id)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restore
                  </button>
                </div>
                
                {previewVersion?.id === version.id && (
                  <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: version.content }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionHistory;