import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserData } from './firestoreService';
import html2canvas from 'html2canvas'; // Import html2canvas
import YouTube from 'react-youtube'; // Import YouTube component
import { jsPDF } from 'jspdf'; // Import jsPDF
import './MyAioDetails.css';

const MyAioDetails = () => {
    const { id } = useParams();
    const [itemDetails, setItemDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await fetchUserData();
                if (data && data[id]) {
                    setItemDetails(data[id]);
                } else {
                    setError('Item not found.');
                }
            } catch (err) {
                console.error('Error fetching details:', err);
                setError('Failed to fetch details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const downloadImage = () => {
        const element = document.getElementById('myaio-details'); // Capture the element by ID
        const youtubeSection = document.querySelector('.youtube-videos');
        if (youtubeSection) {
            const placeholders = youtubeSection.querySelectorAll('.youtube-video-placeholder');
            placeholders.forEach((placeholder) => {
                placeholder.style.display = 'block';
            });
        }
        html2canvas(element).then((canvas) => {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'myaio-details.png';
            link.click();
            if (youtubeSection) {
                const placeholders = youtubeSection.querySelectorAll('.youtube-video-placeholder');
                placeholders.forEach((placeholder) => {
                    placeholder.style.display = 'none';
                });
            }
        });
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
    
        // Title and other text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(18);
        doc.text('Advice Details', 20, 20);
    
        doc.setFontSize(12);
        doc.text(`Title: ${itemDetails.advice ? itemDetails.advice.split('\n')[0] : 'No Title'}`, 20, 30);
        doc.text(`Country: ${itemDetails.country || 'N/A'}`, 20, 40);
        doc.text(`Language: ${itemDetails.language || 'N/A'}`, 20, 50);
        doc.text(`Situation: ${itemDetails.situation || 'N/A'}`, 20, 60);
        doc.text(`Timestamp: ${itemDetails.timestamp ? new Date(itemDetails.timestamp).toLocaleString() : 'N/A'}`, 20, 70);
    
        // Advice points
        const advicePoints = itemDetails.advice ? itemDetails.advice.split('\n') : [];
        doc.text('Advice:', 20, 80);
        advicePoints.forEach((point, index) => {
            doc.text(`${index + 1}. ${point}`, 20, 90 + (index * 10));
        });
    
        // YouTube Video links
        const startY = 110 + (advicePoints.length * 10);  // Adjust the starting position for YouTube videos
        if (itemDetails.youtubeLinks && itemDetails.youtubeLinks.length > 0) {
            doc.text('Recommended YouTube Videos:', 20, startY);
            itemDetails.youtubeLinks.forEach((link, index) => {
                const videoId = link.split('v=')[1];
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                // Add clickable link to PDF
                doc.text(`Video ${index + 1}: `, 20, startY + (10 * (index + 1)));
                doc.setTextColor(0, 0, 255); // Set the color to blue
                doc.textWithLink(videoUrl, 70, startY + (10 * (index + 1)), { url: videoUrl });
                doc.setTextColor(0, 0, 0); // Reset to black for the rest of the text
            });
        } else {
            doc.text('No YouTube videos available.', 20, startY);
        }
    
        // Save PDF
        doc.save('myaio-details.pdf');
    };
    

    if (loading) {
        return <p>Loading details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="myaio-details-container" id="myaio-details">
            <h1>Advice Details</h1>
            <div className="myaio-item-detail">
                <strong>Title:</strong> {itemDetails.advice ? itemDetails.advice.split('\n')[0] : 'No Title'}
            </div>
            <div className="myaio-item-detail">
                <strong>Country:</strong> {itemDetails.country || 'N/A'}
            </div>
            <div className="myaio-item-detail">
                <strong>Language:</strong> {itemDetails.language || 'N/A'}
            </div>
            <div className="myaio-item-detail">
                <strong>Situation:</strong> {itemDetails.situation || 'N/A'}
            </div>
            <div className="myaio-item-detail">
                <strong>Advice:</strong>
                <ul className="advice-list">
                    {itemDetails.advice.split('\n').map((point, index) => (
                        <li key={index} className="advice-point">{point}</li>
                    ))}
                </ul>
            </div>
            <div className="myaio-item-detail">
                <strong>Timestamp:</strong> {itemDetails.timestamp ? new Date(itemDetails.timestamp).toLocaleString() : 'N/A'}
            </div>

            {/* YouTube Video Section */}
            <div className="myaio-item-detail">
                <strong>Recommended YouTube Videos:</strong>
                <div className="youtube-videos">
                    {itemDetails.youtubeLinks && itemDetails.youtubeLinks.length > 0 ? (
                        itemDetails.youtubeLinks.map((link, index) => {
                            const videoId = link.split('v=')[1];
                            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                            return (
                                <div key={index} className="youtube-video-container">
                                    <div
                                        className="youtube-video-placeholder"
                                        style={{
                                            display: 'none',
                                            textAlign: 'center',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <img
                                            src={thumbnailUrl}
                                            alt={`Thumbnail for video ${videoId}`}
                                            style={{ width: '320px', height: '180px' }}
                                        />
                                        <p>Video {index + 1}</p>
                                    </div>
                                    <YouTube videoId={videoId} opts={{ height: '390', width: '640', playerVars: { autoplay: 0 } }} />
                                </div>
                            );
                        })
                    ) : (
                        <p>No YouTube videos available.</p>
                    )}
                </div>
            </div>

            {/* Buttons for Download and Share */}
            <div className="myaio-buttons" style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                    onClick={downloadImage}
                    className="myaio-download-btn"
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        outline: 'none',
                        marginRight: '10px',
                    }}
                >
                    Download as Image
                </button>
                <button
                    onClick={downloadPDF}
                    className="myaio-download-btn"
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: '#2196F3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        outline: 'none',
                    }}
                >
                    Download as PDF
                </button>
            </div>
        </div>
    );
};

export default MyAioDetails;
