import { useEffect, useState } from "react";
import Stars from "./Stars";
import { KEY, Loading } from "./App";

export function SelectedMovie({
  selectedId,
  onCloseMovie,
  onAddtowatch,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setuserRate] = useState(0);
  const iswatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  function handleAdd() {
    const newmovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime,
      userRating,
    };
    onAddtowatch(newmovie);
    onCloseMovie();
  }
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  useEffect(() => {
    async function fetchMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    fetchMovieDetails();
  }, [selectedId]);

  useEffect(
    function () {
      if(!title) return;
      document.title = `Movie |${title}`;
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loading></Loading>
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              x
            </button>
            <img src={poster} alt={`poster of the ${movie}`}></img>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} :IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!iswatched ? (
                <>
                  {" "}
                  <Stars
                    size={20}
                    maxrating={10}
                    onsetMovieRating={setuserRate}
                  ></Stars>
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      {" "}
                      ADD AS WATCHED{" "}
                    </button>
                  )}
                </>
              ) : (
                <p>You alredy rated this movie {watchedUserRating}⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring : {actors}</p>
            <p>Directed by : {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
