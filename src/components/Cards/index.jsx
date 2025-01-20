import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import Card from 'react-bootstrap/Card';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdPlayCircleOutline } from "react-icons/md";
import { IoStarSharp } from "react-icons/io5";
import { FiInfo } from "react-icons/fi";
import Modal from 'react-bootstrap/Modal';
import { IoMdPlay } from "react-icons/io";
import YouTube from 'react-youtube';
import { BsExclamationCircle } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { RiExternalLinkFill } from "react-icons/ri";
import ImageNotFound from '../../../public/Image-not-found.png';
import BookMyShow from '../../../public/bms.png';


const Index = () => {
    const [nowPlayingMovieDetails, setNowPlayingMovieDetails] = useState([]);
    const [popularMovieDetails, setPopularMovieDetails] = useState([]);
    const [upcomingMovieDetails, setUpComingMovieDetails] = useState([]);
    const [trendingPeople, setTrendingPeople] = useState([]);
    const [credits, setCredits] = useState([]);
    const sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [particularMovieDetails, setParticularMovieDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailer, setTrailer] = useState([]);
    const [loading, setLoading] = useState(true);


    const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWRlM2FkNzQyMDc2YjlhOWM5MjgyNGNmMWZjNzFhZCIsIm5iZiI6MTcwNzgyNTMzNC43MDQsInN1YiI6IjY1Y2I1OGI2MWMwOWZiMDE4MjM4OGVkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O9x6krd9JZ_7XHXuMP4KzjZaFAYXqQPeZ1cK0XTw99M'; // Replace with your actual API key.
    const BASE_URL = 'https://api.themoviedb.org/3';

    const fetchAllPages = async (url, region = "IN") => {
        const firstResponse = await fetch(`${url}&page=1&region=${region}`, {
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
                fetch(`${url}&page=${page}&region=${region}`, {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${API_KEY}`,
                    },
                }).then(response => response.json())
            );
        }

        const remainingPagesData = await Promise.all(pageRequests);

        const allResults = [
            ...firstData.results,
            ...remainingPagesData.flatMap(data => data.results),
        ];

        return allResults;
    };

    const getNowPlayingMovieDetails = async () => {
        const url = `${BASE_URL}/movie/now_playing?language=en-US`;
        try {
            const movies = await fetchAllPages(url);
            const today = new Date();
            const filteredMovies = movies.filter((movie) => {
                const releaseDate = new Date(movie.release_date);
                return releaseDate <= today;
            });

            const sortedMovies = filteredMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            setNowPlayingMovieDetails(sortedMovies || []);
        } catch (error) {
            console.error("Error fetching now playing movies:", error);
        }
    };
    const getPopularMovieDetails = async () => {
        const url = `${BASE_URL}/trending/movie/day?language=en-US`;
        try {
            const movies = await fetchAllPages(url);
            const tenDaysAgo = new Date();
            tenDaysAgo.setDate(tenDaysAgo.getDate() - 15);

            const filteredMovies = movies.filter((movie) => {
                const releaseDate = new Date(movie.release_date);
                return releaseDate >= tenDaysAgo;
            });

            const sortedMovies = filteredMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            setPopularMovieDetails(sortedMovies || []);
        } catch (error) {
            console.error("Error fetching trending movies:", error);
        }
    };

    const getUpComingMovieDetails = async () => {
        const url = `${BASE_URL}/movie/upcoming?language=en-US`;
        try {
            const movies = await fetchAllPages(url);

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            const fifteenDaysLater = new Date(tomorrow);
            fifteenDaysLater.setDate(tomorrow.getDate() + 15);

            const filteredMovies = movies.filter((movie) => {
                const releaseDate = new Date(movie.release_date);
                return releaseDate >= tomorrow && releaseDate <= fifteenDaysLater;
            });

            const sortedMovies = filteredMovies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
            setUpComingMovieDetails(sortedMovies || []);
        } catch (error) {
            console.error("Error fetching upcoming movies:", error);
        }
    };

    const getTrendingCelebs = async () => {

        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWRlM2FkNzQyMDc2YjlhOWM5MjgyNGNmMWZjNzFhZCIsIm5iZiI6MTcwNzgyNTMzNC43MDQsInN1YiI6IjY1Y2I1OGI2MWMwOWZiMDE4MjM4OGVkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O9x6krd9JZ_7XHXuMP4KzjZaFAYXqQPeZ1cK0XTw99M'
            }
          };

          try {
            const data = await fetch ('https://api.themoviedb.org/3/trending/person/day?language=en-US', options);
            const result = await data.json();
            setTrendingPeople(result.results || []);
            
          } catch (error) {
            console.error("Error",  error);
            
          }
       


    }

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



    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getNowPlayingMovieDetails(), getPopularMovieDetails(), getUpComingMovieDetails(), getTrendingCelebs()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (sliderRef.current) {
                const nextSlide = (currentSlide + 4) % nowPlayingMovieDetails.length;
                sliderRef.current.slickGoTo(nextSlide);
                setCurrentSlide(nextSlide);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [currentSlide, nowPlayingMovieDetails.length]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 700,
        slidesToShow: 4,
        slidesToScroll: 2,
        cssEase: 'ease-in-out'
    };

    const settings2 = {
        dots: false,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        cssEase: 'ease-in-out'
    };

    const settings3 = {
        dots: false,
        infinite: true,
        speed: 700,
        slidesToShow: 4,
        slidesToScroll: 1,
        cssEase: 'ease-in-out'
    };

    const ShimmerCard = () => (
        <div className="shimmer-card">
            <div className="shimmer-img"></div>
            <div className="shimmer-title"></div>
            <div className="shimmer-details">
                <div className="shimmer-date"></div>
                <div className="shimmer-rating"></div>
                <div className="shimmer-info"></div>
            </div>
            <div className="shimmer-trailer"></div>
        </div>
    );

    const ShimmerCard2 = () => (
        <div className="shimmer-card">
            <div className="shimmer-img"></div>
            <div className="shimmer-title"></div>
            <div className="shimmer-date"></div>
            <div className="shimmer-details">
                <div className="shimmer-trailer"></div>
                <div className="shimmer-info"></div>
            </div>
        </div>
    );

    const profession = {
        "Directing" :"Director",
        "Acting" : "Actor",
        "Creator" : "Producer"
    }

    return (
        <>

            <div className="popularMovie">
                <Slider {...settings2}  >
                    {popularMovieDetails.map((details) => (
                        <>

                            <img className='popularImg1' src={details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : ImageNotFound} width={'1350vw'} height={'580vh'} />
                            <div className="popularMovieCredits">
                                <h2 className="popularTitle">{details.title}</h2>
                                <div className="popularFurther">
                                    <div className="popularTrailer" onClick={() => { getTrailer(details.id) }}><h6><IoMdPlay className='playBtn' />Trailer</h6></div>
                                    <div className='popularMovieInfo'> More Info <FiInfo onClick={() => { getParticularMovieDetails(details.id); getCredits(details.id); }} /></div>
                                </div>
                            </div>
                        </>
                    ))}
                </Slider>
            </div>

            <div className="cardsContainer">
                {loading ? <div className="shimmer-heading"></div> : <div className="heading"><p className='dash'></p><h5>Now Playing <MdPlayCircleOutline />
                </h5></div>}
                <Slider {...settings} ref={sliderRef}>

                    {loading
                        ? Array(4).fill(0).map((_, index) => <ShimmerCard key={index} />)
                        : nowPlayingMovieDetails.map((nowPlayingMovieDetail) => (
                            <Card className="cards" key={nowPlayingMovieDetail.id}>
                                <Card.Img
                                    variant="top"
                                    src={
                                        nowPlayingMovieDetail.poster_path
                                            ? `https://image.tmdb.org/t/p/original${nowPlayingMovieDetail.poster_path}`
                                            : ImageNotFound
                                    }
                                    alt="Image not Found"
                                    className="cardImg"
                                />

                                <Card.Body className='cardBody'>
                                    <Card.Title className='cardTitle'>{nowPlayingMovieDetail.title}</Card.Title>
                                    <Card.Text className='cardText'>
                                        <div className="outsideContt">
                                            <div className="date">{convertDateToWords(nowPlayingMovieDetail.release_date)}</div>
                                            <div className="cardTextInfo"><IoStarSharp className='stAAr' />{Math.floor(nowPlayingMovieDetail.vote_average * 10) / 10}</div>
                                            <FiInfo onClick={() => { getParticularMovieDetails(nowPlayingMovieDetail.id); getCredits(nowPlayingMovieDetail.id); }} />
                                        </div></Card.Text>
                                    <Card.Text className='cardText'>
                                        <div onClick={() => { getTrailer(nowPlayingMovieDetail.id) }}><h6 className='watchTrailer'><IoMdPlay className='playBtn' />Trailer</h6></div>

                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        ))}
                </Slider>
            </div>

            <div className="cardsContainer">
                {loading ? <div className="shimmer-heading"></div> : <div className="heading"><p className='dash'></p><h5> Upcoming
                </h5></div>}
                <Slider {...settings} >
                    {loading
                        ? Array(4).fill(0).map((_, index) => <ShimmerCard2 key={index} />)
                        : upcomingMovieDetails.map((upcomingMovieDetail) => (
                            <Card className="cards" key={upcomingMovieDetail.id} onClick={() => { }}>
                                <Card.Img variant="top" src={upcomingMovieDetail.poster_path ? `https://image.tmdb.org/t/p/original${upcomingMovieDetail.poster_path}` : ImageNotFound} className='cardImg' />
                                <Card.Body className='cardBody'>
                                    <Card.Title className='cardTitle'>{upcomingMovieDetail.title}</Card.Title>
                                    <Card.Text className='cardText'>
                                        <div className="outsideContt">
                                            <div className="date">{convertDateToWords(upcomingMovieDetail.release_date)}</div>

                                        </div></Card.Text>
                                    <Card.Text className='cardText'>
                                        <div className="outsideCont">
                                            <div className="trailer" onClick={() => { getTrailer(upcomingMovieDetail.id) }}><h6><IoMdPlay className='playBtn' />Trailer</h6></div>
                                            <FiInfo onClick={() => { getParticularMovieDetails(upcomingMovieDetail.id); getCredits(upcomingMovieDetail.id); }} />
                                        </div>
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        ))}
                </Slider>
            </div>

            <div className="trendingPeople">
                {loading ? <div className="shimmer-heading"></div> : <div className="heading"><p className='dash'></p><h5>Trending Celebrities
                </h5></div>}
                <Slider {...settings3} >

                    {trendingPeople.map((people) => (
                            <>
                                <div >
                                    <img  className='peopleImg' src={
                                        people.profile_path
                                            ? `https://image.tmdb.org/t/p/original${people.profile_path}`
                                            : ImageNotFound
                                    } />
                                </div>
                                <div className="peopleDetails">
                                    <h5 className="peopleName">{people.name}</h5>
                                    <p className="peopleProf">
  {people?.known_for_department === "Acting"
    ? "Actor"
    : people?.known_for_department === "Directing"
    ? "Director"
    : people?.known_for_department}
</p>
                                </div>
                            </>
                        ))}
                </Slider>
            </div>

            <div className="certification">© 2025 by WhatToWatch.com, Inc.</div>

            <Modal show={showModal} onHide={() => setShowModal(false)} >
                {particularMovieDetails && (
                    <Modal.Body className='modalBody'>
                        <div className="third">
                            <img
                                src={particularMovieDetails.poster_path ? `https://image.tmdb.org/t/p/original${particularMovieDetails.poster_path}` : ImageNotFound} className='modalPoster'
                            />
                            <div className="first">

                                <h5 className='modalTitle'><strong>{particularMovieDetails.title}</strong></h5>
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
                        {particularMovieDetails && (
                            <Modal.Body>
                                {nowPlayingMovieDetails.some(movie => movie.id === particularMovieDetails.id) ? (
                                    <div className="theaterDetails">
                                        <h5 className="theatreHeading">In your nearest theatres</h5>
                                        <div className="divider"></div>
                                        <div className="bms">
                                            <div className="bmscont">
                                                <a className="anchor" target="_blank" rel="noopener noreferrer" href="https://in.bookmyshow.com/">
                                                    <img className="bmsImg" src={BookMyShow} alt="BookMyShow" />
                                                    <RiExternalLinkFill className="linked" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ) : upcomingMovieDetails.some(movie => movie.id === particularMovieDetails.id) ? (
                                    <div className="theaterDetails">
                                        <h5 className="theatreHeading">Soon in your nearest theatres</h5>
                                        <div className="divider"></div>
                                        <div className="bms">
                                            <div className="bmscont">
                                                <a className="anchor" target="_blank" rel="noopener noreferrer" href="https://in.bookmyshow.com/">
                                                    <img className="bmsImg" src={BookMyShow} alt="BookMyShow" />
                                                    <RiExternalLinkFill className="linked" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </Modal.Body>
                        )}

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

export default Index;
