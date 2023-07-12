import { useState } from 'react';
import { useEffect } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {
    // Initialisation de mon état de données en tableau vide

  const [likedMovies, setLikedMovies] = useState([]);

  // Liked movies (inverse data flow)

  //fonction de maj des films likés avec en paramètre le titre
  // si on trouve dans ma liste de film, qu'il y a déjà le nom du film en paramètre, alors on l'enleve, sinon on l'ajoute avec un spread opérator
  
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  // on map dans mon tableau de likedovie pour générer un composant sous forme de span avec le titre et une croix cliqable qui appliquera la foncyion de mise à jour du film avec la fonction On click

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  // composant préfait dynamique
  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  // Initialisation de mon état de données en tableau vide

  const [MoviesData, setMoviesData] = useState([]);


  useEffect(() => {
    fetch('http://localhost:3000/movies')
      .then(response => response.json())
      .then(data => {
        console.log(data.movies);
      

  // on reformate la data pcq on avait à la base notre data en dur et des noms de clefs différentes

        const MoviesData = data.movies.map(movie => {
        const poster = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;    

          return { title: movie.title, poster : poster, voteAverage: movie.vote_average, voteCount: movie.vote_count, overview: movie.overview.length> 250 ? movie.overview.substr(0, 250)+"..." : movie.overview };
          
        });
        setMoviesData(MoviesData);
      });
  }, []);


  // on boucle dans sa donnée et on génère un composant avec des propriétés booleans qu'on passe à l'enfant. Si dans ma liste générique movies, on match avec un titre de film sur lequel on a cliqué dans l'enfant, alors on ajoute

  const movies = MoviesData.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.title} overview={data.overview} poster={data.poster} voteAverage={data.voteAverage} voteCount={data.voteCount} />;
  });


  // vivuel du header + affichage du nbr de films likés
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
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