import React from 'react';

const HeroText = () => {
  return (
    <div className="hero-text-container">
      <h1 className="hero-text-heading animate-slideInLeft">
        Explore & <span className="hero-text-highlight">connect</span> with
      </h1>
      <h1 className="hero-text-heading opacity-0 animate-slideInRight animation-delay-1500">
        <span className="hero-text-subheading">187+</span>

        <span className="hero-text-subheading-white"> lake communities</span>
      </h1>
    </div>
  );
};

export default HeroText;
