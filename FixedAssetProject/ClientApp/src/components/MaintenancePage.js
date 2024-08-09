import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MaintenancePage.css';

const MaintenancePage = () => {
    const navigate = useNavigate();
    const [assetId, setAssetId] = useState('');
    const [assetData, setAssetData] = useState(null);
    const [error, setError] = useState(null);
    const handleInputChange = (event) => {
        setAssetId(event.target.value);
    };

    const [fixedMaintenance, setFixedMaintenance] = useState({
        id: "",
        maintAmount: "",
        maintDesc: "",
        maintDate: "",
        fundSourceGL: "",
        userID: "",
        authID: ""
    });

    const fetchAssetData = async () => {
        try {
            const response = await fetch(`https://localhost:7222/api/FixedAsset/FetchFixedAssetsById?id=${assetId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.fixedAsset) {
                setAssetData(data.fixedAsset);
                setError(null);
            } else {
                setAssetData(null);
                setError('Invalid data format received from server');
            }
        } catch (error) {
            setError(error.message);
            setAssetData(null);
        }
    };


    const maintainFixedAsset = async () => {
        try {
            debugger;
            const response = await fetch('https://localhost:7222/api/FixedAsset/InsFAMaintenance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: assetId,
                    maintAmount: parseFloat(fixedMaintenance.maintAmount),
                    maintDesc: fixedMaintenance.maintDesc,
                    maintDate: fixedMaintenance.maintDate,
                    fundSourceGL: fixedMaintenance.fundSourceGL,
                    userID: fixedMaintenance.userID,
                    authID: fixedMaintenance.authID
                })
            });

            // Process the response even if it's not OK
            const responseData = await response.json();
            alert(responseData.responseDescription); // Display the response message
            return navigate('/maintenance');
            
        } catch (error) {
            // Catch any other errors
            console.error('Error:', error);
            alert('Failed to Maintain fixed asset: ' + error.message);
        }
    };



    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
    };

    return (
        <div className="container mt-5">
            
            <div className="card">
                <div className="card-body">
                    <header className="page-header d-flex justify-content-center">
                        <h1>Fixed Asset Maintenance</h1>
                    </header>
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label htmlFor="assetId" className="form-label">Fixed Asset ID</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="assetId"
                                    value={assetId}
                                    onChange={handleInputChange}
                                    placeholder="Enter Asset ID"
                                    className="form-control"
                                />
                                <button onClick={fetchAssetData} className="btn btn-primary">Fetch Asset</button>
                            </div>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {assetData && (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Category Code</th>
                                    <th>Asset Name</th>
                                    <th>Purchase Date</th>
                                    <th>Net Book Value</th>
                                    <th>Asset Cost</th>
                                    <th>Lifespan (Months)</th>
                                    <th>Used Lifespan</th>
                                    <th>Expiry Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{assetData.categorycode}</td>
                                    <td>{assetData.assetName}</td>
                                    <td>{formatDate(assetData.purchaseDate)}</td>
                                    <td>{assetData.netBookValue}</td>
                                    <td>{assetData.assetCost}</td>
                                    <td>{assetData.lifespanMonths}</td>
                                    <td>{assetData.usedLifeSpan}</td>
                                    <td>{formatDate(assetData.expirydate)}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                    <br />
                    <br />
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <label htmlFor="text" className="form-label">Maintenance Amount</label>
                            <input
                                type="text"
                                id="text"
                                value={fixedMaintenance.maintAmount}
                                onChange={(e) => setFixedMaintenance({ ...fixedMaintenance, maintAmount: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="text" className="form-label">Maintenance description</label>
                            <input
                                type="text"
                                id="text"
                                value={fixedMaintenance.maintDesc}
                                onChange={(e) => setFixedMaintenance({ ...fixedMaintenance, maintDesc: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="date" className="form-label">Maintenance date</label>
                            <input
                                type="date"
                                id="date"
                                value={fixedMaintenance.maintDate}
                                onChange={(e) => setFixedMaintenance({ ...fixedMaintenance, maintDate: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="text" className="form-label">Source of Funds GL</label>
                            <input
                                type="text"
                                id="text"
                                value={fixedMaintenance.fundSourceGL}
                                onChange={(e) => setFixedMaintenance({ ...fixedMaintenance, fundSourceGL: e.target.value })}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <br />
                    <div className="mb-3 d-flex justify-content-center">
                        <br />

                        <button onClick={maintainFixedAsset} className="btn btn-success me-2">Submit</button>
                        <button onClick={() => navigate('/get-started')} className="btn btn-secondary">Return</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;
