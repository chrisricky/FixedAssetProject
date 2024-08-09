import './GetStartedPage.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const GetStartedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="get-started-page container mt-5">
            <header className="get-started-header text-center mb-5">
                <h1 className="labelstyle display-1"><strong>FIXED ASSET MANAGEMENT</strong></h1>
            </header>
            <section className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">Fixed Asset Allocation</h2>
                            <p className="card-text">Manage the allocation of your fixed assets.</p>
                            <button className="btn btn-primary" onClick={() => navigate('/allocation')}>Go to Allocation</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">Fixed Asset Maintenance</h2>
                            <p className="card-text">Keep track of maintenance schedules and records.</p>
                            <button className="btn btn-primary" onClick={() => navigate('/maintenance')}>Go to Maintenance</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">Fixed Asset Repair</h2>
                            <p className="card-text">Log and manage repair tasks for your assets.</p>
                            <button className="btn btn-primary" onClick={() => navigate('/repair')}>Go to Repair</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">Fixed Asset Disposal</h2>
                            <p className="card-text">Handle the disposal of your fixed assets efficiently.</p>
                            <button className="btn btn-primary" onClick={() => navigate('/disposal')}>Go to Disposal</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GetStartedPage;