import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';

import { refs } from './refs';

console.log(refs.form);
console.log(refs.gallery);

const HOST = 'https://pixabay.com/api/';
const KEY = '39740350-c529a147bbdaf7c730f594a58';

axios.defaults.headers.common['key'] = KEY;

axios.get(HOST + '?key=39740350-c529a147bbdaf7c730f594a58&q=yellow+flowers&image_type=photo')
    .then(result => console.log(result))
    .catch(error => console.log(result))

