import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Alert, Pagination } from 'antd';
import PropTypes from 'prop-types';
import MovieCard from '../movie-card/movie-card';
import { getRatedMovies } from '../../api/movies';
import './RatedMovies.css';

const RatedMovies = ({ sessionId, refreshRated }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadRatedMovies = async () => {
      try {
        setLoading(true);
        const data = await getRatedMovies(sessionId, currentPage);
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 0);
        setLoading(false);
      } catch (error) {
        console.error('Error loading rated movies:', error);
        setLoading(false);
      }
    };

    loadRatedMovies();
  }, [sessionId, currentPage, refreshRated]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="rated-movies">
      {loading ? (
        <div className="rated-movies__loading">
          <Spin size="large" />
        </div>
      ) : movies.length === 0 ? (
        <Alert message="No rated movies found." type="info" />
      ) : (
        <Row gutter={[16, 16]}>
          {movies.map((movie) => (
            <Col span={8} key={movie.id}>
              <MovieCard
                title={movie.title}
                overview={movie.overview}
                posterPath={movie.poster_path}
                genreIds={movie.genre_ids}
                voteAverage={movie.vote_average}
                userRating={movie.userRating}
                onRate={() => {}}
                id={movie.id}
              />
            </Col>
          ))}
        </Row>
      )}
      {totalPages > 1 && (
        <Pagination
          current={currentPage}
          total={totalPages * 10}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

RatedMovies.propTypes = {
  sessionId: PropTypes.string.isRequired,
  refreshRated: PropTypes.bool.isRequired,
};

export default RatedMovies;
