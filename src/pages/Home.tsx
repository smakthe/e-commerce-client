import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page animate-enter">
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title text-gradient">The Future of Commerce.</h1>
          <p className="hero-subtitle">
            Experience an immersive marketplace designed with cutting edge aesthetics.
            Glassmorphic aesthetics, fluid animations, and a rich dark mode.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary">Start Exploring</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
