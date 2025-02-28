const BASE_URL = 'https://api.themoviedb.org/3';
const BEARER_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Y2I0YzZjZjEwNzVmMTg4OTM0YTc1YTRmMWY3YjI1YyIsIm5iZiI6MTczODc3MzY2OC42MjQsInN1YiI6IjY3YTM5NGE0ZWUzOTMyYTY3MjlmZTg0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OGhF5cdeuGRa3A1FEdMBCQV6dtHckipYP1xM5_GaZcg';

export const fetchGenres = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list`, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return { genres: [] };
  }
};
