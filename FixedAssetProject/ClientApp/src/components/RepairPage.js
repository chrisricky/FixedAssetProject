import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RepairPage.css';

const RepairPage = () => {
    const navigate = useNavigate();
    const [isCapitalized, setIsCapitalized] = useState(false);
    const [assetId, setAssetId] = useState('');
    const [assetData, setAssetData] = useState(null);
    const [error, setError] = useState(null);
    const handleInputChange = (event) => {
        setAssetId(event.target.value);
    };


    const [fixedRepair, setFixedRepair] = useState({
        id: "",
        repairAmount: "",
        repairDesc: "",
        repairDate: "",
        capitalized: 0,
        addedLifeSpan: "",
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

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsCapitalized(checked);
        setFixedRepair({ ...fixedRepair, capitalized: checked ? 1 : 0 });
    };


    const RepairFixedAsset = async () => {
        try {
            debugger;
            const response = await fetch('https://localhost:7222/api/FixedAsset/InsFARepairs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({

                    id: assetId,
                    repairAmount: parseInt(fixedRepair.repairAmount),
                    repairDesc: fixedRepair.repairDesc,
                    repairDate: fixedRepair.repairDate,
                    capitalized: fixedRepair.capitalized,
                    addedLifeSpan: parseInt(fixedRepair.addedLifeSpan),
                    fundSourceGL: fixedRepair.fundSourceGL,
                    userID: fixedRepair.userID,
                    authID: fixedRepair.authID
                })
            });
            const responseData = await response.json();
            alert(responseData.responseDescription); // Display the response message
            return navigate('/repair');
        } catch (error) {
            alert('Failed to allocate fixed asset: ' + error.message);
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
                        <h1>Fixed Asset Repair</h1>
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
                                    <th>UsedLifespan</th>
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
                            <label htmlFor="text" className="form-label">Repair Amount</label>
                            <input
                                type="text"
                                id="text"
                                value={fixedRepair.repairAmount}
                                onChange={(e) => setFixedRepair({ ...fixedRepair, repairAmount: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="text" className="form-label">Repair description</label>
                            <input
                                type="text"
                                id="text"
                                value={fixedRepair.repairDesc}
                                onChange={(e) => setFixedRepair({ ...fixedRepair, repairDesc: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="date" className="form-label">Repair date</label>
                            <input
                                type="date"
                                id="date"
                                value={fixedRepair.repairDate}
                                onChange={(e) => setFixedRepair({ ...fixedRepair, repairDate: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="text" className="form-label">Source of Funds GL</label>
                            <input
                                type="text"
                                id="text"
                                value={fixedRepair.fundSourceGL}
                                onChange={(e) => setFixedRepair({ ...fixedRepair, fundSourceGL: e.target.value })}
                                className="form-control"
                            />
                        </div>
                    </div>



                    <div className="row mb-3">

                        <div className="col-sm-3">
                            <input
                                type="checkbox"
                                id="capitalized"
                                checked={isCapitalized}
                                onChange={handleCheckboxChange}
                            />&nbsp;
                            <label htmlFor="capitalized" className="form-label">Capitalized</label>
                        </div>

                        {isCapitalized && (
                            
                                <div className="col-sm-3">
                                    <label htmlFor="text" className="form-label">LifeSpan (Months)</label>
                                    <input
                                        type="text"
                                        id="text"
                                        value={fixedRepair.addedLifeSpan}
                                        onChange={(e) => setFixedRepair({ ...fixedRepair, addedLifeSpan: e.target.value })}
                                        className="form-control"
                                    />
                                </div>
                            
                        )}
                    </div>
                    <br />
                    <br />
                    <div className="mb-3 d-flex justify-content-center">
                        <br />

                        <button onClick={RepairFixedAsset} className="btn btn-success me-2">Submit</button>
                        <button onClick={() => navigate('/get-started')} className="btn btn-secondary">Return</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepairPage;
