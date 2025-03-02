import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import { getImageUrl } from '../../api/imageUtils';
import { GenresContext } from '../../context/GenresContext';
import './movie-card.css';

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
      <img
        src={getImageUrl(posterPath)}
        alt={title}
        className="movie-card__poster"
      />

      <div className="movie-card__content">
        <div className="movie-card__header">
          <h3 className="movie-card__title">{title}</h3>
          <div
            className="movie-card__rating-circle"
            style={{ color: getRatingColor(voteAverage) }}
          >
            {voteAverage !== undefined ? voteAverage.toFixed(1) : '-'}
          </div>
        </div>

        <div className="movie-card__genres">
          {genreIds &&
            genreIds.map((id) => {
              const genre = genres.find((g) => g.id === id);
              return genre ? <span key={id}>{genre.name}, </span> : null;
            })}
        </div>

        <p className="movie-card__overview">{overview}</p>

        <Rate
          defaultValue={userRating || 0}
          onChange={(value) => onRate(id, value * 2)}
          style={{ color: userRating ? '#FFA500' : '#ccc' }}
        />
      </div>
    </div>
  );
};

const getRatingColor = (rating) => {
  if (rating === undefined) return '#ccc';
  if (rating >= 7) return '#66E900';
  if (rating >= 5) return '#E9D100';
  return '#E90000';
};

MovieCard.propTypes = {
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  posterPath: PropTypes.string,
  genreIds: PropTypes.arrayOf(PropTypes.number),
  voteAverage: PropTypes.number,
  userRating: PropTypes.number,
  onRate: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default MovieCard;
