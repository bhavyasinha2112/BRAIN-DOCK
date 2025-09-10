import React, { useState } from "react";
import "./About.css";

const About = () => {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      try {
        const response = await fetch("http://localhost:5000/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedback }),
        });

        const data = await response.json();
        if (response.ok) {
          setSubmitted(true);
          setFeedback("");
        } else {
          alert(data.msg || "Failed to send feedback");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong!");
      }
    }
  };

  const founder = {
    name: "Bhavya Sinha",
    thought: "Sharing resources makes learning easier for everyone ✨",
    role: "Co-Founder",
    image: "/assets/components/aditi.jpg",
  };

  const coFounder = {
    name: "Aditi Pandit",
    thought: "BrainDock is the bridge between students and knowledge 🚀",
    role: "Co-Founder",
    image: "/assets/components/aditi2.jpg", 
  };

  return (
    <section className="about-section">
      <div className="about-container">
        {/* About Section */}
        <h1 className="about-title">About IGDTUW Brain-Dock</h1>
        <p className="about-text">
          <strong>BrainDock</strong> is an all-round website built exclusively
          for IGDTUW students. It is a one-stop platform where you can dock all
          your academic needs from <span className="highlight">exam resources</span>,{" "}
          <span className="highlight">projects</span>, and{" "}
          <span className="highlight">placement preparation</span> to community
          support and more.
          <br />
          <br />
          Our mission is to make learning accessible, collaborative, and
          stress-free by providing high-quality resources, interactive tools,
          and an engaging student community.
        </p>

        {/* Feedback Section */}
        <div className="feedback-box">
          <h2 className="feedback-title">We’d love your Feedback </h2>
          {submitted ? (
            <p className="feedback-success">✅ Thank you for your feedback!</p>
          ) : (
            <form onSubmit={handleSubmit} className="feedback-form">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback here..."
                className="feedback-textarea"
                rows="4"
              />
              <button type="submit" className="feedback-btn">
                Submit Feedback
              </button>
            </form>
          )}
        </div>

        {/* Founders Section */}
        <div>
          <h2 className="founders-title">Meet the Founders</h2>
          <div className="founders-grid">
            {/* Founder */}
            <div className="founder-card">
              <img
                src={founder.image}
                alt={founder.name}
                className="founder-img"
              />
              <h3 className="founder-name">{founder.name}</h3>
              <p className="founder-role">{founder.role}</p>
              <p className="founder-thought">"{founder.thought}"</p>
            </div>

            {/* Co-Founder */}
            <div className="founder-card">
              <img
                src={coFounder.image}
                alt={coFounder.name}
                className="founder-img"
              />
              <h3 className="founder-name">{coFounder.name}</h3>
              <p className="founder-role">{coFounder.role}</p>
              <p className="founder-thought">"{coFounder.thought}"</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;