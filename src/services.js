import netflixLogo from "./assets/logos/netflix.png";
import primeLogo from "./assets/logos/prime.png";
import unextLogo from "./assets/logos/unext.png";
import danimeLogo from "./assets/logos/d_anime.png";
import dmmLogo from "./assets/logos/dmmtv.png";
import disneyLogo from "./assets/logos/disney.png";
import huluLogo from "./assets/logos/hulu.png";
import abemaLogo from "./assets/logos/abema.png";

const services = [
  {
    name: 'Amazon Prime Video',
    price: 600,
    logo: primeLogo,
    url: 'https://www.amazon.co.jp/'
  },
  {
    name: 'Netflix',
    price: 890,
    logo:netflixLogo,
    url: 'https://www.netflix.com/jp/'
  },
  {
    name: 'U-NEXT',
    price: 2189,
    logo: unextLogo,
    url: 'https://video.unext.jp/'
  },
  {
    name: 'dアニメストア',
    price: 660,
    logo: danimeLogo,
    url: 'https://anime.dmkt-sp.jp/'
  },
  {
    name: 'DMM TV',
    price: 550,
    logo: dmmLogo,
    url: 'https://tv.dmm.com/'
  },
  {
    name: 'Disney+',
    price: 1140,
    logo: disneyLogo,
    url: 'https://www.disneyplus.com/jp/'
  },
  {
    name: 'Hulu',
    price: 1026,
    logo: huluLogo,
    url: 'https://www.hulu.jp/'
  },
  {
    name: 'ABEMAプレミアム',
    price: 580,
    logo: abemaLogo,
    url: 'https://abema.tv/'
  }
]

export default services