import { WatchedMovie } from "./WatchedMovie";

export function WatchedMovieList({ watched, ondelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          ondelete={ondelete}
        ></WatchedMovie>
      ))}
    </ul>
  );
}
