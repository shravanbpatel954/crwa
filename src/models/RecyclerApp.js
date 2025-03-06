import React, { useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './RecyclerApp.css';
import Markdown from 'react-markdown';
import { saveRecyclerData } from '../components/firestoreService';

const languageOptions = [
  { label: 'English', code: 'en' },
  { label: 'Hindi', code: 'hi' },
  { label: 'Marathi', code: 'mr' },
  { label: 'Gujarati', code: 'gu' },
  { label: 'Tamil', code: 'ta' },
  { label: 'Telugu', code: 'te' },
  { label: 'Bengali', code: 'bn' },
  { label: 'Kannada', code: 'kn' },
  { label: 'Punjabi', code: 'pa' },
  { label: 'Malayalam', code: 'ml' },
];

const Form = ({ objectName, material, onObjectNameChange, onMaterialChange, onGenerateSuggestions, isLoading, onLanguageChange, language }) => (
  <div className="form-container fade-in">
    <div className="input-section">
      <label>Select Language:</label>
      <select onChange={(e) => onLanguageChange(e.target.value)} value={language}>
        {languageOptions.map((lang) => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
      <label>Enter an Object to Reuse:</label>
      <input
        type="text"
        value={objectName}
        onChange={(e) => onObjectNameChange(e.target.value)}
        placeholder="e.g., Plastic Bottle, Old T-shirt"
      />
      <label>Specify the Material (Optional):</label>
      <input
        type="text"
        value={material}
        onChange={(e) => onMaterialChange(e.target.value)}
        placeholder="e.g., Plastic, Cotton, Metal"
      />
      <button onClick={onGenerateSuggestions} disabled={!objectName || isLoading}>
        {isLoading ? <div className="loading-spinner"></div> : 'Generate Reuse Suggestions'}
      </button>
    </div>
  </div>
);

const Suggestions = ({ suggestions, onSelectSuggestion, suggestionsLoading }) => (
  <div className="suggestions-section fade-in">
    {suggestionsLoading ? (
      <SkeletonTheme baseColor="#2b2b2b" highlightColor="#444">
        <div className="skeleton-loader">
          <Skeleton height={30} width={200} style={{ marginBottom: '1rem' }} />
          <Skeleton count={5} style={{ marginBottom: '0.5rem' }} />
        </div>
      </SkeletonTheme>

    ) : (
      <>
        <h2>What Can You Create From This Object?</h2>
        <ul>
          {suggestions.map((item, index) => (
            <li key={index}>
              <button onClick={() => onSelectSuggestion(item.name)}>{item.name}: {item.description}</button>
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
);

const Instructions = ({ instructions, videoUrl, isLoading, selectedSuggestion }) => (
  <div className="instructions-section fade-in">
    {isLoading ? (
      <SkeletonTheme baseColor="#2b2b2b" highlightColor="#444">
        <div className="skeleton-loader">
          <Skeleton height={30} width={200} style={{ marginBottom: '1rem' }} />
          <Skeleton count={6} style={{ marginBottom: '0.5rem' }} />
        </div>
      </SkeletonTheme>

    ) : (
      <div>
        <h2>Steps to Create {selectedSuggestion}:</h2>
        <Markdown>{instructions}</Markdown>
        {videoUrl && (
          <div className="media-container">
            <h3>Recommended Video:</h3>
            <iframe
              width="560"
              height="315"
              src={videoUrl}
              title={selectedSuggestion}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    )}
  </div>
);

const RecyclerApp = () => {
  const [objectName, setObjectName] = useState('');
  const [material, setMaterial] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [instructions, setInstructions] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [page, setPage] = useState('form');
  const [isSaving, setIsSaving] = useState(false);
  const [recyclerData, setRecyclerData] = useState(null);

  const genAI = new GoogleGenerativeAI('AIzaSyD9M9EFr1YV6_W9_EDVczaBG5JYk4_umKs');
  const youtubeAPIKey = 'AIzaSyATfSrHAfTIv5EB_JsZR6kkVM6VJndPug0';

  const handleGenerateSuggestions = async () => {
    try {
      setSuggestionsLoading(true);
      setSuggestions([]);
      setSelectedSuggestion(null);
      setInstructions('');
      setVideoUrl(null);
      setPage('suggestions');

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash'});
      const prompt = `Suggest multiple creative reuse ideas for ${objectName}, made of ${material}. Each suggestion should be clear and concise.`;
      const result = await model.generateContent(prompt);
      const generatedResponse = await result.response.text();
      const suggestedItems = generatedResponse.split('\n').map(item => {
        const [name, description] = item.split(':').map(part => part.trim());
        return { name, description };
      }).filter(item => item.name && item.description);
      setSuggestions(suggestedItems);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSelectSuggestion = async (selectedItem) => {
    try {
      setIsLoading(true);
      setSelectedSuggestion(selectedItem);
      setPage('instructions');

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash'});
      const prompt = `Provide detailed steps to create ${selectedItem} from ${objectName}, made of ${material}.`;
      const result = await model.generateContent(prompt);
      const generatedResponse = await result.response.text();
      const instructionsText = generatedResponse.trim();
      setInstructions(instructionsText);

      const data = {
        objectName,
        material,
        selectedItem,
        instructions: instructionsText,
        language,
        timestamp: new Date().toISOString()
      };
      
      if (videoUrl) {
        data.videoUrl = videoUrl;
      }
      setRecyclerData(data);

      const videoSearchTerm = encodeURIComponent(`${selectedItem} DIY tutorial`);
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${videoSearchTerm}&key=${youtubeAPIKey}&type=video&maxResults=1`);
      const video = response.data.items[0];
      setVideoUrl(video ? `https://www.youtube.com/embed/${video.id.videoId}` : null);
    } catch (error) {
      console.error('Error generating instructions or fetching video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (page === 'instructions') {
      setPage('suggestions');
    } else if (page === 'suggestions') {
      setPage('form');
    }
  };

  const handleNextPage = () => {
    if (page === 'form') {
      setPage('suggestions');
    } else if (page === 'suggestions') {
      setPage('instructions');
    }
  };

  return (
    <div className="main-container">
      {page === 'form' && (
        <Form
          objectName={objectName}
          material={material}
          onObjectNameChange={setObjectName}
          onMaterialChange={setMaterial}
          onGenerateSuggestions={handleGenerateSuggestions}
          isLoading={suggestionsLoading}
          onLanguageChange={setLanguage}
          language={language}
        />
      )}
      {page === 'suggestions' && (
        <Suggestions 
          suggestions={suggestions} 
          onSelectSuggestion={handleSelectSuggestion}
          suggestionsLoading={suggestionsLoading}
        />
      )}
      {page === 'instructions' && (
        <Instructions
          instructions={instructions}
          videoUrl={videoUrl}
          isLoading={isLoading}
          selectedSuggestion={selectedSuggestion}
        />
      )}
      <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        {page !== 'form' && (
          <button 
            onClick={handlePreviousPage} 
            style={{
              backgroundColor: '#D32F2F',
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              textAlign: 'center', 
              textDecoration: 'none', 
              fontSize: '16px', 
              borderRadius: '5px', 
              cursor: 'pointer',
              flex: 1
            }}
          >
            Previous
          </button>
        )}
        {page === 'instructions' && (
          <button 
            onClick={async () => {
              try {
                setIsSaving(true);
                await saveRecyclerData(recyclerData);
                alert('Data saved successfully!');
              } catch (error) {
                console.error('Error saving data:', error);
                alert('Failed to save data.');
              } finally {
                setIsSaving(false);
              }
            }}
            disabled={isSaving}
            style={{
              backgroundColor: '#2196F3',
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              textAlign: 'center', 
              textDecoration: 'none', 
              fontSize: '16px', 
              borderRadius: '5px', 
              cursor: 'pointer',
              flex: 1
            }}
          >
            {isSaving ? 'Saving...' : 'Save Project'}
          </button>
        )}
        {page !== 'instructions' && (
          <button 
            onClick={handleNextPage} 
            style={{
              backgroundColor: '#4CAF50',
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              textAlign: 'center', 
              textDecoration: 'none', 
              fontSize: '16px', 
              borderRadius: '5px', 
              cursor: 'pointer',
              flex: 1
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default RecyclerApp;
