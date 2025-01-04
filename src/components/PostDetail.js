import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        const fetchedPost = posts.find((p) => p.id === Number(id));

        if (fetchedPost) {
          const updatedPost = { ...fetchedPost, tags: fetchedPost.tags || [] };
          setPost(updatedPost);
        } else {
          const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${id}`
          );
          if (!response.ok) throw new Error("Failed to fetch post");
          const apiPost = await response.json();
          const updatedPost = { ...apiPost, tags: [] };
          setPost(updatedPost);
        }

        const commentsResponse = await fetch(
          `https://jsonplaceholder.typicode.com/comments?postId=${id}`
        );
        if (!commentsResponse.ok) throw new Error("Failed to fetch comments");

        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching post or comments:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      const deletedPosts = JSON.parse(localStorage.getItem("deletedPosts")) || [];
      const updatedDeletedPosts = [...new Set([...deletedPosts, Number(id)])];

      localStorage.setItem("deletedPosts", JSON.stringify(updatedDeletedPosts));
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
          <div className="button-group-inline">
            <button className="edit-button" onClick={() => navigate(`/posts/${id}/edit`)}>Edit</button>
            <button className="delete-button" onClick={handleDelete}>
              Delete
            </button>
          </div>
          </div>
          
        </>
      )}
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>
              <strong>{comment.name}</strong>: {comment.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostDetail;
