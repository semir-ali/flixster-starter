import './LoadMoreButton.css';

function LoadMoreButton({ onLoadMore, isLoading, isVisible, remainingCount }) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="load-more-container">
      <button
        className="load-more-button"
        onClick={onLoadMore}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : remainingCount ? `Load More (${remainingCount} remaining)` : 'Load More'}
      </button>
    </div>
  );
}

export default LoadMoreButton;
