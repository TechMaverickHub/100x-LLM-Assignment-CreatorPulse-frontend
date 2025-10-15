import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { newsletterService } from '../services/newsletterService.js';
import { Calendar, Clock, ExternalLink, Download, Share2 } from 'lucide-react';

const NewsletterPage = () => {
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        setLoading(true);
        const data = await newsletterService.getLatestNewsletter();
        setNewsletter(data);
      } catch (err) {
        setError('Failed to load newsletter');
        console.error('Error fetching newsletter:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Newsletter Available</h1>
          <p className="text-gray-600 mb-6">
            There's no newsletter available yet. Make sure you've selected some topics in the Topics section.
          </p>
          <a
            href="/topics"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Select Topics
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Newsletter Header */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {newsletter.title || 'AI Newsletter'}
            </h1>
            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(newsletter.created_at)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {newsletter.read_time || '5'} min read
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Content */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <div className="prose prose-lg max-w-none">
          {newsletter.content ? (
            <div dangerouslySetInnerHTML={{ __html: newsletter.content }} />
          ) : (
            <div className="space-y-6">
              {newsletter.sections?.map((section, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h2>
                  <div className="text-gray-700 leading-relaxed">
                    {section.content}
                  </div>
                  {section.links && section.links.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Related Links:</h3>
                      <ul className="space-y-1">
                        {section.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {link.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Footer */}
      <div className="bg-primary-50 rounded-xl p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Enjoyed this newsletter?
          </h3>
          <p className="text-gray-600 mb-4">
            Make sure to select your preferred topics to receive more personalized content.
          </p>
          <div className="flex justify-center space-x-3">
            <a
              href="/topics"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Manage Topics
            </a>
            <button className="inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50">
              Share Newsletter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;
