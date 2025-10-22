import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { newsletterService } from '../services/newsletterService.js';
import { draftService } from '../services/draftService.js';
import { RefreshCw, X, Mail, Send, Save, FolderOpen, GitCompare } from 'lucide-react';
import HTMLViewer from '../components/HTMLViewer.jsx';
import DiffViewer from '../components/DiffViewer.jsx';

const NewsletterPage = () => {
  const [generatedNewsletter, setGeneratedNewsletter] = useState(null);
  const [editedHtml, setEditedHtml] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(null);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);
  
  // Draft system states
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftError, setDraftError] = useState(null);
  const [draftSuccess, setDraftSuccess] = useState(null);
  const [showDraftList, setShowDraftList] = useState(false);
  const [draftList, setDraftList] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [selectedDraftForDiff, setSelectedDraftForDiff] = useState(null);
  const [showDiffViewer, setShowDiffViewer] = useState(false);
  const [diffOldContent, setDiffOldContent] = useState('');
  const [diffNewContent, setDiffNewContent] = useState('');
  
  const { user } = useSelector(state => state.auth);

  // Timer effect for cooldown
  useEffect(() => {
    let interval = null;
    
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime(time => {
          if (time <= 1) {
            setIsInCooldown(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [cooldownTime]);

  // Check for existing cooldown on component mount
  useEffect(() => {
    const lastSendTime = localStorage.getItem('lastNewsletterSend');
    if (lastSendTime) {
      const timeSinceLastSend = Date.now() - parseInt(lastSendTime);
      const cooldownPeriod = 10 * 60 * 1000; // 10 minutes in milliseconds
      
      if (timeSinceLastSend < cooldownPeriod) {
        const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastSend) / 1000);
        setCooldownTime(remainingTime);
        setIsInCooldown(true);
      }
    }
  }, []);

  const handleGenerateNewsletter = async () => {
    try {
      setIsGenerating(true);
      setGenerateError(null);
      setSendError(null);
      setSendSuccess(null);
      const response = await newsletterService.generateNewsletter();
      setGeneratedNewsletter(response);
      setEditedHtml(response.results); // Initialize editable HTML
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

    if (isInCooldown) {
      setSendError('Please wait before sending another newsletter');
      return;
    }

    try {
      setIsSending(true);
      setSendError(null);
      setSendSuccess(null);
      
      const recipient = recipientEmail.trim() || null;
      const response = await newsletterService.sendNewsletter(
        editedHtml, // Send the edited HTML instead of original
        recipient
      );
      
      setSendSuccess(recipient 
        ? `Newsletter sent successfully to ${recipient}` 
        : 'Newsletter sent successfully'
      );
      setRecipientEmail(''); // Clear the input after successful send
      
      // Start cooldown timer (10 minutes = 600 seconds)
      setCooldownTime(600);
      setIsInCooldown(true);
      localStorage.setItem('lastNewsletterSend', Date.now().toString());
    } catch (err) {
      setSendError('Failed to send newsletter');
      console.error('Error sending newsletter:', err);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Draft system functions
  const handleSaveDraft = () => {
    if (!currentTemplateId) {
      // First save - need template name
      setShowTemplateModal(true);
    } else {
      // Subsequent saves - just save draft
      saveDraftToServer();
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateName.trim()) {
      setDraftError('Please enter a template name');
      return;
    }

    try {
      setIsSavingDraft(true);
      setDraftError(null);
      setDraftSuccess(null);

      const response = await draftService.createTemplate(templateName, editedHtml);
      
      if (response.results && response.results.newsletter_template) {
        setCurrentTemplateId(response.results.newsletter_template);
        setDraftSuccess('Template created and draft saved successfully!');
        setShowTemplateModal(false);
        setTemplateName('');
      }
    } catch (error) {
      setDraftError('Failed to create template');
      console.error('Error creating template:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const saveDraftToServer = async () => {
    try {
      setIsSavingDraft(true);
      setDraftError(null);
      setDraftSuccess(null);

      const response = await draftService.saveDraft(currentTemplateId, editedHtml);
      
      if (response.status === 201) {
        setDraftSuccess('Draft saved successfully!');
        // Clear success message after 3 seconds
        setTimeout(() => setDraftSuccess(null), 3000);
      }
    } catch (error) {
      setDraftError('Failed to save draft');
      console.error('Error saving draft:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleLoadDrafts = async () => {
    if (!currentTemplateId) {
      setDraftError('Please save a template first');
      return;
    }

    try {
      setLoadingDrafts(true);
      setDraftError(null);
      
      const response = await draftService.getDraftList(currentTemplateId);
      
      if (response.results) {
        setDraftList(response.results);
        setShowDraftList(true);
      }
    } catch (error) {
      setDraftError('Failed to load drafts');
      console.error('Error loading drafts:', error);
    } finally {
      setLoadingDrafts(false);
    }
  };

  const handleLoadDraft = async (draftId) => {
    try {
      const response = await draftService.getDraft(draftId);
      
      if (response.results && response.results.html_content) {
        setEditedHtml(response.results.html_content);
        setDraftSuccess(`Draft v${response.results.version} loaded successfully!`);
        setShowDraftList(false);
        setTimeout(() => setDraftSuccess(null), 3000);
      }
    } catch (error) {
      setDraftError('Failed to load draft');
      console.error('Error loading draft:', error);
    }
  };

  const handleCompareDrafts = async (draftId) => {
    try {
      const response = await draftService.getDraft(draftId);
      
      if (response.results && response.results.html_content) {
        setDiffOldContent(response.results.html_content);
        setDiffNewContent(editedHtml);
        setShowDiffViewer(true);
        setShowDraftList(false);
      }
    } catch (error) {
      setDraftError('Failed to load draft for comparison');
      console.error('Error loading draft for comparison:', error);
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

      {/* Draft Success/Error Messages */}
      {draftSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <Save className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-sm text-green-700">{draftSuccess}</span>
          </div>
        </div>
      )}

      {draftError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <X className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-sm text-red-700">{draftError}</span>
          </div>
        </div>
      )}

      {generatedNewsletter && (
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Generated Newsletter</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadDrafts}
                disabled={loadingDrafts || !currentTemplateId}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                {loadingDrafts ? 'Loading...' : 'View Drafts'}
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={isSavingDraft || !editedHtml}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSavingDraft ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {currentTemplateId ? 'Save Draft' : 'Save as Template'}
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* 2-Column Layout: HTML Code and Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - HTML Code */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">HTML Source Code (Editable)</span>
                  <button
                    onClick={() => {
                      const blob = new Blob([editedHtml], { type: 'text/html' });
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
              <div className="h-96 overflow-hidden">
                <textarea
                  value={editedHtml}
                  onChange={(e) => setEditedHtml(e.target.value)}
                  className="w-full h-full p-4 bg-gray-900 text-green-400 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Live Preview</span>
              </div>
              <div className="h-96 overflow-y-auto">
                <iframe
                  srcDoc={editedHtml}
                  className="w-full h-full border-0"
                  title="Newsletter Preview"
                  sandbox="allow-same-origin"
                />
              </div>
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
            {isInCooldown && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700">
                  ⏰ Email sending is restricted for 10 minutes after each send to prevent spam. 
                  Time remaining: <span className="font-medium">{formatTime(cooldownTime)}</span>
                </p>
              </div>
            )}
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
              disabled={isSending || isInCooldown}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                isInCooldown 
                  ? 'text-gray-500 bg-gray-300 cursor-not-allowed' 
                  : 'text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isSending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : isInCooldown ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Cooldown: {formatTime(cooldownTime)}
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

      {/* Template Name Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Template</h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter a name for your newsletter template. This will be used to organize your drafts.
              </p>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Weekly Digest - October 2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateTemplate();
                  }
                }}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setTemplateName('');
                    setDraftError(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplate}
                  disabled={isSavingDraft || !templateName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingDraft ? 'Creating...' : 'Create Template'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Draft List Modal */}
      {showDraftList && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Draft History</h3>
                <button
                  onClick={() => setShowDraftList(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {draftList.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No drafts found</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {draftList.map((draft) => (
                    <div
                      key={draft.pk}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          Version {draft.version}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCompareDrafts(draft.pk)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                        >
                          <GitCompare className="h-3 w-3 mr-1" />
                          Compare
                        </button>
                        <button
                          onClick={() => handleLoadDraft(draft.pk)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors"
                        >
                          Load
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Diff Viewer */}
      {showDiffViewer && (
        <DiffViewer
          oldContent={diffOldContent}
          newContent={diffNewContent}
          onClose={() => setShowDiffViewer(false)}
        />
      )}
    </div>
  );
};

export default NewsletterPage;
