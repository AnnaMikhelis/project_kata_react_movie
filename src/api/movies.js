const BASE_URL = 'https://api.themoviedb.org/3';
const BEARER_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Y2I0YzZjZjEwNzVmMTg4OTM0YTc1YTRmMWY3YjI1YyIsIm5iZiI6MTczODc3MzY2OC42MjQsInN1YiI6IjY3YTM5NGE0ZWUzOTMyYTY3MjlmZTg0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OGhF5cdeuGRa3A1FEdMBCQV6dtHckipYP1xM5_GaZcg';

export const createGuestSession = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  };

  try {
    const response = await fetch(
      `${BASE_URL}/authentication/guest_session/new`,
      options
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.guest_session_id;
  } catch (error) {
    console.error('Error creating guest session:', error);
    return null;
  }
};

export const rateMovie = async (movieId, rating, sessionId) => {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
    body: JSON.stringify({ value: rating }),
  };

  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/rating?guest_session_id=${sessionId}`,
      options
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error rating movie:', error);
    return false;
  }
};

export const getRatedMovies = async (sessionId, page = 1) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  };

  try {
    const response = await fetch(
      `${BASE_URL}/guest_session/${sessionId}/rated/movies?page=${page}`,
      options
    );
    if (!response.ok && response.status !== 404) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.results ? data : { results: [], total_pages: 0 };
  } catch (error) {
    console.error('Error fetching rated movies:', error);
    return { results: [], total_pages: 0 };
  }
};

export const searchMovies = async (query, sessionId) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  };

  try {
    const searchResponse = await fetch(
      `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`,
      options
    );
    if (!searchResponse.ok) {
      throw new Error(`Error: ${searchResponse.status}`);
    }
    const searchData = await searchResponse.json();

    const ratedResponse = await fetch(
      `${BASE_URL}/guest_session/${sessionId}/rated/movies`,
      options
    );
    if (!ratedResponse.ok && ratedResponse.status !== 404) {
      throw new Error(`Error: ${ratedResponse.status}`);
    }
    const ratedData = await ratedResponse.json();

    const ratedMoviesMap = {};
    if (ratedData.results) {
      ratedData.results.forEach((movie) => {
        ratedMoviesMap[movie.id] = movie.rating;
      });
    }

    const moviesWithRatings = searchData.results.map((movie) => ({
      ...movie,
      userRating: ratedMoviesMap[movie.id] || null,
    }));

    return {
      ...searchData,
      results: moviesWithRatings,
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    return { results: [], total_pages: 0 };
  }
};
