import { useState } from 'react';
import { useSelector } from 'react-redux';
import { newsletterService } from '../services/newsletterService.js';
import { RefreshCw, X, Mail, Send } from 'lucide-react';
import HTMLViewer from '../components/HTMLViewer.jsx';

const NewsletterPage = () => {
  const [generatedNewsletter, setGeneratedNewsletter] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(null);
  const { user } = useSelector(state => state.auth);

  const handleGenerateNewsletter = async () => {
    try {
      setIsGenerating(true);
      setGenerateError(null);
      setSendError(null);
      setSendSuccess(null);
      const response = await newsletterService.generateNewsletter();
      setGeneratedNewsletter(response);
    } catch (err) {
      setGenerateError('Failed to generate newsletter');
      console.error('Error generating newsletter:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!generatedNewsletter) {
      setSendError('Please generate a newsletter first');
      return;
    }

    try {
      setIsSending(true);
      setSendError(null);
      setSendSuccess(null);
      
      const recipient = recipientEmail.trim() || null;
      const response = await newsletterService.sendNewsletter(
        generatedNewsletter.results, 
        recipient
      );
      
      setSendSuccess(recipient 
        ? `Newsletter sent successfully to ${recipient}` 
        : 'Newsletter sent successfully'
      );
      setRecipientEmail(''); // Clear the input after successful send
    } catch (err) {
      setSendError('Failed to send newsletter');
      console.error('Error sending newsletter:', err);
    } finally {
      setIsSending(false);
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
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Generated Newsletter</h2>
          </div>
          
          {/* Direct HTML Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Newsletter Preview</span>
                <button
                  onClick={() => {
                    const blob = new Blob([generatedNewsletter.results], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'newsletter.html';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="text-xs px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                >
                  Download HTML
                </button>
              </div>
            </div>
            <div className="h-96 overflow-y-auto">
              <iframe
                srcDoc={generatedNewsletter.results}
                className="w-full h-full border-0"
                title="Newsletter Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}

      {/* Send Newsletter Section */}
      {generatedNewsletter && (
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Send Newsletter</h2>
            <p className="text-sm text-gray-600 mt-1">
              Send the generated newsletter via email. Leave recipient empty to send to default recipients.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="recipient-email" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="recipient-email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Enter recipient email address"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
            
            <button
              onClick={handleSendNewsletter}
              disabled={isSending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Newsletter
                </>
              )}
            </button>
            
            {sendError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center">
                  <X className="h-4 w-4 text-red-400 mr-2" />
                  <span className="text-sm text-red-700">{sendError}</span>
                </div>
              </div>
            )}
            
            {sendSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex items-center">
                  <Send className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-green-700">{sendSuccess}</span>
                </div>
              </div>
            )}
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
