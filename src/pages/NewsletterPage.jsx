import { useState } from 'react';
import { useSelector } from 'react-redux';
import { newsletterService } from '../services/newsletterService.js';
import { RefreshCw, X } from 'lucide-react';
import HTMLViewer from '../components/HTMLViewer.jsx';

const NewsletterPage = () => {
  const [generatedNewsletter, setGeneratedNewsletter] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const { user } = useSelector(state => state.auth);

  const handleGenerateNewsletter = async () => {
    try {
      setIsGenerating(true);
      setGenerateError(null);
      const response = await newsletterService.generateNewsletter();
      setGeneratedNewsletter(response);
    } catch (err) {
      setGenerateError('Failed to generate newsletter');
      console.error('Error generating newsletter:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Newsletter Generator Header */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Newsletter Generator</h1>
          <p className="text-gray-600 mb-6">
            Generate a personalized newsletter based on your selected topics and interests.
          </p>
          <button
            onClick={handleGenerateNewsletter}
            disabled={isGenerating}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Generating Newsletter...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-2" />
                Generate Newsletter
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Newsletter Section */}
      {generateError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Generation Error</h3>
              <div className="mt-2 text-sm text-red-700">{generateError}</div>
            </div>
          </div>
        </div>
      )}

      {generatedNewsletter && (
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Generated Newsletter</h2>
            <HTMLViewer 
              htmlContent={generatedNewsletter.results} 
              title="Generated Newsletter Preview"
            />
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">
              Status: <span className="font-medium text-green-600">{generatedNewsletter.message}</span>
            </div>
            <div className="text-sm text-gray-600">
              HTML content generated successfully. Click "Preview" above to view the formatted newsletter.
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-primary-50 rounded-xl p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Want to customize your newsletter?
          </h3>
          <p className="text-gray-600 mb-4">
            Make sure to select your preferred topics to receive more personalized content.
          </p>
          <a
            href="/topics"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Manage Topics
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;
