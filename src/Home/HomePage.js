import React from 'react';
import { posts } from '../component/data'; // cập nhật path nếu khác


const HomePage = () => {
  const user = JSON.parse(localStorage.getItem('user-info') || sessionStorage.getItem('user-info'));

  return (
    <div className="container">
      <h1 className="main-title">Tin Công Nghệ</h1>
      
      {posts.map((post, index) => (
        <div key={index} className="post-card">
          <img src={post.photo_url} alt={post.title} className="post-image" />
          <h2 className="post-title">
            <a href={post.link} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a>
          </h2>
          <p className="post-source"><strong>Nguồn:</strong> {post.source_name}</p>
          <p className="post-date"><em>{new Date(post.published_datetime_utc).toLocaleString()}</em></p>
          <p className="post-snippet">{post.snippet}</p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
