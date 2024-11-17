import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../styles/MoviePage.css';
import { useMovies } from '../../context/MoviesContext'; 

const serverUrl = process.env.REACT_APP_API_URL;

function MoviePage() {
    const { movieName } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchMovie = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${serverUrl}/movies/search-movies?query=${encodeURIComponent(movieName)}`
          );

          if (!response.ok) {
            throw new Error("Movie not found");
          }
          const data = await response.json();
          if (data && data.length > 0) {
            setMovie(data[0]);
          } else {
            setMovie(null);
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchMovie();
    }, [movieName, serverUrl]);

    return (
        <div className="home-container">
            <Navbar />
            <div className="moviepage-main">
                {loading && <div className="moviepage-loading-message">Loading...</div>}
                {error && <div className="moviepage-error-message">Error: {error}</div>}
                {!loading && !error && !movie && (
                    <div className="moviepage-error-message">Movie not found</div>
                )}
                {movie && (
                    <div className="moviepage-container">
                        <div className="moviepage-details">
                            <img
                                src={movie.poster_path || '/assets/sample_image.jpg'}
                                alt={movie.title || "Sample Movie"}
                                className="moviepage-poster"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/sample_image.jpg';
                                }}
                            />
                            <div className="moviepage-info">
                                <h1>{movie.title}</h1>
                                <p><strong>Overview:</strong> {movie.overview}</p>
                                <p><strong>Release Year:</strong> {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                                <p><strong>Duration:</strong> {movie.duration} minutes</p>
                                <p><strong>Genres:</strong> {movie.genres?.join(', ') || 'N/A'}</p>
                                <p><strong>Rating:</strong> {movie.rating}</p>
                                <p><strong>Cast:</strong> {movie.cast}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default MoviePage;
