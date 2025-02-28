const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export const getImageUrl = (path) => {
  return path
    ? `${BASE_IMAGE_URL}${path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
};
