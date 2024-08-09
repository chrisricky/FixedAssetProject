import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllocationPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AllocationPage = () => {
    const navigate = useNavigate();
    const [assetId, setAssetId] = useState('');
    const [assetData, setAssetData] = useState(null);
    const [error, setError] = useState(null);
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [fixedallocate, setFixedallocate] = useState({
        id: "",
        branchcode: "",
        deptID: "",
        officerID: "",
        dateAllocated: "",
        userID: "",
        authID: "",
        actionType: 1 // Assuming 1 is the default action type
    });

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await fetch('https://localhost:7222/api/FixedAsset/GetAllBranches');
                if (!response.ok) {
                    throw new Error('Failed to fetch branches');
                }
                const data = await response.json();
                // Assuming data is an array of branch objects with a 'branchcode' field
                setBranches(data.branches); // Set default branch, adjust as needed
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await fetch('https://localhost:7222/api/FixedAsset/GetAllDepartments');
                if (!response.ok) {
                    throw new Error('Failed to fetch departments');
                }
                const data = await response.json();
                // Assuming data is an array of department objects with a 'deptID' field
                setDepartments(data.departments); // Set departments list
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        const fetchStaffs = async () => {
            try {
                const response = await fetch('https://localhost:7222/api/FixedAsset/GetAllUsers');
                if (!response.ok) {
                    throw new Error('Failed to fetch staff');
                }
                const data = await response.json();
                // Assuming data is an array of staff objects with an 'officerID' field
                setStaffs(data.users); // Set staffs list
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
        };

        fetchBranches();
        fetchDepartments();
        fetchStaffs();
    }, []);

    const handleInputChange = (event) => {
        setAssetId(event.target.value);
    };

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

    const allocateFixedAsset = async () => {
        try {
            debugger;
            const response = await fetch('https://localhost:7222/api/FixedAsset/AllocateFAsset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: assetId,
                    branchcode: fixedallocate.branchcode,
                    deptID: fixedallocate.deptID,
                    officerID: fixedallocate.officerID,
                    dateAllocated: fixedallocate.dateAllocated,
                    userID: fixedallocate.officerID,
                    authID: fixedallocate.authID,
                    actionType: fixedallocate.actionType
                })
            });
            if (!response.ok) {
                throw new Error('Failed to allocate fixed asset');
            }
            const responseData = await response.json();
            // Assuming your API returns a message in a field named 'message'
            alert(responseData.responseDescription); // Display the response message
            return navigate('/allocation');
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
                        <h1 className="card-title">Fixed Asset Allocation</h1>

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
                    <br/>
                    <br/>
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <label htmlFor="branch" className="form-label">Branch</label>
                            <select
                                id="branch"
                                value={fixedallocate.branchcode}
                                onChange={(e) => setFixedallocate({ ...fixedallocate, branchcode: e.target.value })}
                                className="form-control"
                            >
                                <option value="">-----Select a Branch-----</option>
                                {branches.map((branch) => (
                                    <option key={branch.branchCode} value={branch.branchCode}>{branch.branchName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="department" className="form-label">Department</label>
                            <select
                                id="department"
                                value={fixedallocate.deptID}
                                onChange={(e) => setFixedallocate({ ...fixedallocate, deptID: e.target.value })}
                                className="form-control"
                                disabled={!fixedallocate.branchcode} // Disable if branchcode is empty
                            >
                                <option value="">-----Select a Department-----</option>
                                {departments.map((dept) => (
                                    <option key={dept.deptid} value={dept.deptid}>{dept.deptName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="staff" className="form-label">Staff</label>
                            <select
                                id="staff"
                                value={fixedallocate.officerID}
                                onChange={(e) => setFixedallocate({ ...fixedallocate, officerID: e.target.value })}
                                className="form-control"
                                disabled={!fixedallocate.branchcode} // Disable if branchcode is empty
                            >
                                <option value="">-----Select a Staff-----</option>
                                {staffs.map((staff) => (
                                    <option key={staff.userId} value={staff.userId}>{staff.fullName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="date" className="form-label">Date</label>
                            <input
                                type="date"
                                id="date"
                                value={fixedallocate.dateAllocated}
                                onChange={(e) => setFixedallocate({ ...fixedallocate, dateAllocated: e.target.value })}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <br />
                    <div className="mb-3 d-flex justify-content-center">
                        <br />

                        <button onClick={allocateFixedAsset} className="btn btn-success me-2">Submit</button>
                        <button onClick={() => navigate('/get-started')} className="btn btn-secondary">Return</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllocationPage;
