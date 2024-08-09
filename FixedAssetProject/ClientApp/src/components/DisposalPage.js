// src/components/DisposalPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DisposalPage.css';

const DisposalPage = () => {
    const navigate = useNavigate();
    const [assetId, setAssetId] = useState('');
    const [catId, setCatId] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [assetData, setAssetData] = useState(null);
    const [error, setError] = useState(null);
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
    const [fixeddispose, setFixeddispose] = useState({
        fixedAssetDisposalItems: [{
            id:'',
            salesAmount:'',
            netBookVal:'',
            salesGL:'',
            salesIncExpGL:''
        }],
        tranDate: '',
        userId: '',
        authId: ''
    });

    //const [fixeddispose, setFixeddispose] = useState({
    //    fixedAssetDisposalItems: [],
    //    tranDate: '',
    //    userId: '',
    //    authId: ''
    //});

    const [singlefixeddispose, setSinglefixeddispose] = useState({
        id:'',
        salesAmount: '',
        netBookVal: '',
        salesGL: '',
        salesIncExpGL: '',
        userId: '',
        authId: ''
    });
    const handleReset = () => {
        setExpFixedAssets([]);
        setAssetId("");
        setAssetData(null);
        setCatId("");
        setSinglefixeddispose({
            salesAmount: '',
            salesGL: '',
            salesIncExpGL: ''
        });
        setProfitLoss(null);
        setHeaderText('Profit/Loss');
    };
    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        setExpFixedAssets([]);
        setAssetId("");
        setAssetData(null);
        setCatId("");
        setSinglefixeddispose({
            salesAmount: '',
            salesGL: '',
            salesIncExpGL: ''
        });
        setProfitLoss(null); 
        setHeaderText('Profit/Loss'); 
    };

    const maintainFixedAsset = async () => {
        try {
            debugger;
            // Map expFixedAssets to the required fixedAssetDisposalItems format
            const fixedAssetDisposalItems = expFixedAssets.map((asset) => ({
                id: asset.id,
                salesAmount: asset.salesAmount || '',
                netBookVal: asset.netBookVal || '',
                salesGL: asset.salesGL || '',
                salesIncExpGL: asset.incomeExpenseGL || ''
            }));
            const tranDate = new Date().toISOString();
            // Construct the request body
            const requestBody = {
                fixedAssetDisposalItems,
                tranDate: tranDate,
                userId: fixeddispose.userId,
                authId: fixeddispose.authId
            };

            // Make the POST request to the API endpoint
            const response = await fetch('https://localhost:7222/api/FixedAsset/DisposeFixedAssetList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            
            const responseData = await response.json();
            alert(responseData.responseDescription); 
            navigate('/disposal');

        } catch (error) {
            // Catch and handle any errors
            console.error('Error:', error);
            alert('Failed to Maintain fixed asset: ' + error.message);
        }
    };

    const handleFieldChange = (event, id, field) => {
        const value = event.target.value;
        setExpFixedAssets((prevAssets) =>
            prevAssets.map((asset) =>
                asset.id === id ? { ...asset, [field]: value } : asset
            )
        );
    };
    const [netBookValue, setNetBookValue] = useState(assetData?.netBookValue || 0);

    useEffect(() => {
        if (assetData) {
            setNetBookValue(assetData.netBookValue);
        }
    }, [assetData]);

    const Handlesales = (event, id) => {
        const salesAmount = parseFloat(event.target.value) || 0;
        setExpFixedAssets((prevAssets) =>
            prevAssets.map((asset) =>
                asset.id === id ? { ...asset, salesAmount } : asset
            )
        );
    };



    const singleDispfixed = async () => {

        try {


            debugger;
            const response = await fetch('https://localhost:7222/api/FixedAsset/DisposeFixedAsset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: assetId,
                    salesAmount: parseInt(singlefixeddispose.salesAmount),
                    netBookVal: parseInt(netBookValue),
                    salesGL: singlefixeddispose.salesGL,
                    salesIncExpGL: singlefixeddispose.salesIncExpGL,
                    userId: '',
                    authId: ''
                })
            });

            // Process the response even if it's not OK
            const responseData = await response.json();
            alert(responseData.responseDescription); // Display the response message
            return navigate('/disposal');

        } catch (error) {
            // Catch any other errors
            console.error('Error:', error);
            alert('Failed to Maintain fixed asset: ' + error.message);
        }
    }

    const handleSubmit = async () => {

        if (selectedOption === '2') {
            maintainFixedAsset();
        } else {
            singleDispfixed();
        }
    }
    const [category, setCategory] = useState([]);


    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch('https://localhost:7222/api/FixedAsset/GetAllCategories');
                if (!response.ok) {
                    throw new Error('Failed to fetch Categories');
                }
                const data = await response.json();
                // Assuming data is an array of branch objects with a 'branchcode' field
                setCategory(data.categories); // Set default branch, adjust as needed
            } catch (error) {
                console.error('Error fetching Categories:', error);
            }
        };
        if (singlefixeddispose.salesAmount !== '' && assetData) {
            const profitLossValue = parseFloat(singlefixeddispose.salesAmount) - parseFloat(assetData.netBookValue);
            setProfitLoss(profitLossValue);
            setHeaderText(profitLossValue >= 0 ? 'Profit' : 'Loss');
        } else {
            setProfitLoss(null);
            setHeaderText('Profit/Loss');
        }
        
        fetchCategory();
        
    }, [singlefixeddispose.salesAmount, assetData]);

    const [profitLoss, setProfitLoss] = useState(null);
    const [headerText, setHeaderText] = useState('Profit/Loss');
    const [headerText2, setHeaderText2] = useState('Profit/Loss');
    const [expFixedAssets, setExpFixedAssets] = useState([]);

    const handleCategoryChange = async (event) => {
        const selectedCategoryCode = event.target.value;
        setCatId(selectedCategoryCode);
        if (selectedCategoryCode) {
            try {
                const response = await fetch(`https://localhost:7222/api/FixedAsset/FetchExpFixedAssetsByCat?categorycode=${selectedCategoryCode}`);
                const data = await response.json();
                setExpFixedAssets(data.fixedAssets || []); // Ensure the data has a fixedAssets property
               
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        } else {
            setExpFixedAssets([]); // Clear the table if no category is selected
            setFixeddispose((prevState) => ({
                ...prevState,
                fixedAssetDisposalItems: []
            }));
        }
    };
   

  
    


    const numberFormatter = new Intl.NumberFormat('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    const handleSalesAmountChange = (e) => {
        setSinglefixeddispose({ ...singlefixeddispose, salesAmount: e.target.value });
    };

    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
    };
    return (
        <div className="container mt-5">

            <div className="card">
                <div className="card-body">
                    <header className="page-header d-flex justify-content-center">
                        <h1>Fixed Asset Disposal</h1>
                    </header>
                    <div className="row mb-3">
                        <div className="d-flex justify-content-center gap-4">
                            <div className="form-check">
                                <input
                                    type="radio"
                                    id="disposalById"
                                    name="disposalOption"
                                    value="1"
                                    checked={selectedOption === '1'}
                                    onChange={handleChange}
                                    className="form-check-input"
                                />
                                <label htmlFor="disposalById" className="form-check-label">
                                    <strong>Disposal by Asset ID</strong>
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    id="disposalByList"
                                    name="disposalOption"
                                    value="2"
                                    checked={selectedOption === '2'}
                                    onChange={handleChange}
                                    className="form-check-input"
                                />
                                <label htmlFor="disposalByList" className="form-check-label">
                                     <strong>Disposal by a List of Assets</strong> 
                                </label>
                            </div>
                        </div>

                    </div>


                    {selectedOption === '1' && (
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
                    )}

                    {selectedOption === '2' && (
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select
                                    id="category"
                                    value={catId}
                                    onChange={handleCategoryChange}
                                    className="form-control"
                                >
                                    <option value="">-----Select a Category-----</option>
                                    {category.map((cat) => (
                                        <option key={cat.categoryCode} value={cat.categoryCode}>{cat.categoryName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

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
                                    <td>{numberFormatter.format(netBookValue)}</td>
                                    <td>{numberFormatter.format(assetData.assetCost)}</td>
                                    <td>{assetData.lifespanMonths}</td>
                                    <td>{assetData.usedLifeSpan}</td>
                                    <td>{formatDate(assetData.expirydate)}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}


                    {expFixedAssets.length > 0 && (
                        <table className="table table-striped small-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Asset Name</th>
                                    <th>Purchase Date</th>
                                    <th>Expiry Date</th>
                                    <th>Purchase Amount</th>
                                    <th>Lifespan Months</th>
                                    <th>Depreciated Life</th>
                                    <th>Net Book Value</th>
                                    <th>Sales Amount</th>
                                    <th>{(headerText2)}</th>
                                    {/*<th>{expFixedAssets.some((asset) => (asset.salesAmount) - (asset.netBookVal) >= 0) ? 'Profit' : 'Loss'}</th>*/}
                                    <th>Sales GL</th>
                                    <th>Income/Expense GL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expFixedAssets.map((asset) => {
                                    const profitLoss = asset.salesAmount ? (asset.salesAmount || 0) - (asset.netBookVal || 0):'';
                                   
                                    // Determine the color of the Profit/Loss text and Income/Expense GL border
                                    const profitLossColor = asset.salesAmount ? (profitLoss < 0 ? 'text-danger' : 'text-success') : '';
                                    const incomeExpenseGLColor = asset.salesAmount ? (profitLoss < 0 ? 'border-danger' : 'border-success') : '';

                                    return (
                                        <tr key={asset.id}>
                                            <td>{asset.id}</td>
                                            <td>{asset.assetName}</td>
                                            <td>{formatDate(asset.purchaseDate)}</td>
                                            <td>{formatDate(asset.expiryDate)}</td>
                                            <td>{numberFormatter.format(asset.purchaseAmount)}</td>
                                            <td>{asset.lifespanMonths}</td>
                                            <td>{asset.depreciatedLife}</td>
                                            <td>{numberFormatter.format(asset.netBookVal)}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={(asset.salesAmount) || ''}
                                                    onChange={(e) => handleFieldChange(e, asset.id, 'salesAmount')}
                                                    onBlur={(e) => Handlesales(e, asset.id)}
                                                    className="form-control form-control-sm" // Smaller input
                                                />
                                            </td>
                                            <td className={profitLossColor}>
                                                {numberFormatter.format(profitLoss)}
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={asset.salesGL || ''}
                                                    onChange={(e) => handleFieldChange(e, asset.id, 'salesGL')}
                                                    className="form-control form-control-sm" // Smaller input
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={asset.incomeExpenseGL || ''}
                                                    onChange={(e) => handleFieldChange(e, asset.id, 'incomeExpenseGL')}
                                                    className={`form-control form-control-sm ${incomeExpenseGLColor}`}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}






                    <br />
                    <br />
                    {assetData && (
                        <div className="row mb-3">
                            <div className="col-sm-2">
                                <label htmlFor="salesAmount" className="form-label">Sales Amount</label>
                                <input
                                    type="text"
                                    id="salesAmount"
                                    value={singlefixeddispose.salesAmount}
                                    onChange={handleSalesAmountChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-sm-2">
                                <label htmlFor="profitLoss" className="form-label">{headerText}</label>
                                <input
                                    type="text"
                                    id="profitLoss"
                                    readOnly
                                    value={profitLoss !== null ? numberFormatter.format(profitLoss) : ''}
                                    className={`form-control ${profitLoss !== null ? (profitLoss < 0 ? 'text-danger' : 'text-success') : ''}`}
                                />
                            </div>
                            <div className="col-sm-2">
                                <label htmlFor="salesGL" className="form-label">Sales GL</label>
                                <input
                                    type="text"
                                    id="salesGL"
                                    value={singlefixeddispose.salesGL}
                                    onChange={(e) => setSinglefixeddispose({ ...singlefixeddispose, salesGL: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-sm-2">
                                <label htmlFor="salesIncExpGL" className="form-label">Income/Exp GL</label>
                                <input
                                    type="text"
                                    id="salesIncExpGL"
                                    value={singlefixeddispose.salesIncExpGL}
                                    onChange={(e) => setSinglefixeddispose({ ...singlefixeddispose, salesIncExpGL: e.target.value })}
                                    className={`form-control ${profitLoss !== null ? (profitLoss < 0 ? 'border-danger' : 'border-success') : ''}`}
                                />
                            </div>
                        </div>
                    )}
                    <br />
                    <div className="mb-3 d-flex justify-content-center">
                        <br />

                        <button onClick={handleSubmit} className="btn btn-success me-2">Submit</button>
                        <button onClick={handleReset} className="btn btn-warning me-2">Reset</button>
                        <button onClick={() => navigate('/get-started')} className="btn btn-secondary">Return</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisposalPage;
