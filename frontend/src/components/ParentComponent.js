// ParentComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterPanel from './FilterPanel';

const ParentComponent = () => {
  const [languages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Load API base URL from environment variable

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const token = localStorage.getItem('token');
        const [languagesRes, genresRes, authorsRes, tagsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/languages`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/genres`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/authors`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/tags`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setLanguages(languagesRes.data);
        setGenres(genresRes.data);
        setAuthors(authorsRes.data);
        setTags(tagsRes.data);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilters();
  }, [API_BASE_URL]); // Include API_BASE_URL in the dependency array

  return (
    <div>
      <FilterPanel 
        languages={languages} 
        genres={genres} 
        authors={authors} 
        tags={tags} 
        onTagSelect={(tag) => console.log('Selected tag:', tag)}
      />
    </div>
  );
};

export default ParentComponent;
