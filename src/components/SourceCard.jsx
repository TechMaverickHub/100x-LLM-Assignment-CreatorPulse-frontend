import { Globe, ExternalLink, CheckCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';

const SourceCard = ({ 
  source, 
  showActions = false, 
  onEdit, 
  onDelete, 
  isAdmin = false 
}) => {
  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const getDomainFromUrl = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const getSourceTypeColor = (sourceTypeName) => {
    const colors = {
      'RSS': 'bg-blue-100 text-blue-800',
      'Api': 'bg-green-100 text-green-800',
      'API': 'bg-green-100 text-green-800',
      'Reddit': 'bg-orange-100 text-orange-800',
      'ArXiv': 'bg-purple-100 text-purple-800',
      'Twitter': 'bg-sky-100 text-sky-800',
      'YouTube': 'bg-red-100 text-red-800',
      'Blog': 'bg-gray-100 text-gray-800'
    };
    return colors[sourceTypeName] || 'bg-gray-100 text-gray-800';
  };

  const getTopicColor = (topicName) => {
    const colors = {
      'AI': 'bg-purple-100 text-purple-800',
      'Blockchain': 'bg-yellow-100 text-yellow-800',
      'Cybersecurity': 'bg-red-100 text-red-800',
      'IoT': 'bg-green-100 text-green-800'
    };
    return colors[topicName] || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(source);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(source.pk || source.id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header with favicon and title */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="flex-shrink-0">
          {getFaviconUrl(source.url) ? (
            <img
              src={getFaviconUrl(source.url)}
              alt=""
              className="h-6 w-6 rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <Globe className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600"
            >
              {source.name}
            </a>
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {getDomainFromUrl(source.url)}
          </p>
        </div>
        {showActions && isAdmin && (
          <div className="flex-shrink-0 flex space-x-1">
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
              title="Edit source"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete source"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTopicColor(source.topic?.name)}`}>
          {source.topic?.name}
        </span>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceTypeColor(source.source_type?.name)}`}>
          {source.source_type?.name}
        </span>
      </div>

      {/* Description */}
      {source.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {source.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          {source.is_active ? (
            <>
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              <span>Active</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
              <span>Inactive</span>
            </>
          )}
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-primary-600 hover:text-primary-700"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Visit
        </a>
      </div>
    </div>
  );
};

export default SourceCard;
