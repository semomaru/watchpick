import movies from "./movies";
import ServiceSelector from "./components/ServiceSelector";
import SearchBox from "./components/SearchBox";
import { useState, useEffect, useRef } from 'react'
import './App.css'
import {
  searchMovie as searchTMDB,
  getPopularMovies,
  getMovieDetail,
  getWatchProviders
} from "./api/tmdb";
import services from './services'
import { Analytics } from '@vercel/analytics/react'
function App() {

  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [result, setResult] = useState(null)
  const resultRef = useRef(null)
  const [myServices, setMyServices] = useState(
  JSON.parse(
    localStorage.getItem('myServices')
  ) || []
)
useEffect(()=>{

  localStorage.setItem(
    'myServices',
    JSON.stringify(myServices)
  )

},[myServices])

useEffect(() => {

  async function loadPopular() {

    const movies = await getPopularMovies();

    setPopularMovies(movies);

    console.log(movies);

  }

  loadPopular();

}, []);



useEffect(() => {

  if (!keyword.trim()) {
    setSearchResults([]);
    return;
  }

  const timer = setTimeout(async () => {

    const results = await searchTMDB(keyword);

    setSearchResults(results);

  }, 300);

  return () => clearTimeout(timer);

}, [keyword]);

const genreMap = {
  28:"アクション",
  12:"アドベンチャー",
  16:"アニメ",
  35:"コメディ",
  18:"ドラマ",
  14:"ファンタジー",
  27:"ホラー",
  10749:"恋愛",
  878:"SF"
}

const providerNameMap = {

  // Amazon
  "Amazon Prime Video": "Amazon Prime Video",
  "Amazon Prime Video with Ads": "Amazon Prime Video",
  "Amazon Video": "Amazon Prime Video",
  "Amazon Channel": "Amazon Prime Video",
  "Anime Times Amazon Channel": null,
"dAnime Amazon Channel": "dアニメストア",

  // Netflix
  "Netflix": "Netflix",
  "Netflix Standard with Ads": "Netflix",


  // Disney
  "Disney Plus": "Disney+",
  "Disney+": "Disney+",


  // dアニメ
  "d Anime Store": "dアニメストア",
  "dアニメストア": "dアニメストア",
  "Docomo Anime Store": "dアニメストア",


  // DMM
  "DMM TV": "DMM TV",
  "DMM.com": "DMM TV",


  // U-NEXT
  "U-NEXT": "U-NEXT",
  "U-NEXT Store": "U-NEXT",


  // Hulu
  "Hulu": "Hulu",
  "Hulu Japan": "Hulu",


  // ABEMA
  "ABEMA": "ABEMAプレミアム",
  "ABEMA Premium": "ABEMAプレミアム",

}

const convertProviders = (providers = []) => {

  const converted = providers
    .map(provider => {

      console.log(
        "TMDB配信:",
        provider.provider_name
      )

    const serviceName =
  providerNameMap[
    provider.provider_name.trim()
  ]


      const service = services.find(
        item => item.name === serviceName
      )


      if(!service){
        return null
      }


      return {
        name: service.name,
        price: service.price,
        logo: service.logo,
        url: service.url
      }

    })
    .filter(Boolean)


  // 重複削除
  return [
    ...new Map(
      converted.map(
        service => [
          service.name,
          service
        ]
      )
    ).values()
  ]

}

const getGenres = (ids) => {

  if(!ids) return "不明"

  return ids
    .map(id => genreMap[id])
    .filter(Boolean)
    .join(" / ")

}

const serviceList = services

  const suggestions = movies.filter(
    (movie) =>
      keyword &&
      movie.title.includes(keyword)
  )


  const searchMovie = async () => {

  const results = await searchTMDB(keyword);

  if (results.length > 0) {

    const movie = results[0];

const type = movie.title
  ? "movie"
  : "tv"


const detail = await getMovieDetail(
  movie.id,
  type
)

const providers = await getWatchProviders(
  movie.id,
  type
)

    setResult({
      title: movie.title || movie.name,
      media_type: type,
      rating: movie.vote_average
  ? movie.vote_average.toFixed(1)
  : "不明",
    image: movie.poster_path
  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  : null,
      description: movie.overview,
     releaseDate:
  detail.release_date ||
  detail.first_air_date ||
  "不明",
      genre: getGenres(movie.genre_ids),
  services: convertProviders(
  providers.flatrate || []
),

rentServices:
  providers.rent,

buyServices:
  providers.buy
    });

  } else {

    setResult(null);

  }

  scrollToResult();

}


const scrollToResult = () => {

  setTimeout(() => {
    resultRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, 100)

}

  const getCheapestService = () => {

  if(!result) return null

  return [...result.services]
    .sort(
      (a,b)=>a.price-b.price
    )[0]

}

const cheapestService = getCheapestService()

const getRecommendation = () => {

  if(!result || !cheapestService){
    return null
  }


const currentServices =
  result.services.filter(
    service =>
      myServices.some(
        item => item.name === service.name
      )
  )


  // 見られるサービスがない

if(currentServices.length === 0){

  return {
    type:'none'
  }

}

  // すでに最安

 const currentCheapest =
  [...currentServices]
    .sort(
      (a,b)=>a.price-b.price
    )[0]


if(
  currentCheapest.price === cheapestService.price
){

  return {
    type:'best'
  }

}


  // 安くできる

  return {

    type:'save',

  saving:
  currentCheapest.price -
  cheapestService.price

  }

}

const recommendation = getRecommendation()

const getSavingAmount = () => {

  if(!cheapestService) return 0

  const current = myServices
    .find(service =>
      result.services.some(
        movieService =>
          movieService.name === service.name
      )
    )

  if(!current) return 0

  return current.price - cheapestService.price

}

const savingAmount = getSavingAmount()

return (
  <div>

     <header className="hero">

  <h1>
     WatchPick
  </h1>

  <p>
    見たい作品を
    <br />
    一番安く見る方法を探す
  </p>

</header>

<SearchBox
  keyword={keyword}
  setKeyword={setKeyword}
  onSearch={searchMovie}
/>


{
  searchResults.map((movie) => (
    <div
  className="search-result-item"
  key={movie.id}
      onClick={async () => {

        setKeyword(movie.title ?? movie.name);

          const selected = movie;

          const detail = await getMovieDetail(
  selected.id,
  selected.media_type
);

const providers = await getWatchProviders(
  selected.id,
  selected.media_type
);

          setResult({
            title: selected.title || selected.name,
            image: selected.poster_path
              ? `https://image.tmdb.org/t/p/w500${selected.poster_path}`
              : "",
            description: selected.overview,
            rating: selected.vote_average
  ? selected.vote_average.toFixed(1)
  : "不明",
           releaseDate: selected.release_date
  ? selected.release_date
  : "不明",
            genre: getGenres(selected.genre_ids),
services: convertProviders(
  providers.flatrate
),

rentServices:
  providers.rent,

buyServices:
  providers.buy
          });

          scrollToResult();

      }}
    >
 {movie.poster_path && (
  <img
    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
    width="50"
  />
)}

 <span>

  {movie.title || movie.name}

  <small>
    {
      movie.media_type === "movie"
        ? " 🎬 映画"
        : " 📺 TV"
    }

    {
      movie.release_date || movie.first_air_date
        ? ` ${(
            movie.release_date ||
            movie.first_air_date
          ).slice(0,4)}年`
        : ""
    }

  </small>

</span>

</div>
  ))
}

{keyword && !result && (
  <p>
    該当する作品がありません
  </p>
)}

<main>



<ServiceSelector
  serviceList={serviceList}
  myServices={myServices}
  setMyServices={setMyServices}
/>


<h2>
人気作品
</h2>

<div className="popular-list">

{
 popularMovies.map((movie,index)=>(
    <div
      className="movie-card"
      key={index}
  onClick={async ()=>{

  setKeyword(movie.title || movie.name)

  const type = movie.title
    ? "movie"
    : "tv"


  const detail = await getMovieDetail(
    movie.id,
    type
  )


  const providers = await getWatchProviders(
    movie.id,
    type
  )


  console.log("人気作品provider", providers)


  setResult({

    title: movie.title || movie.name,

    media_type: type,

    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,

    description: movie.overview,

    rating: movie.vote_average
      ? movie.vote_average.toFixed(1)
      : "不明",

    releaseDate:
      detail.release_date ||
      detail.first_air_date ||
      "不明",

    genre: getGenres(movie.genre_ids),

    services: convertProviders(
      providers.flatrate || []
    ),

    rentServices:
      providers.rent || [],

    buyServices:
      providers.buy || []

  })


  scrollToResult()



  

}}
    >

{movie.poster_path && (
  <img
    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
  />
)}

      <h3>
       {movie.title || movie.name}
      </h3>

    </div>
  ))
}

</div>


  {result && (
  <div 
    className="result-page"
    ref={resultRef}
  >

 <button
      className="back-button"
      onClick={()=>{
        setResult(null)
      }}
    >
      ← 戻る
    </button>

       <div className="result-card">
{result.image && (
  <img
    src={result.image}
    width="200"
  />
)}
            <h2>
              {result.title}
            </h2>
            <p>
  ジャンル：{result.genre}
</p>

<p>
  ⭐ 評価：{result.rating} / 10
</p>

<p>
 公開日：
{result.releaseDate !== "不明"
  ? `${result.releaseDate.slice(0,4)}年${result.releaseDate.slice(5,7)}月${result.releaseDate.slice(8,10)}日`
  : "不明"}
</p>

<p>
  {result.description}
</p>


{
  result.services.some(
    service =>
      myServices.some(
        item => item.name === service.name
      )
  ) && (

    <div className="user-result">

   <h3 className="result-title">
  🎉 あなたの場合
</h3>

   {
  result.services
    .filter(
      service =>
        myServices.some(
          item => item.name === service.name
        )
    )
    .map((service,index)=>(

      <div 
        className="my-service-item"
        key={index}
      >

        <img
          className="my-service-logo"
          src={service.logo}
        />

        <p>
          ✅ {service.name}で視聴できます
        </p>

      </div>

    ))
}

   <p className="no-cost">
  追加費用なし
</p>

    </div>

  )
}
<div className="result-summary ">

{
  cheapestService && (

   <div className="cheapest-card">

<a
 href={cheapestService.url}
 target="_blank"
 rel="noopener noreferrer"
>

<h3 className="result-title">
  🏆 一番安く見るなら
</h3>

<img
  className="service-logo cheapest-logo"
  src={cheapestService.logo}
/>

<h2 className="service-name">
  {cheapestService.name}
</h2>

<p className="price">
  💰 月額 {cheapestService.price}円
</p>

<p className="card-link-text">
  見に行く
</p>

</a>
    </div>

  )
}



{
  recommendation?.type === 'best' && (

    <div className="best-card">

      <h3>
        🎉 素晴らしい！
      </h3>

      <p>
        既に最安値で視聴できます！
      </p>

    </div>

  )
}



{
  recommendation?.type === 'save' && (

    <div className="saving-card">

   <h3 className="saving-title">
  🎉 あなたなら節約できます
</h3>
  <p className="saving-month">
  月 {recommendation.saving}円お得
</p>

<p className="saving-year">
  年間 {recommendation.saving * 12}円お得
</p>

    </div>

  )
}

</div>

{
  result.services.length === 0 && (

    <div className="no-service-card">

      <h3>
        📭 配信なし
      </h3>

      <p>
        現在、対応している動画配信サービスでは
        視聴できません。
      </p>

    </div>

  )
}

{
  result.services.length === 0 &&
  result.rentServices?.length > 0 && (

    <div className="rent-card">

      <h3>
        🎬 レンタル可能
      </h3>

      {
        result.rentServices.map((service,index)=>(

          <p key={index}>
            {service.provider_name}
          </p>

        ))
      }

    </div>

  )
}

{
  result.services.length === 0 &&
  result.buyServices?.length > 0 && (

    <div className="buy-card">

      <h3>
        💿 購入可能
      </h3>

      {
        result.buyServices.map((service,index)=>(

          <p key={index}>
            {service.provider_name}
          </p>

        ))
      }

    </div>

  )
}

            {
              [...result.services]
                .sort((a, b) => a.price - b.price)
                .map((service, index) => (
                  <div
  key={index}
className={
  index === 0
    ? "service-card gold"
    : index === 1
    ? "service-card silver"
    : index === 2
    ? "service-card bronze"
    : "service-card"
}
>

                    {index === 0 && (
  <h2>🥇 最安</h2>
)}

{index === 1 && (
  <h2>🥈 2番目に安い</h2>
)}

{index === 2 && (
  <h2>🥉 3番目に安い</h2>
)}
<div className="service-header">

 <img
  className="service-logo"
  src={service.logo}
/>

  <h3>
    {service.name}
  </h3>

</div>

                    <p>
                      月額 {service.price}円
                    </p>
              
<a
  className="visit-button"
  href={service.url}
  target="_blank"
  rel="noopener noreferrer"
>
  見に行く
</a>

                  </div>
                ))
            }

          </div>

        </div>
      )}

      
      </main>

<section className="about">

  <h2>
    WatchPickとは？
  </h2>

  <p>
    見たい作品を、
    どの動画配信サービスで見るのが一番お得か
    簡単に比較できるサービスです。
  </p>

  <div className="features">

    <div>
      🎬
      <h3>
        作品ごとに比較
      </h3>
      <p>
        見たい作品単位で探せます
      </p>
    </div>


    <div>
      💰
      <h3>
        最安表示
      </h3>
      <p>
        一番安いサービスが分かります
      </p>
    </div>


    <div>
      📊
      <h3>
        年間料金比較
      </h3>
      <p>
        1年間の料金も確認できます
      </p>
    </div>

  </div>

</section>

<Analytics />

</div>
)
}

export default App