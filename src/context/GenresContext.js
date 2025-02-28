import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Импортируем PropTypes
import { fetchGenres } from '../api/genres';

export const GenresContext = createContext();

export const GenresProvider = ({ children }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Error loading genres:', error);
      }
    };
    loadGenres();
  }, []);

  return (
    <GenresContext.Provider value={genres}>{children}</GenresContext.Provider>
  );
};

// Определяем типы пропсов
GenresProvider.propTypes = {
  children: PropTypes.node.isRequired, // Указываем, что children должен быть узлом React
};
