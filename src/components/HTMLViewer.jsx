import { useState } from 'react';
import { X, Eye, Download } from 'lucide-react';

const HTMLViewer = ({ htmlContent, title = "Newsletter Preview" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-600 hover:text-primary-500 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors"
      >
        <Eye className="h-3 w-3 mr-1" />
        Preview
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-7xl xl:max-w-8xl w-full max-h-[95vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden min-h-0">
            <iframe
              srcDoc={htmlContent}
              className="w-full h-full border-0 min-h-[600px]"
              title={title}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTMLViewer;
