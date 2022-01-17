const fetch = require('node-fetch');

const FONTS_CONFIG = [
  { name: 'Roboto', value: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap' },
  { name: 'Festive', value: 'https://fonts.googleapis.com/css2?family=Festive&display=swap' },
  { name: 'Noto Sans Mono', value: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Mono&display=swap' },
  { name: 'Open Sans', value: 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap' },
  { name: 'Andada Pro', value: 'https://fonts.googleapis.com/css2?family=Andada+Pro&display=swap' },
  { name: 'Lato', value: 'https://fonts.googleapis.com/css2?family=Lato&display=swap' },
  { name: 'Scheherazade New', value: 'https://fonts.googleapis.com/css2?family=Scheherazade+New&display=swap' },
  { name: 'Montserrat', value: 'https://fonts.googleapis.com/css2?family=Montserrat&display=swap' },
  { name: 'Roboto Condensed', value: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap' },
  { name: 'Source Sans Pro', value: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap' },
  { name: 'Poppins', value: 'https://fonts.googleapis.com/css2?family=Poppins&display=swap' },
  { name: 'Oswald', value: 'https://fonts.googleapis.com/css2?family=Oswald&display=swap' },
  { name: 'Noto Sans', value: 'https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap' },
  { name: 'Georama', value: 'https://fonts.googleapis.com/css2?family=Georama&display=swap' },
  { name: 'Roboto Mono', value: 'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap' },
  { name: 'Raleway', value: 'https://fonts.googleapis.com/css2?family=Raleway&display=swap' },
  { name: 'Nunito', value: 'https://fonts.googleapis.com/css2?family=Nunito&display=swap' },
  { name: 'Roboto Slab', value: 'https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap' },
  { name: 'PT Sans', value: 'https://fonts.googleapis.com/css2?family=PT+Sans&display=swap' },
  { name: 'Merriweather', value: 'https://fonts.googleapis.com/css2?family=Merriweather&display=swap' },
  { name: 'Playfair Display', value: 'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap' },
  { name: 'Lora', value: 'https://fonts.googleapis.com/css2?family=Lora&display=swap' },
  { name: 'IM Fell English SC', value: 'https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&display=swap' },
  { name: 'Inter', value: 'https://fonts.googleapis.com/css2?family=Inter&display=swap' },
  { name: 'Nunito Sans', value: 'https://fonts.googleapis.com/css2?family=Nunito+Sans&display=swap' },
  { name: 'Work Sans', value: 'https://fonts.googleapis.com/css2?family=Work+Sans&display=swap' },
  { name: 'Quicksand', value: 'https://fonts.googleapis.com/css2?family=Quicksand&display=swap' },
  { name: 'Fira Sans', value: 'https://fonts.googleapis.com/css2?family=Fira+Sans&display=swap' },
  { name: 'Ubuntu', value: 'https://fonts.googleapis.com/css2?family=Ubuntu&display=swap' },
];

FONTS_CONFIG.map((font) => {
  fetch(font.value)
    .then((res) => {
      if (res.status !== 200) {
        console.log(`\n font : '${font.name}' error, status : ${res.status} \n url: ${font.value} \n`);
      }
    })
    .catch((err) => {
      console.log('err', font.name, err);
    });
});
