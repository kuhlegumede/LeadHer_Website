import React from "react";

const Footer = () => {
  return (
    <div className="footer">
      <div className="middle-footer">
        <div className="footer-section">
          <p className="category">Category</p>
          <ul>
            <li><a href="/">News</a></li>
            <li><a href="/">Business</a></li>
            <li><a href="/">eCommerce</a></li>
            <li><a href="/">Entertainment</a></li>
            <li><a href="/">Technology</a></li>
            <li><a href="/">Sport</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <p className="category">Popular Blogs</p>
          <ul>
            <li><a href="/">Think like a CEO</a></li>
            <li><a href="/">How AI is changing our world</a></li>
            <li><a href="/">30 minutes meals for students</a></li>
            <li><a href="/">Around the world with Mia Kapur</a></li>
            <li><a href="/">Creation: Facts and Fiction</a></li>
            <li><a href="/">The 8 wonders of the world</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
