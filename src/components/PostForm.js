import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PostForm = ({ isEdit = false }) => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit) {
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      const postFromStorage = posts.find((post) => post.id === Number(id));

      if (postFromStorage) {
        // Load post from localStorage
        setTitle(postFromStorage.title || "");
        setShortDescription(postFromStorage.shortDescription || "");
        setBody(postFromStorage.body || "");
        setTags(postFromStorage.tags || []); // Load tags
        setComments(postFromStorage.comments || []); // Load comments
      } else {
        // Load post from API
        const fetchPost = async () => {
          try {
            const response = await fetch(
              `https://jsonplaceholder.typicode.com/posts/${id}`
            );
            if (!response.ok) throw new Error("Failed to fetch post");
            const apiPost = await response.json();
            setTitle(apiPost.title || "");
            setShortDescription(apiPost.body.substring(0, 50) || "");
            setBody(apiPost.body || "");
            setTags([]); // Default empty tags for API posts

            // Fetch comments for API posts
            const commentsResponse = await fetch(
              `https://jsonplaceholder.typicode.com/comments?postId=${id}`
            );
            if (commentsResponse.ok) {
              const apiComments = await commentsResponse.json();
              setComments(apiComments); // Set comments fetched from API
            } else {
              setComments([]); // Default to empty comments if fetch fails
            }
          } catch (error) {
            console.error("Error fetching post from API:", error);
          }
        };

        fetchPost();
      }
    }
  }, [id, isEdit]);

  const generateUniqueId = (posts) => {
    const maxExistingId = Math.max(0, ...posts.map((post) => post.id));
    return maxExistingId + 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Tags before submit:", tags); // Debugging
    console.log("Comments before submit:", comments); // Debugging

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const newId = isEdit ? Number(id) : generateUniqueId(posts);

    const newPost = {
      id: newId,
      title,
      shortDescription,
      body,
      tags, // Include updated tags here
      comments, // Preserve comments during edit
    };

    console.log("New post object being saved:", newPost); // Debugging

    const isApiPost = !posts.find((post) => post.id === Number(id));
    const updatedPosts = isEdit
      ? isApiPost
        ? [newPost, ...posts]
        : posts.map((post) => (post.id === Number(id) ? newPost : post))
      : [newPost, ...posts];

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    console.log("Updated Posts in LocalStorage:", updatedPosts); // Debugging
    navigate("/posts");
  };

  const handleAddTag = () => {
    console.log("New tag input:", newTag); // Debugging
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      console.log("Updated tags after adding:", updatedTags); // Debugging
      setNewTag(""); // Clear the input
    } else {
      alert("Tag is either empty or already exists.");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{isEdit ? "Edit Article" : "Create New Article"}</h1>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
      </div>
      <div>
        <label>Short Description</label>
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Enter the short description"
          required
        />
      </div>
      <div>
        <label>Text</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Text"
          required
        />
      </div>
      <div>
        <label>Tags</label>
        <div className="tags-container">
          {tags.map((tag, index) => (
            <div className="tag-input" key={index}>
              <input type="text" value={tag} readOnly />
              <button
                type="button"
                className="delete-tag"
                onClick={() => handleDeleteTag(tag)}
              >
                Delete
              </button>
            </div>
          ))}
          <div className="tag-input">
            <input
              type="text"
              value={newTag}
              onChange={(e) => {
                setNewTag(e.target.value);
                console.log("New tag input value:", e.target.value); // Debugging
              }}
              placeholder="Tag"
            />
            <button type="button" onClick={handleAddTag} className="add-tag">
              Add Tag
            </button>
          </div>
        </div>
      </div>
      <div className="button-group">
        <button type="submit" className="primary">
          {isEdit ? "Save Changes" : "Send"}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => navigate("/posts")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PostForm;
