import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        const fetchedPost = posts.find((p) => p.id === Number(id));

        if (fetchedPost) {
          // For localStorage posts
          setPost(fetchedPost);
          setComments(fetchedPost.comments || []); // Load localStorage comments
        } else {
          // For API posts
          const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${id}`
          );
          if (!response.ok) throw new Error("Failed to fetch post");

          const apiPost = await response.json();
          setPost({ ...apiPost, comments: [], tags: [] }); // Initialize empty comments and tags

          // Fetch comments for the API post
          const commentsResponse = await fetch(
            `https://jsonplaceholder.typicode.com/comments?postId=${id}`
          );
          if (!commentsResponse.ok) throw new Error("Failed to fetch comments");

          const apiComments = await commentsResponse.json();
          setComments(apiComments); // Set API comments
        }
      } catch (error) {
        console.error("Error fetching post or comments:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const updatedComments = [...comments, { id: Date.now(), body: newComment }];
      setComments(updatedComments);

      // Update localStorage if it's a local post
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      const updatedPosts = posts.map((p) =>
        p.id === Number(id) ? { ...p, comments: updatedComments } : p
      );
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      setNewComment("");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      const updatedPosts = posts.filter((post) => post.id !== Number(id));
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      navigate("/posts");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!post) return null;

  return (
    <div className="post-detail">
      {post && (
        <>
          <h1>{post.title}</h1>
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="post-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="paragraph">
            <p>{post.body}</p>
            <div className="button-group">
              <button
                className="edit-button"
                onClick={() => navigate(`/posts/${id}/edit`)}
              >
                Edit
              </button>
              <button className="delete-button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>

          <h2>Comments</h2>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>
                <p>{comment.body || comment.text}</p>
              </li>
            ))}
          </ul>
          <div className="comment-input">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetail;
