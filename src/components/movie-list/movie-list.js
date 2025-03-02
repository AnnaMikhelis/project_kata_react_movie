import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Spin, Alert, Input, Pagination } from 'antd';
import debounce from 'lodash.debounce';
import MovieCard from '../movie-card/movie-card';
import { searchMovies } from '../../api/movies';
import './movie-list.css';

class MovieList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      loading: false,
      error: null,
      query: '',
      currentPage: 1,
      totalPages: 0,
    };
    this.debouncedSearch = debounce(this.handleSearch, 500);
  }

  handleInputChange = (e) => {
    const query = e.target.value.trim();
    this.setState({ query });

    if (query.length > 2) {
      this.debouncedSearch(query);
    } else {
      this.setState({ movies: [], totalPages: 0 });
    }
  };

  handleSearch = async (query, page = 1) => {
    if (!query) {
      this.setState({ movies: [], totalPages: 0 });
      return;
    }

    this.setState({ loading: true, currentPage: page });
    try {
      const data = await searchMovies(query, this.props.sessionId);
      this.setState({
        movies: data.results || [],
        totalPages: data.total_pages || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Error searching movies:', error);
      this.setState({
        error: 'Failed to load movies. Please try again later.',
        loading: false,
      });
    }
  };

  handlePageChange = (page) => {
    this.handleSearch(this.state.query, page);
  };

  handleRate = async (movieId, rating) => {
    try {
      const success = await this.props.onRate(movieId, rating);
      if (success) {
        this.setState((prevState) => ({
          movies: prevState.movies.map((movie) =>
            movie.id === movieId ? { ...movie, userRating: rating } : movie
          ),
        }));
      }
    } catch (error) {
      console.error('Error rating movie:', error);
    }
  };

  render() {
    const { movies, loading, error, query, currentPage, totalPages } =
      this.state;

    if (loading) {
      return <Spin size="large" />;
    }

    if (error) {
      return <Alert message={error} type="error" />;
    }

    return (
      <>
        {query && movies.length === 0 ? (
          <Alert message="No movies found." type="info" />
        ) : (
          <Row gutter={[16, 16]}>
            {movies.map((movie) => (
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                span={8}
                key={movie.id}
              >
                <MovieCard
                  title={movie.title}
                  overview={movie.overview}
                  posterPath={movie.poster_path}
                  genreIds={movie.genre_ids}
                  voteAverage={movie.vote_average}
                  userRating={movie.userRating}
                  onRate={(id, rating) => this.handleRate(id, rating)}
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
            onChange={this.handlePageChange}
          />
        )}
      </>
    );
  }
}

MovieList.propTypes = {
  onRate: PropTypes.func.isRequired,
  sessionId: PropTypes.string.isRequired,
};

export default MovieList;
