import React from 'react';

const HeroText = () => {
  return (
    <div className="hero-container">
      <h1 className="hero-heading animate-slideInLeft">
        Explore & <span className="hero-highlight">connect</span> with
      </h1>
      <h1 className="hero-heading opacity-0 animate-slideInRight animation-delay-1500">
        <span className="hero-subheading">187+</span>

        <span className="hero-subheading-white"> lake communities</span>
      </h1>
    </div>
  );
};

export default HeroText;
