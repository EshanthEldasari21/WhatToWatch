import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import './index.css';
import { FiInfo } from "react-icons/fi";
import Modal from 'react-bootstrap/Modal';
import { IoMdPlay } from "react-icons/io";
import YouTube from 'react-youtube';
import { BsExclamationCircle } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import ImageNotFound from '../../../public/Image-not-found.png';

const Genre =  () =>{
    const location = useLocation();
    const genreMovies = location.state?.genreMovies || [];
    const genre = location.state?.genre || '';
    const languageMovies = location.state?.languageMovies || [];
    const language = location.state?.language || [];
    const [credits, setCredits] = useState([]);
    const [particularMovieDetails, setParticularMovieDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailer, setTrailer] = useState([]);
  
    const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWRlM2FkNzQyMDc2YjlhOWM5MjgyNGNmMWZjNzFhZCIsIm5iZiI6MTcwNzgyNTMzNC43MDQsInN1YiI6IjY1Y2I1OGI2MWMwOWZiMDE4MjM4OGVkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O9x6krd9JZ_7XHXuMP4KzjZaFAYXqQPeZ1cK0XTw99M'; // Replace with your actual API key.
    const BASE_URL = 'https://api.themoviedb.org/3';
    const getParticularMovieDetails = async (id) => {
      const url = `${BASE_URL}/movie/${id}?language=en-US`;
      try {
        const response = await fetch(url, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        const data = await response.json();
        setParticularMovieDetails(data);
        setShowModal(true);
      } catch (err) {
        console.error(err);
      }
    };
  
    const getTrailer = async (id) => {
      const url = `${BASE_URL}/movie/${id}/videos?language=en-US`;
      try {
        const response = await fetch(url, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        const data = await response.json();
        setTrailer(data.results || []);
        setShowTrailer(true);
      } catch (err) {
        console.error(err);
      }
    };
    const convertDateToWords = (dateString) => {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };
  
    const getCredits = async (id) => {
      const url = `${BASE_URL}/movie/${id}/credits?language=en-US`;
      try {
        const response = await fetch(url, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        const data = await response.json();
        setCredits(data || [])
      } catch (err) {
        console.error(err)
      }
    };

    const genreMap = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      18: "Drama",
      36: "Historic",
      27: "Horror",
      9648: "Mystery",
      10749: "Romantic",
      878: "Sci-fi",
      53: "Thriller"
    };
  
    return (
      <>
      <div className="headinggg"><p className='dashh'></p><h5 className="genreTitle">Popular {genreMap[genre]} Movies</h5></div>

      <div className="searchDetailss">
        {genreMovies && genreMovies.length > 0 ? (
          genreMovies.map((movie) => (
            <div key={movie.id} className="cont">
              <div >
                <img
                  src={movie.poster_path? `https://image.tmdb.org/t/p/original${movie.poster_path}` : ImageNotFound}
                  className="poster"
                />
              </div>
              <div className="details">
                <h5 className="movieTitle">{movie.title}</h5>
                <p className="release">{convertDateToWords(movie.release_date)}</p>
              </div>
              <div className="infoDetails">
                <div className="Trailer" onClick={() => { getTrailer(movie.id) }}><h6><IoMdPlay className='playBtn' />Trailer</h6></div>
                <FiInfo className='INFO' onClick={() => { getParticularMovieDetails(movie.id); getCredits(movie.id); }} />
              </div>
            </div>
          ))
        ) : (
          <p>No movies found. Try searching again!</p>
        )}  
      </div >
  
  
      <Modal show={showModal} onHide={() => setShowModal(false)} >
                  {particularMovieDetails && (
                      <Modal.Body className='modalBody'>
                          <div className="third">
                              <img
                                  src={particularMovieDetails.poster_path ? `https://image.tmdb.org/t/p/original${particularMovieDetails.poster_path}`: ImageNotFound} className='modalPoster'
                              />
                              <div className="first">
  
                                  <h5 className='modalTitle'><strong>{particularMovieDetails.original_title}</strong></h5>
                                  <div className="second">
                                      <p className='modalTexts'>{particularMovieDetails.release_date.slice(0, 4)}</p>
                                      <p className='modalTexts'><IoStarSharp className='stAAr' />{Math.floor(particularMovieDetails.vote_average * 10) / 10}</p>
                                      <p className='modalTexts'>
                                          {particularMovieDetails.genres.map((genre) => genre.name.slice(0, 10)).join(', ')}
                                      </p>
  
                                  </div>
  
  
                                  {credits && (
                                      <div className="castcrewDetails">
                                          <div className="castcrewTitle">
                                              Cast-
                                              <p className="castcrew">
                                                  {credits.cast?.slice(0, 3)?.map((credit) => credit?.name)?.join(', ')}
                                              </p>
                                          </div>
                                          <div className="castcrewTitle1">
                                              Director-
                                              <p className="castcrew">
                                                  {credits.crew?.find((member) => member?.job === "Director")?.name || "N/A"}
                                              </p>
                                          </div>
                                      </div>
                                  )}
  
                              </div>
                          </div>
  
                          <p className='overView'>{particularMovieDetails.overview}</p>
  
                      </Modal.Body>
                  )}
  
              </Modal>
  
              <Modal show={showTrailer} onHide={() => setShowTrailer(false)} className='TrailerView'>
                  {trailer.some(
                      (video) =>
                          video.type === "Trailer" ||
                          video.type === "Teaser" ||
                          video.type === "Behind the Scenes" ||
                          video.type === "Featurette"
                  ) ? (
                      trailer.map((video) =>
                          video.type === "Trailer" ||
                              video.type === "Teaser" ||
                              video.type === "Behind the Scenes" ||
                              video.type === "Featurette" ? (
                              <YouTube videoId={video.key} className='video' key={video.key} />
                          ) : null
                      )
                  ) : (
                      <div >
                          <div className="noVideo"><BsExclamationCircle className='exclamation' />
                              <p className='p'>This Video is not Available</p></div>
                          <div className="yt"><FaYoutube className='iconYt' />
                          </div>
                      </div>
  
                  )}
              </Modal>
  
      </>
    );
    
};

export default Genre;