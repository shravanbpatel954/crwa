import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserData } from './firestoreService';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Markdown from 'react-markdown';
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
        const element = document.getElementById('myaio-details');
        html2canvas(element).then((canvas) => {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'recycler-project.png';
            link.click();
        });
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(18);
        doc.text('Recycler Project Details', 20, 20);

        doc.setFontSize(12);
        doc.text(`Object: ${itemDetails.objectName || 'N/A'}`, 20, 30);
        doc.text(`Material: ${itemDetails.material || 'N/A'}`, 20, 40);
        doc.text(`Selected Project: ${itemDetails.selectedItem || 'N/A'}`, 20, 50);
        doc.text(`Timestamp: ${itemDetails.timestamp ? new Date(itemDetails.timestamp).toLocaleString() : 'N/A'}`, 20, 60);

        // Add instructions
        const instructions = itemDetails.instructions || '';
        const splitInstructions = doc.splitTextToSize(instructions, 180);
        doc.text('Instructions:', 20, 70);
        doc.text(splitInstructions, 20, 80);

        // Add video URL if available and not empty
        if (itemDetails.videoUrl && itemDetails.videoUrl.trim() !== '') {
            doc.text('Video Tutorial:', 20, 90 + (splitInstructions.length * 5));
            doc.setTextColor(0, 0, 255);
            doc.textWithLink(itemDetails.videoUrl, 20, 100 + (splitInstructions.length * 5), { url: itemDetails.videoUrl });
            doc.setTextColor(0, 0, 0);
        }

        doc.save('recycler-project.pdf');
    };

    if (loading) {
        return <p>Loading details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="myaio-details-container" id="myaio-details">
            <h1>Recycler Project Details</h1>
            <div className="myaio-item-detail">
                <strong>Object:</strong> {itemDetails.objectName || 'N/A'}
            </div>
            <div className="myaio-item-detail">
                <strong>Material:</strong> {itemDetails.material || 'N/A'}
            </div>
            <div className="myaio-item-detail">
                <strong>Selected Project:</strong> {itemDetails.selectedItem || 'N/A'}
            </div>
            <div className="myaio-item-detail">
                <strong>Instructions:</strong>
                <Markdown>{itemDetails.instructions}</Markdown>
            </div>
            <div className="myaio-item-detail">
                <strong>Timestamp:</strong> {itemDetails.timestamp ? new Date(itemDetails.timestamp).toLocaleString() : 'N/A'}
            </div>

            {itemDetails.videoUrl && itemDetails.videoUrl.trim() !== '' && (
                <div className="myaio-item-detail">
                    <strong>Video Tutorial:</strong>
                    <div className="video-container">
                        <iframe
                            width="560"
                            height="315"
                            src={itemDetails.videoUrl}
                            title={itemDetails.selectedItem}
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            <div className="myaio-buttons">
                <button onClick={downloadImage}>Download as Image</button>
                <button onClick={downloadPDF}>Download as PDF</button>
            </div>
        </div>
    );
};

export default MyAioDetails;
