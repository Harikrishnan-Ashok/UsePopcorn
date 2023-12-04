import { useEffect, useState } from "react";
import { WatchedSummary } from "./WatchedSummary";
import { SelectedMovie } from "./SelectedMovie";
import { MovieList } from "./MovieList";
import { Box } from "./Box";
import { WatchedMovieList } from "./WatchedMovieList";
import { Result } from "./Result";
import { Serch } from "./Serch";
import { Logo } from "./Logo";

export const KEY = "3b4a2d88";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}

export function Loading() {
  return <p className="loader"> LOADING.....</p>;
}
function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}
export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleAddtoWatch(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handledeletewatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(() => {
    async function fetchMovie() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        if (!res.ok) {
          throw new Error("hello world");
        }
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("movie Not found");
        }
        setMovies(data.Search);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length === 0) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovie();
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo></Logo>
        <Serch query={query} setQuery={setQuery}></Serch>
        <Result movies={movies}></Result>
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loading></Loading>}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error}></ErrorMessage>}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddtowatch={handleAddtoWatch}
              watched={watched}
            ></SelectedMovie>
          ) : (
            <>
              <WatchedSummary watched={watched}></WatchedSummary>
              <WatchedMovieList
                watched={watched}
                ondelete={handledeletewatched}
              ></WatchedMovieList>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
