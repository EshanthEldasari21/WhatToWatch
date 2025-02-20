import React, { useState } from 'react';
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { IoSearchOutline } from 'react-icons/io5';
import WhatToWatch from '../../../public/WhatToWatchYellow.png'

const Header = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [genreMovies, setGenreMovies] = useState([]);
  const [languageMovies, setLanguageMovies] = useState([]);
  const [upcomingLanguageMovies, setUpcomingLanguageMovies] = useState([]);
  const [trendingLanguageMovies, setTrendingLanguageMovies] = useState([]);
  const navigate = useNavigate();

  const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWRlM2FkNzQyMDc2YjlhOWM5MjgyNGNmMWZjNzFhZCIsIm5iZiI6MTcwNzgyNTMzNC43MDQsInN1YiI6IjY1Y2I1OGI2MWMwOWZiMDE4MjM4OGVkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O9x6krd9JZ_7XHXuMP4KzjZaFAYXqQPeZ1cK0XTw99M'; // Replace with your actual API key.
  const BASE_URL = 'https://api.themoviedb.org/3';

  const getSearchedMovie = async () => {
    const url = `${BASE_URL}/search/movie?query=${inputValue}&include_adult=false&language=en-US`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSearchResults(data.results);

      navigate('/search', { state: { searchResults: data.results, searchedMovie : inputValue } });
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

    const fetchAllPages = async (url) => {
        const firstResponse = await fetch(`${url}`, {
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

  const getGenreMovies = async (genreId) => {
    const url = `${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}&with_origin_country=IN`;   
    try {
      const movies = await fetchAllPages(url);
      const today = new Date();
      const filteredMovies = movies.filter((movie) => {
          const releaseDate = new Date(movie.release_date);
          return releaseDate <= today;
      });

      const sortedMovies = filteredMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      setGenreMovies(sortedMovies || []);
      navigate('/genre', { state: { genreMovies: sortedMovies, genre : genreId} });
  } catch (error) {
      console.error("Error fetching now playing movies:", error);
  }
  };

  const getLanguageMovies = async (lan) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);
  
    const formatDate = (date) => date.toISOString().split("T")[0];
    const urls = [
      `${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_count.desc&with_original_language=${lan}`, // Popular
      `${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=primary_release_date.desc&primary_release_date.gte=${formatDate(tomorrow)}&primary_release_date.lte=${formatDate(oneYearLater)}&with_original_language=${lan}`, // Upcoming
      `${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_original_language=${lan}`, // Trending
    ];
  
    try {
      const [popularMovies, upcomingMovies, trendingMovies] = await Promise.all(
        urls.map((url) => fetchAllPages(url))
      );
  
      const filterAndSortMovies = (movies) =>
        movies
          .filter((movie) => {
            const releaseDate = new Date(movie.release_date);
            return releaseDate <= today;
          })
          .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  
      const filterAndSortUpcomingMovies = (movies) =>
        movies
          .filter((movie) => {
            const releaseDate = new Date(movie.release_date);
            return releaseDate > today; 
          })
          .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
  
      const filteredPopularMovies = filterAndSortMovies(popularMovies);
      const filteredUpcomingMovies = filterAndSortUpcomingMovies(upcomingMovies);
      const filteredTrendingMovies = filterAndSortMovies(trendingMovies);
  
      const topFiveTrendingMovies = filteredTrendingMovies.slice(0, 5);
  
      setLanguageMovies(filteredPopularMovies);
      setUpcomingLanguageMovies(filteredUpcomingMovies);
      setTrendingLanguageMovies(topFiveTrendingMovies); 
  
      navigate("/languages", {
        state: {
          languageMovies: filteredPopularMovies,
          upcomingLanguageMovies: filteredUpcomingMovies,
          trendingLanguageMovies: topFiveTrendingMovies, 
          language: lan,
        },
      });
    } catch (error) {
      console.error("Error fetching language movies:", error);
    }
  };
  
  return (
    <Navbar expand="lg" className="nav">
          <Nav.Link as={Link} to="/">
            <img
              src= {WhatToWatch}
              alt="Logo"
              width={160}
              height={35}
            />
          </Nav.Link>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button
              variant="outline-success"
              className="searchBtn"
              onClick={getSearchedMovie}
            >
              <IoSearchOutline className="searchIcon" />
            </Button>
          </Form>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav className="headingTops">
            <Nav.Link as={Link} to="/" className="navLink">
              Home
            </Nav.Link>
            <NavDropdown title="Genre" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => getGenreMovies(28)}>
                Action
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getGenreMovies(18)}>
                Drama
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getGenreMovies(53)}>
                Thriller
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getGenreMovies(35)}>
                Comedy
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getGenreMovies(27)}>
                Horror
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getGenreMovies(878)}>
                Sci-fi
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getGenreMovies(12)}>
                Adventure
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getGenreMovies(16)}>
                Animation
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getGenreMovies(80)}>
                Crime
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getGenreMovies(36)}>
                History
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getGenreMovies(9648)}>
                Mystery
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getGenreMovies(10749)}>
                Romance
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Languages" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => { getLanguageMovies("te") } }>
                Telugu
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getLanguageMovies("ta")}>
                Tamil
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getLanguageMovies("ml")}>
                Malayalam
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getLanguageMovies("kn")}>
                Kannada
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getLanguageMovies("hi")}>
                Hindi
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getLanguageMovies("bn")}>
                Bengali
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getLanguageMovies("mr")}>
                Marathi
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getLanguageMovies("as")}>
                Assamese
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getLanguageMovies("pa")}>
                Punjabi
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getLanguageMovies("or")}>
                Oriya
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => getLanguageMovies("en")}>
                English
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/top-rated" className="navLink">
              Top Rated
            </Nav.Link>
          
          </Nav>
    </Navbar>
  );
};

export default Header;
