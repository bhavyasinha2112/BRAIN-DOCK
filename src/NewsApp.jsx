import React, { useEffect, useState } from "react";
import NewsCard from "./components/NewsInsights";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // import Footer
import "./components/news.css";

function NewsApp() {
  const [news, setNews] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch news
  useEffect(() => {
    fetch("http://localhost:5000/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, []);

  // Extract unique tags
  const tags = [...new Set(news.flatMap((item) => item.tags))];

  // Filtered news
  const filtered = selectedTags.length
    ? news.filter((item) => item.tags.some((t) => selectedTags.includes(t)))
    : news;

  // Like handler
  const handleLike = async (id) => {
    setNews((prev) =>
      prev.map((n) => (n._id === id ? { ...n, likes: n.likes + 1 } : n))
    );

    await fetch(`http://localhost:5000/api/news/${id}/like`, {
      method: "POST",
    });
  };

  // Pick featured (most liked)
  const featured =
    filtered.length > 0
      ? filtered.reduce((max, n) => (n.likes > max.likes ? n : max))
      : null;

  return (
    <div>
      {/* Navbar */}
      {/* Tag bar */}
      <header className="tag-bar">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() =>
              setSelectedTags((prev) =>
                prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
              )
            }
            className={selectedTags.includes(tag) ? "tag active" : "tag"}
          >
            {tag}
          </button>
        ))}
        <button onClick={() => setSelectedTags([])} className="tag clear">
          Clear
        </button>
      </header>

      {/* Featured news */}
      {featured && (
        <div className="featured">
          <NewsCard item={featured} onLike={handleLike} featured />
        </div>
      )}

      {/* Grid for rest */}
      <div className="grid">
        {filtered
          .filter((item) => item._id !== featured?._id)
          .map((item) => (
            <NewsCard key={item._id} item={item} onLike={handleLike} />
          ))}
      </div>

      {/* Footer */}
    
    </div>
  );
}

export default NewsApp;
