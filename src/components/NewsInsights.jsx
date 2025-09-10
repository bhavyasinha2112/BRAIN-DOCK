import React from "react";
import "./news.css";

function NewsCard({ item, onLike, featured = false }) {
  return (
    
    <article className={featured ? "card featured-card" : "card"}>
      <img src={item.imageUrl} alt={item.title} className="card-img" />
      <div className="card-body">
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>
        <div className="card-footer">
          <div className="tags">
            {item.tags.map((t) => (
              <span key={t} className="tag small">
                {t}
              </span>
            ))}
          </div>
          <button onClick={() => onLike(item._id)} className="like-btn">
            👍 {item.likes}
          </button>
        </div>
      </div>
    </article>
  );
}

export default NewsCard;
