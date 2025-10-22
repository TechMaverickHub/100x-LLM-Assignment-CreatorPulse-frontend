import { useState, useEffect } from 'react';
import { draftService } from '../services/draftService.js';
import { Search, FileText, GitCompare, Eye, RefreshCw, X, Plus } from 'lucide-react';
import DiffViewer from '../components/DiffViewer.jsx';

const TemplatePage = () => {
  // Template list states
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Draft states
  const [drafts, setDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [selectedDraft1, setSelectedDraft1] = useState(null);
  const [selectedDraft2, setSelectedDraft2] = useState(null);

  // Preview states
  const [previewDraft, setPreviewDraft] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Diff viewer states
  const [showDiffViewer, setShowDiffViewer] = useState(false);
  const [diffOldContent, setDiffOldContent] = useState('');
  const [diffNewContent, setDiffNewContent] = useState('');
  const [diffVersionInfo, setDiffVersionInfo] = useState({ oldVersion: null, newVersion: null });

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  // Load drafts when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      loadDrafts(selectedTemplate.pk);
    }
  }, [selectedTemplate]);

  const loadTemplates = async (search = '') => {
    try {
      setLoadingTemplates(true);
      setError(null);
      const response = await draftService.getTemplateList(1, 50, search);
      setTemplates(response.results || []);
    } catch (err) {
      setError('Failed to load templates');
      console.error('Error loading templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const loadDrafts = async (templateId) => {
    try {
      setLoadingDrafts(true);
      setError(null);
      const response = await draftService.getDraftList(templateId);
      setDrafts(response.results || []);
      setSelectedDraft1(null);
      setSelectedDraft2(null);
    } catch (err) {
      setError('Failed to load drafts');
      console.error('Error loading drafts:', err);
    } finally {
      setLoadingDrafts(false);
    }
  };

  const handleSearchTemplates = (e) => {
    e.preventDefault();
    loadTemplates(searchQuery);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  const handleSelectDraftForComparison = (draft) => {
    if (!selectedDraft1) {
      setSelectedDraft1(draft);
    } else if (!selectedDraft2) {
      if (draft.pk === selectedDraft1.pk) {
        setError('Please select two different drafts to compare');
        setTimeout(() => setError(null), 3000);
        return;
      }
      setSelectedDraft2(draft);
    } else {
      // Reset and start over
      setSelectedDraft1(draft);
      setSelectedDraft2(null);
    }
  };

  const handleCompareDrafts = async () => {
    if (!selectedDraft1 || !selectedDraft2) {
      setError('Please select two drafts to compare');
      return;
    }

    try {
      const [response1, response2] = await Promise.all([
        draftService.getDraft(selectedDraft1.pk),
        draftService.getDraft(selectedDraft2.pk)
      ]);

      const older = selectedDraft1.version < selectedDraft2.version ? response1.results : response2.results;
      const newer = selectedDraft1.version < selectedDraft2.version ? response2.results : response1.results;
      const olderVersion = selectedDraft1.version < selectedDraft2.version ? selectedDraft1.version : selectedDraft2.version;
      const newerVersion = selectedDraft1.version < selectedDraft2.version ? selectedDraft2.version : selectedDraft1.version;

      if (older && newer && older.html_content && newer.html_content) {
        setDiffOldContent(older.html_content);
        setDiffNewContent(newer.html_content);
        setDiffVersionInfo({ oldVersion: olderVersion, newVersion: newerVersion });
        setShowDiffViewer(true);

        // Reset selections
        setSelectedDraft1(null);
        setSelectedDraft2(null);
      }
    } catch (err) {
      setError('Failed to load drafts for comparison');
      console.error('Error loading drafts for comparison:', err);
    }
  };

  const handlePreviewDraft = async (draftId) => {
    try {
      const response = await draftService.getDraft(draftId);
      if (response.results && response.results.html_content) {
        setPreviewDraft(response.results);
        setShowPreview(true);
      }
    } catch (err) {
      setError('Failed to load draft preview');
      console.error('Error loading draft preview:', err);
    }
  };

  const handleClearSelection = () => {
    setSelectedDraft1(null);
    setSelectedDraft2(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Left Sidebar - Template List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Templates</h2>
          
          {/* Search Bar */}
          <form onSubmit={handleSearchTemplates} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by Name..."
              className="w-full pl-9 pr-16 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Template List */}
        <div className="flex-1 overflow-y-auto">
          {loadingTemplates ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 px-4">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No templates found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
               {templates.map((template) => (
                 <button
                   key={template.pk}
                   onClick={() => handleSelectTemplate(template)}
                   className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                     selectedTemplate?.pk === template.pk ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                   }`}
                 >
                   <div className="flex items-start justify-between">
                     <div className="flex-1 min-w-0">
                       <h3 className={`text-sm font-medium ${
                         selectedTemplate?.pk === template.pk ? 'text-primary-900' : 'text-gray-900'
                       }`}>
                         {template.name}
                       </h3>
                     </div>
                   </div>
                 </button>
               ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {templates.length} template{templates.length !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {/* Right Content - Draft List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {selectedTemplate ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h1>
              <p className="text-sm text-gray-600 mt-1">Template ID: {selectedTemplate.pk}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <X className="h-4 w-4 text-red-400 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Selection Info and Compare Button */}
            {(selectedDraft1 || selectedDraft2) && (
              <div className="mx-6 mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-purple-900">Selected:</span>
                    {selectedDraft1 && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                        v{selectedDraft1.version}
                      </span>
                    )}
                    {selectedDraft2 && (
                      <>
                        <span className="text-purple-600">vs</span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                          v{selectedDraft2.version}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedDraft1 && selectedDraft2 && (
                      <button
                        onClick={handleCompareDrafts}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                      >
                        <GitCompare className="h-3 w-3 mr-1" />
                        Compare Now
                      </button>
                    )}
                    <button
                      onClick={handleClearSelection}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-700 bg-white border border-purple-300 hover:bg-purple-50 rounded-md transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Draft List */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingDrafts ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : drafts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No drafts found for this template</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {drafts.map((draft) => {
                    const isSelected =
                      (selectedDraft1 && selectedDraft1.pk === draft.pk) ||
                      (selectedDraft2 && selectedDraft2.pk === draft.pk);

                    return (
                      <div
                        key={draft.pk}
                        className={`bg-white rounded-lg border-2 p-4 transition-all ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-gray-200 hover:border-primary-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSelectDraftForComparison(draft)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-500'
                                  : 'border-gray-300 hover:border-purple-400'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <h3 className={`text-lg font-semibold ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                              Version {draft.version}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreviewDraft(draft.pk)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Template</h2>
              <p className="text-gray-500">Choose a template from the sidebar to view its drafts</p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && previewDraft && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Preview - Version {previewDraft.version}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedTemplate?.name}</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  srcDoc={previewDraft.html_content}
                  className="w-full h-full border-0"
                  title="Draft Preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diff Viewer */}
      {showDiffViewer && (
        <DiffViewer
          oldContent={diffOldContent}
          newContent={diffNewContent}
          oldVersion={diffVersionInfo.oldVersion}
          newVersion={diffVersionInfo.newVersion}
          onClose={() => setShowDiffViewer(false)}
        />
      )}
    </div>
  );
};

export default TemplatePage;

