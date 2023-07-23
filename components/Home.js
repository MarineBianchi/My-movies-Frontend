import { useState } from 'react';
import { useEffect } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {

  // Tableau contenant mes liked movies
  const [likedMovies, setLikedMovies] = useState([]);

  // Liked movies (inverse data flow)

  // Fonction qui ajoute des movies seulement si ils n'y sont pas et enlève si ils y sont
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  // on map dans le tableau de likedmovies > génére un span pour chaque composant avec icone croix cliquable qui déclenche la fonction onClick de mise à jour (donc de suppression comme le movie sera dans le tableau)

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  // module de la librairie Ant Design
  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  // Initialisation de l'état de données en tableau vide avant le fetch
  const [MoviesData, setMoviesData] = useState([]);

  // On fetch dans un useEffect pour ne pas faire une boucle infinie et implémenter les données de l'API à l'initialisation du composant
  useEffect(() => {
    fetch('http://localhost:3000/movies')
      .then(response => response.json())
      .then(data => {
        console.log(data.movies);
      
        const MoviesData = data.movies.map(movie => {
        const poster = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;    

        // reformatage pas besoin de toutes les données de l'API + correspondance aux props définies avant le fetch
        // On limite la longueur de la description

          return { title: movie.title, poster : poster, voteAverage: movie.vote_average, voteCount: movie.vote_count, overview: movie.overview.length> 250 ? movie.overview.substr(0, 250)+"..." : movie.overview };
          
        });
        setMoviesData(MoviesData);
      });
  }, []);


//  boucle dans les données, export des props (dont la fonction de mise à jour des films likés), pour les utiliser dans le composant enfant

  const movies = MoviesData.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);

    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.title} overview={data.overview} poster={data.poster} voteAverage={data.voteAverage} voteCount={data.voteCount} />;
  });



  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">

          // compteur dynamique 

          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>
        {movies}
      </div>
    </div>
  );
}

export default Home;