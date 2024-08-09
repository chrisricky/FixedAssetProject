import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <header className="landing-header">
                <h1>Welcome to the Fixed Asset Project</h1>
                <p>Your ultimate solution for managing fixed assets efficiently and effectively.</p>
                <button className="cta-button" onClick={() => navigate('/get-started')}>Get Started</button>
            </header>
            <section className="features">
                <div className="feature">
                    <h2>Feature 1</h2>
                    <p>Details about feature 1.</p>
                </div>
                <div className="feature">
                    <h2>Feature 2</h2>
                    <p>Details about feature 2.</p>
                </div>
                <div className="feature">
                    <h2>Feature 3</h2>
                    <p>Details about feature 3.</p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
