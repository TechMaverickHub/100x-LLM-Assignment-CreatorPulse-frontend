import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import * as Diff from 'diff';

const DiffViewer = ({ oldContent, newContent, onClose }) => {
  const [diff, setDiff] = useState([]);
  const [expandedSections, setExpandedSections] = useState(new Set());

  useEffect(() => {
    const differences = Diff.diffLines(oldContent || '', newContent || '');
    setDiff(differences);
    
    // Auto-expand all sections by default
    const allSections = new Set(differences.map((_, idx) => idx));
    setExpandedSections(allSections);
  }, [oldContent, newContent]);

  const toggleSection = (idx) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx);
    } else {
      newExpanded.add(idx);
    }
    setExpandedSections(newExpanded);
  };

  const getLineNumbers = (value, startLine) => {
    const lines = value.split('\n');
    return lines.map((_, idx) => startLine + idx);
  };

  let oldLineNum = 1;
  let newLineNum = 1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Code Diff</h3>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Legend */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-red-100 border border-red-300"></span>
              <span className="text-gray-600">Removed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-green-100 border border-green-300"></span>
              <span className="text-gray-600">Added</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-gray-50 border border-gray-200"></span>
              <span className="text-gray-600">Unchanged</span>
            </div>
          </div>

          {/* Diff Content */}
          <div className="flex-1 overflow-auto p-4 bg-gray-50 font-mono text-sm">
            {diff.map((part, idx) => {
              const isAdded = part.added;
              const isRemoved = part.removed;
              const isUnchanged = !isAdded && !isRemoved;

              let bgColor = 'bg-white';
              let borderColor = 'border-gray-200';
              let textColor = 'text-gray-800';
              let linePrefix = ' ';

              if (isAdded) {
                bgColor = 'bg-green-50';
                borderColor = 'border-green-300';
                textColor = 'text-green-900';
                linePrefix = '+';
              } else if (isRemoved) {
                bgColor = 'bg-red-50';
                borderColor = 'border-red-300';
                textColor = 'text-red-900';
                linePrefix = '-';
              }

              const lines = part.value.split('\n').filter((line, i, arr) => {
                // Keep all lines except the last empty one if there are multiple lines
                return i < arr.length - 1 || line !== '';
              });

              const currentOldLineNum = oldLineNum;
              const currentNewLineNum = newLineNum;

              if (!isAdded) oldLineNum += lines.length;
              if (!isRemoved) newLineNum += lines.length;

              return (
                <div key={idx} className={`${bgColor} border ${borderColor} rounded mb-2 overflow-hidden`}>
                  {lines.map((line, lineIdx) => {
                    let displayOldLineNum = '-';
                    let displayNewLineNum = '-';

                    if (isRemoved) {
                      displayOldLineNum = currentOldLineNum + lineIdx;
                    } else if (isAdded) {
                      displayNewLineNum = currentNewLineNum + lineIdx;
                    } else {
                      displayOldLineNum = currentOldLineNum + lineIdx;
                      displayNewLineNum = currentNewLineNum + lineIdx;
                    }

                    return (
                      <div
                        key={lineIdx}
                        className={`flex ${textColor} hover:bg-opacity-75 transition-colors`}
                      >
                        {/* Line Numbers */}
                        <div className="flex-shrink-0 flex">
                          <span className="inline-block w-12 px-2 text-right text-gray-500 select-none border-r border-gray-300">
                            {displayOldLineNum}
                          </span>
                          <span className="inline-block w-12 px-2 text-right text-gray-500 select-none border-r border-gray-300">
                            {displayNewLineNum}
                          </span>
                        </div>
                        {/* Content */}
                        <div className="flex-1 px-2 whitespace-pre-wrap break-all">
                          <span className="select-none mr-2">{linePrefix}</span>
                          {line || ' '}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>Total changes: {diff.filter(p => p.added || p.removed).length} sections</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiffViewer;

