const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

export async function searchMovie(query) {
  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=ja-JP&query=${encodeURIComponent(query)}`
  );

  const data = await res.json();

  return data.results.filter(
    (item) =>
      item.media_type === "movie" ||
      item.media_type === "tv"
  );
}

export async function getPopularMovies() {

  const movieRes = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ja-JP`
  );

  const tvRes = await fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ja-JP`
  );


  const movies = await movieRes.json();
  const tv = await tvRes.json();


  return [
    ...movies.results,
    ...tv.results
  ];

}
export async function getMovieDetail(id, type) {

  const res = await fetch(
    `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=ja-JP`
  );

  const data = await res.json();

  return data;

}

export async function getWatchProviders(id, type) {

 const res = await fetch(
 `${BASE_URL}/${type}/${id}/watch/providers?api_key=${API_KEY}&watch_region=JP`
 )

 const data = await res.json()

 const jp = data.results?.JP

 if(!jp){
   return {
     flatrate: [],
     rent: [],
     buy: []
   }
 }


 return {

   flatrate:
     jp.flatrate || [],

   rent:
     jp.rent || [],

   buy:
     jp.buy || []

 }

}