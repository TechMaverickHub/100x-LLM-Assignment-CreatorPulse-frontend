import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopics, fetchUserTopics, updateUserTopics, toggleTopicSelection } from '../store/topicSlice.js';
import { Check, X } from 'lucide-react';

const TopicsPage = () => {
  const dispatch = useDispatch();
  const { topics, userTopics, selectedTopics, loading, error } = useSelector(state => state.topics);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchTopics());
    dispatch(fetchUserTopics());
  }, [dispatch]);

  const handleTopicToggle = (topicId) => {
    dispatch(toggleTopicSelection(topicId));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dispatch(updateUserTopics(selectedTopics)).unwrap();
    } catch (error) {
      console.error('Failed to update topics:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    const currentTopicIds = userTopics.map(topic => topic.id);
    return JSON.stringify(currentTopicIds.sort()) !== JSON.stringify(selectedTopics.sort());
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Select Your Topics</h1>
        <p className="mt-2 text-gray-600">
          Choose the AI topics you're interested in to receive personalized newsletters.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-primary-200 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => {
              const isSelected = selectedTopics.includes(topic.id);
              return (
                <div
                  key={topic.id}
                  className={`relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-primary-200 hover:border-primary-300'
                  }`}
                  onClick={() => handleTopicToggle(topic.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {topic.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                          {topic.category}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {isSelected ? (
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-primary-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Selected Topics ({selectedTopics.length})
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedTopics.length > 0
                    ? 'You will receive newsletters covering these topics.'
                    : 'Select at least one topic to receive newsletters.'}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => dispatch(fetchUserTopics())}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges() || isSaving || selectedTopics.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TopicsPage;
