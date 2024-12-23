import React, { useEffect, useState } from 'react';
import './myaio.css'; 
import { fetchUserData, deleteUserData } from './firestoreService';
import { useNavigate } from 'react-router-dom';

const MyAio = () => {
    const [prepaData, setPrepaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchUserData();
                if (data) {
                    const dataArray = Object.entries(data).map(([id, item]) => ({
                        id,
                        ...item,
                    }));
                    // Sort the data by timestamp in descending order (most recent first)
                    dataArray.sort((a, b) => b.timestamp - a.timestamp);
                    setPrepaData(dataArray); 
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteUserData(id);
            setPrepaData((prevData) => prevData.filter((item) => item.id !== id));
        } catch (err) {
            console.error('Error deleting data:', err);
            alert('Failed to delete the entry.');
        }
    };

    const navigateToDetails = (id) => {
        navigate(`/myaio/${id}`);
    };

    if (loading) {
        return <p>Loading data...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="myaio-container">
            <h1><span style={{ color: '#007bff' }}>MyAIO's Library</span></h1>
            
            <div className="myaio-content">
                <div className="myaio-header">
                    <div className="myaio-header-title">Title</div>
                    <div className="myaio-header-created">Created</div>
                    <div className="myaio-header-time">Time</div>
                    <div className="myaio-header-action">Action</div>
                </div>

                {prepaData.length > 0 ? (
                    prepaData.map(({ id, created, timestamp, timeSaved, advice }) => {
                        const title = advice ? advice.split('\n')[0] : 'No Title';

                        return (
                            <div
                                className="myaio-item"
                                key={id}
                                onClick={() => navigateToDetails(id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="myaio-item-title">{title}</div>
                                <div className="myaio-item-created">{timestamp ? new Date(timestamp).toLocaleDateString() : 'N/A'}</div>
                                <div className="myaio-item-time">{timestamp ? new Date(timestamp).toLocaleTimeString() : 'N/A'}</div>
                                <div className="myaio-item-action">
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(id); }}>Delete</button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No data available.</p>
                )}
            </div>
        </div>
    );
};

export default MyAio;
