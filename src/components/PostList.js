import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/PostList.css";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch posts from localStorage
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        const deletedPosts = JSON.parse(localStorage.getItem("deletedPosts")) || [];

        // Fetch API posts
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=100`);
        if (!response.ok) throw new Error("Failed to fetch posts from API");
        const apiPosts = await response.json();

        // Filter out deleted API posts
        const filteredApiPosts = apiPosts.filter(
          (post) => !deletedPosts.includes(post.id)
        );

        // Combine localStorage and API posts, prioritizing localStorage posts
        const combinedPosts = [
          ...storedPosts,
          ...filteredApiPosts.filter(
            (apiPost) => !storedPosts.find((storedPost) => storedPost.id === apiPost.id)
          ),
        ];

        // Update state with combined posts
        setPosts(combinedPosts);
        setTotalPages(Math.ceil(combinedPosts.length / 10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location]);

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  return (
    <div className="post-list">
      <h1>Blog Posts</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {posts.length > 0 ? (
          posts.slice((page - 1) * 10, page * 10).map((post) => (
            <li key={post.id} className="post-item">
              <Link to={`/posts/${post.id}`} className="post-title">
                {post.title}
              </Link>
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="post-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="post-description">{post.shortDescription || post.body.substring(0, 100)}</p>
            </li>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </ul>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`dot ${page === index + 1 ? "active" : ""}`}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostList;
