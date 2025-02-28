import MovieList from './components/movie-list/movie-list';
import React, { useState, useEffect, useRef } from 'react'; // Добавляем useRef
import { Tabs, Input } from 'antd';
import { createGuestSession, rateMovie, getRatedMovies } from './api/movies';
import { GenresProvider } from './context/GenresContext';
import RatedMovies from './components/RatedMovies/RatedMovies';
import './components/app.css';

const { TabPane } = Tabs;

const App = () => {
  const [sessionId, setSessionId] = useState(null);
  const [refreshRated, setRefreshRated] = useState(false);

  // Создаём ref для MovieList
  const movieListRef = useRef(null);

  useEffect(() => {
    const initSession = async () => {
      const session = await createGuestSession();
      setSessionId(session);
    };
    initSession();
  }, []);

  if (!sessionId) {
    return <div>Loading...</div>;
  }

  const handleRate = async (movieId, rating) => {
    try {
      const success = await rateMovie(movieId, rating, sessionId);
      if (success) {
        console.log(`Movie ${movieId} rated successfully with ${rating}`);
        setRefreshRated((prev) => !prev); // Переключаем флаг для обновления данных
      } else {
        console.error('Failed to rate the movie');
      }
    } catch (error) {
      console.error('Error rating movie:', error);
    }
  };

  return (
    <GenresProvider>
      <div className="app">
        {/* Заголовок */}
        <h1>Movie Search App</h1>

        {/* Контейнер для табов */}
        <div className="tabs-container">
          <Tabs defaultActiveKey="1">
            {/* Первый таб: Поиск фильмов */}
            <TabPane tab="Search Movies" key="1">
              <div className="movie-list-container">
                {/* Поле поиска */}
                <Input
                  placeholder="Search movies..."
                  onChange={(e) => {
                    if (movieListRef.current) {
                      movieListRef.current.handleInputChange(e);
                    }
                  }}
                  style={{ marginBottom: 20, width: '100%' }}
                />
                {/* Компонент MovieList */}
                <MovieList
                  ref={movieListRef} // Присваиваем ref
                  sessionId={sessionId}
                  onRate={handleRate}
                />
              </div>
            </TabPane>

            {/* Второй таб: Оценённые фильмы */}
            <TabPane tab="Rated Movies" key="2">
              <div className="movie-list-container">
                <RatedMovies
                  sessionId={sessionId}
                  refreshRated={refreshRated}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </GenresProvider>
  );
};

export default App;
