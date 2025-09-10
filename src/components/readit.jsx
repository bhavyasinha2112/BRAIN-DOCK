import React, { useState, useEffect } from "react";

const Readit = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", body: "", imageFile: null, preview: null });
  const [newComment, setNewComment] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch posts on load
  useEffect(() => {
    fetch("https://brain-dock-backend.onrender.com/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewPost({ ...newPost, imageFile: file, preview: URL.createObjectURL(file) });
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() && !newPost.body.trim() && !newPost.imageFile) return;

    try {
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("body", newPost.body);
      formData.append("author", "Guest");
      if (newPost.imageFile) formData.append("image", newPost.imageFile);

      const res = await fetch("https://brain-dock-backend.onrender.com/api/posts", { method: "POST", body: formData });
      const savedPost = await res.json();
      setPosts([savedPost, ...posts]);
      setNewPost({ title: "", body: "", imageFile: null, preview: null });
      setShowModal(false);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedPost) return;

    try {
      const res = await fetch(`https://brain-dock-backend.onrender.com/api/posts/${selectedPost._id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment, author: "Guest" }),
      });
      const updatedPost = await res.json();
      setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
      setSelectedPost(updatedPost);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleVote = async (id, val) => {
    try {
      const res = await fetch(`https://brain-dock-backend.onrender.com/api/posts/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ val }),
      });
      const updatedPost = await res.json();
      setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
      if (selectedPost && selectedPost._id === updatedPost._id) setSelectedPost(updatedPost);
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  return (
    <section className="min-h-screen bg-blue-50 p-5">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-blue-600 text-center">BrainDock Community 💬</h1>
        </div>

        {/* Feed */}
        {!selectedPost ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex justify-between px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                  <span>{post.author}</span>
                  <span>{post.votes} votes</span>
                </div>

                <div className="p-4 cursor-pointer" onClick={() => setSelectedPost(post)}>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-700 mb-2">{post.body}</p>
                  {post.image && (
                    <img
                      src={`https://brain-dock-backend.onrender.com${post.image}`}
                      alt="post"
                      className="w-full max-h-80 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200">
                  <div className="flex space-x-2 text-lg">
                    <button onClick={() => handleVote(post._id, 1)}>👍</button>
                    <button onClick={() => handleVote(post._id, -1)}>👎</button>
                  </div>
                  <span className="text-gray-500 text-sm">{post.comments.length} comments</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <button
              onClick={() => setSelectedPost(null)}
              className="mb-4 text-blue-600 hover:underline"
            >
              ← Back to feed
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
            <p className="text-sm text-gray-500 mb-4">by {selectedPost.author}</p>
            <p className="text-gray-700 mb-4">{selectedPost.body}</p>
            {selectedPost.image && (
              <img
                src={`https://brain-dock-backend.onrender.com${selectedPost.image}`}
                alt="post"
                className="w-full max-h-96 object-cover rounded-lg mb-4"
              />
            )}

            <h3 className="text-xl font-semibold mb-2">💬 Comments</h3>
            <div className="space-y-2 mb-4">
              {selectedPost.comments.length === 0 ? (
                <p className="text-gray-500">No comments yet.</p>
              ) : (
                selectedPost.comments.map((c, idx) => (
                  <div key={idx} className="bg-gray-100 p-2 rounded-lg">
                    <p className="font-semibold text-gray-800">{c.author}</p>
                    <p className="text-gray-700">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full border border-gray-300 rounded-lg p-2 resize-none"
                rows={3}
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2">
                Comment
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Floating + Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-pink-500 text-white text-3xl shadow-lg hover:bg-pink-600 flex items-center justify-center"
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">✨ Create a New Post</h2>
            <form onSubmit={handlePostSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="What's on your mind?"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <textarea
                value={newPost.body}
                onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                placeholder="Share your thoughts..."
                className="w-full border border-gray-300 rounded-lg p-2 resize-none"
                rows={3}
              />
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {newPost.preview && (
                <img src={newPost.preview} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-500">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Readit;
