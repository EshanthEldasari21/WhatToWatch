import React, { useEffect, useState } from 'react';
import './index.css';
import Card from 'react-bootstrap/Card';
import { IoStarSharp } from 'react-icons/io5';
import { FiInfo } from 'react-icons/fi';
import Modal from 'react-bootstrap/Modal';

const Index = () => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalshow, setModalShow] = useState(false);
  const [topRatedMovieDetails, setTopRatedMovieDetails] = useState([]);
  const [topRatedMovieCredits, setTopRatedMovieCredits] = useState([]);
  const [topRatedMoviesOtt, setTopRatedMoviesOtt] = useState([]);
  
  const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWRlM2FkNzQyMDc2YjlhOWM5MjgyNGNmMWZjNzFhZCIsIm5iZiI6MTcwNzgyNTMzNC43MDQsInN1YiI6IjY1Y2I1OGI2MWMwOWZiMDE4MjM4OGVkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O9x6krd9JZ_7XHXuMP4KzjZaFAYXqQPeZ1cK0XTw99M';
  const BASE_URL = 'https://api.themoviedb.org/3';

  const MOVIES_PER_PAGE = 20;

  const fetchAllPages = async (url) => {
    const firstResponse = await fetch(`${url}&page=1`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const firstData = await firstResponse.json();
    const totalPages = Math.min(firstData.total_pages, 5);
    const pageRequests = [];
    for (let page = 2; page <= totalPages; page++) {
      pageRequests.push(
        fetch(`${url}&page=${page}`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        }).then((response) => response.json())
      );
    }

    const remainingPagesData = await Promise.all(pageRequests);

    const allResults = [
      ...firstData.results,
      ...remainingPagesData.flatMap((data) => data.results),
    ];

    return allResults;
  };

  const getTopRatedMovies = async () => {
    const url = `${BASE_URL}/movie/top_rated?language=en-US`;
    try {
      const movies = await fetchAllPages(url);
      setTopRatedMovies(movies || []);
    } catch (err) {
      console.error(err);
    }
  };

    const getTopRatedMovieDetails = async (id) =>{
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWRlM2FkNzQyMDc2YjlhOWM5MjgyNGNmMWZjNzFhZCIsIm5iZiI6MTczMjI2MDI1MS45NzI4ODksInN1YiI6IjY1Y2I1OGI2MWMwOWZiMDE4MjM4OGVkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mCGFLe4OMnf7_Klus6YDHMtlMh54iu9HvcAWp4qDHxk'
      }
    };

    try {
      const response = await fetch(url, options)
      const data = await response.json();
      setTopRatedMovieDetails(data);
      setModalShow(true);
      
    }
    catch (err) {
      console.error(err)
    }
  };

  const getTopRatedMovieCredits = async (id) =>{
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWRlM2FkNzQyMDc2YjlhOWM5MjgyNGNmMWZjNzFhZCIsIm5iZiI6MTczMjI2MDI1MS45NzI4ODksInN1YiI6IjY1Y2I1OGI2MWMwOWZiMDE4MjM4OGVkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mCGFLe4OMnf7_Klus6YDHMtlMh54iu9HvcAWp4qDHxk'
      }
    };

    try {
      const response = await fetch(url, options)
      const data = await response.json();
      setTopRatedMovieCredits(data || []);
    }
    catch (err) {
      console.error(err)
    }

  };

  const getOtt = async (id) =>{
    const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWRlM2FkNzQyMDc2YjlhOWM5MjgyNGNmMWZjNzFhZCIsIm5iZiI6MTczMjI2MDI1MS45NzI4ODksInN1YiI6IjY1Y2I1OGI2MWMwOWZiMDE4MjM4OGVkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mCGFLe4OMnf7_Klus6YDHMtlMh54iu9HvcAWp4qDHxk'
      }
    };

    try {
      const response = await fetch(url, options)
      const data = await response.json();
      setTopRatedMoviesOtt(data || []);
    }
    catch (err) {
      console.error(err)
    }

  }

  useEffect(() => {
    getTopRatedMovies();
  }, []);

  const totalMovies = topRatedMovies.length;
  const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE);

  const paginatedMovies = topRatedMovies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      <div className="headingggg"><p className='dashh'></p><h5 className="genreTitle">Top Rated Movies</h5></div>
      <Card className="cardd">
        {paginatedMovies.map((movie) => (
          <div className="container" key={movie.id}>
            <div className="textCont">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="Poster"
                alt={movie.title}
              />
              <div className="outmost">
                <h5 className="title">{movie.title}</h5>
                <div className="outer">
                  <div className="subtextCont">
                    <p className="releaseYear">{movie.release_date.slice(0, 4)}</p>
                    <div className="rating">
                      <IoStarSharp className="star" />
                      <p className="rate">{Math.floor(movie.vote_average * 10) / 10}</p>
                    </div>
                    <FiInfo
                    className="info"
                    onClick={() => {
                      setModalShow(true);
                      setTopRatedMovieDetails(movie);
                      getTopRatedMovieDetails(movie.id);
                      getTopRatedMovieCredits(movie.id);
                      getOtt(movie.id);
                    }}
                  />
                  </div>
                </div>
              </div>
            </div>
            <p className="overview">{movie.overview}</p>
            <div className="divider"></div>
          </div>
        ))}
      </Card>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index + 1}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

    <Modal show={modalshow} onHide={() => setModalShow(false)} >
 {topRatedMovieDetails && (
    <Modal.Body className='modalBody'>
        <div className="third">
            <img
                src={`https://image.tmdb.org/t/p/w500${topRatedMovieDetails.poster_path}`} className='modalPoster'
            />
            <div className="first">
                <h5 className='modalTitle'><strong>{topRatedMovieDetails.original_title}</strong></h5>
                <div className="second">
                    <p className='modalTexts'>{topRatedMovieDetails?.release_date?.slice(0, 4)}</p>
                    <p className='modalTexts'><IoStarSharp className='Star' />{Math.floor(topRatedMovieDetails.vote_average * 10) / 10}</p>
                    <p className='modalTexts'>
                        {topRatedMovieDetails?.genres?.map((genre) => genre?.name?.slice(0, 10))?.join(', ')}
                    </p>

                </div>
                {topRatedMovieCredits && (
                    <div className="castcrewDetails">
                        <div className="castcrewTitle">
                            Cast-
                            <p className="castcrew">
                                {topRatedMovieCredits.cast?.slice(0, 3)?.map((credit) => credit?.name)?.join(', ')}
                            </p>
                        </div>
                        <div className="castcrewTitle1">
                            Director-
                            <p className="castcrew">
                                {topRatedMovieCredits.crew?.find((member) => member?.job === "Director")?.name || "N/A"}
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>

        <p className='overView1'>{topRatedMovieDetails.overview}</p>

<div className="ottCont">
  <h5 className="title">Where to watch</h5>
  <div className="divider"></div>
  {topRatedMoviesOtt?.results?.AD?.flatrate ? (
    <div className="ottDetails">
      {topRatedMoviesOtt.results.AD.flatrate.map((provider, index) => (
        <>
        <div className="ott" key={index}>
          <img
            src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
            alt={`${provider.provider_name} logo`}
            className="ottIcon"
          />
          <div className="section">
          <h6 className="ottTitle">{provider.provider_name}</h6>
          <p className="sub">with subscription</p>
          </div>

          </div>

          </>
      ))}
    </div>
  ) : (
    <p className="noOtt">No OTT providers available</p>
  )}
</div>



    </Modal.Body>
)}

</Modal>
    </>
   
  );
};

export default Index;
