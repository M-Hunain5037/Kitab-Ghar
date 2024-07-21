// ParentComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterPanel from './FilterPanel';

const ParentComponent = () => {
  const [languages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const token = localStorage.getItem('token');
        const [languagesRes, genresRes, authorsRes, tagsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/languages', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/genres', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/authors', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/tags', { headers: { Authorization: `Bearer ${token}` } }),
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
  }, []);

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
