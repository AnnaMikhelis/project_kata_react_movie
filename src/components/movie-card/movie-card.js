import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import { getImageUrl } from '../../api/imageUtils';
import { GenresContext } from '../../context/GenresContext';
import './movie-card.css'; // Импортируем стили

const MovieCard = ({
  title,
  overview,
  posterPath,
  genreIds,
  voteAverage,
  userRating,
  onRate,
  id,
}) => {
  const genres = useContext(GenresContext);

  return (
    <div className="movie-card">
      {/* Постер фильма */}
      <img
        src={getImageUrl(posterPath)}
        alt={title}
        className="movie-card__poster"
      />

      {/* Контент карточки */}
      <div className="movie-card__content">
        {/* Верхняя часть: название и рейтинг */}
        <div className="movie-card__header">
          <h3 className="movie-card__title">{title}</h3>
          <div
            className="movie-card__rating-circle"
            style={{ color: getRatingColor(voteAverage) }}
          >
            {voteAverage !== undefined ? voteAverage.toFixed(1) : '-'}
          </div>
        </div>

        {/* Жанры */}
        <div className="movie-card__genres">
          {genreIds &&
            genreIds.map((id) => {
              const genre = genres.find((g) => g.id === id);
              return genre ? <span key={id}>{genre.name}, </span> : null;
            })}
        </div>

        {/* Описание */}
        <p className="movie-card__overview">{overview}</p>

        {/* Звезды для оценки */}
        <Rate
          defaultValue={userRating || 0}
          onChange={(value) => onRate(id, value * 2)}
          style={{ color: userRating ? '#FFA500' : '#ccc' }} // Цвет звезд: оранжевый, если есть оценка, иначе серый
        />
      </div>
    </div>
  );
};

// Функция для определения цвета рейтинга
const getRatingColor = (rating) => {
  if (rating === undefined) return '#ccc'; // Серый, если рейтинг неопределен
  if (rating >= 7) return '#66E900'; // Зеленый
  if (rating >= 5) return '#E9D100'; // Желтый
  return '#E90000'; // Красный
};

// Определяем типы пропсов
MovieCard.propTypes = {
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  posterPath: PropTypes.string,
  genreIds: PropTypes.arrayOf(PropTypes.number), // Может быть undefined
  voteAverage: PropTypes.number, // Может быть undefined
  userRating: PropTypes.number, // Может быть null
  onRate: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default MovieCard;
