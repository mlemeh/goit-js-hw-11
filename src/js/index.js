import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

import Notiflix from "notiflix";
import "notiflix/dist/notiflix-3.2.6.min.css"

// import { refs } from './refs';
const refs = {
    form: document.querySelector('.search-form'),
	gallery: document.querySelector('.gallery'),
	btnLoadMore: document.querySelector('.load-more')
};

hideBtnLoadMore();

const HOST = 'https://pixabay.com/api/';
const KEY = '39740350-c529a147bbdaf7c730f594a58';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFESEARCH = 'true';
const PER_PAGE = 40;

let prevSearchQuery = '';

let lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });

let qStr = '';
let page = 1;

refs.form.addEventListener('submit', handlerSubmit); 
function handlerSubmit(event) {
	event.preventDefault();

	const searchQuery = refs.form.elements.searchQuery.value;

	if (searchQuery.trim() === '') {
		clearGallery();
		hideBtnLoadMore();

		prevSearchQuery = '';

		Notiflix.Notify.failure('The search string cannot be empty');  
		
		return;
	}

	if (searchQuery === prevSearchQuery) {
		return;
	}

	prevSearchQuery = searchQuery;

	clearGallery();
	hideBtnLoadMore();

	qStr = searchQuery.replaceAll(' ', '+');
	page = 1;

	fetchPage(page)
		.then(fetchResponse => {
			// нічого не знайдено
			if (fetchResponse.data.hits.length === 0) {
				Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
				return;
			}

			// формування markup і виведення на сторінку
			const markup = markupGalley(fetchResponse.data.hits);
			refs.gallery.innerHTML = markup;
			lightbox.refresh();
			
			const { height: cardHeight } = document
  				.querySelector(".gallery")
  				.firstElementChild.getBoundingClientRect();

			window.scrollBy({
  				top: cardHeight * 2,
  				behavior: "smooth",
			});

			// повідомлення про загальну к-сть знайденого
			Notiflix.Notify.success(`A total of ${fetchResponse.data.totalHits} images were found`);

			// скільки знайдено
			if (fetchResponse.data.totalHits > PER_PAGE) {
			// більше-рівно PER_PAGE - відображення кнопки
				showBtnLoadMore();
			} else {
			// менше PER_PAGE - повідомлення, що це все, що знайдено
				Notiflix.Notify.success(`We're sorry, but you've reached the end of search results.`);
			}
		})
		.catch(error => console.log(error))
}

refs.btnLoadMore.addEventListener('click', handlerOnClickBtnLoadMore);
function handlerOnClickBtnLoadMore() {
	page += 1;
	fetchPage(page)
		.then(fetchResponse => {
			// нічого не знайдено - повідомлення, забираєм кнопку, вихід
			if (fetchResponse.data.hits.length === 0) {
				Notiflix.Notify.success(`We're sorry, but you've reached the end of search results.`);
				hideBtnLoadMore();
				return;
			}

			// формування markup і виведення на сторінку
			const markup = markupGalley(fetchResponse.data.hits);
			refs.gallery.insertAdjacentHTML('beforeend', markup);
			lightbox.refresh();

			const { height: cardHeight } = document
  				.querySelector(".gallery")
  				.firstElementChild.getBoundingClientRect();

			window.scrollBy({
  				top: cardHeight * 2,
  				behavior: "smooth",
			});

			// знайдено менше ніж PER_PAGE - повідомлення, що це все, що знайдено, забираєм кнопку
			if (fetchResponse.data.totalHits < PER_PAGE) {
				Notiflix.Notify.success(`We're sorry, but you've reached the end of search results.`);
				hideBtnLoadMore;
			}
		})
		.catch(error => console.log(error))
}

function fetchPage(page) {
	return axios.get(`${HOST}?key=${KEY}&q=${qStr}&image_type=${IMAGE_TYPE}
	              			            &orientation=${ORIENTATION}&safesearch=${SAFESEARCH}
										&per_page=${PER_PAGE}&page=${page}`)
}


function markupGalley(arr) {
	/*
		webformatURL - посилання на маленьке зображення для списку карток.
		largeImageURL - посилання на велике зображення.
		tags - рядок з описом зображення. Підійде для атрибуту alt.
		likes - кількість лайків.
		views - кількість переглядів.
		comments - кількість коментарів.
		downloads - кількість завантажень.	
	*/
	return arr.map(item => {
		return `<a class="a-item" href="${item.largeImageURL}"> 
			<div class="photo-card">
			<img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
			<div class="info">
    			<p class="info-item">
      				<b>Likes</b><br>${item.likes}
    			</p>
    			<p class="info-item">
      				<b>Views</b><br>${item.views}
    			</p>
    			<p class="info-item">
      				<b>Comments</b><br>${item.comments}
    			</p>
    			<p class="info-item">
      				<b>Downloads</b><br>${item.downloads}
    			</p>
  			</div>
		</div>
		</a>`
	}).join(" ")
}


function clearGallery() { refs.gallery.innerHTML = '' }
function hideBtnLoadMore() {refs.btnLoadMore.style.display = 'none'}
function showBtnLoadMore() {refs.btnLoadMore.style.display = ''}

/*
console.log(refs.form);
console.log(refs.gallery);

const HOST = 'https://pixabay.com/api/';
//const HOST = 'https://cors-anywhere.herokuapp.com/https://pixabay.com/api/';
const KEY = '39740350-c529a147bbdaf7c730f594a58';

//axios.defaults.headers.common['key'] = KEY;


axios.get(HOST + `?key=${KEY}&q=cat&image_type=photo&orientation=horizontal&safesearch=true,&per_page=40`)
    .then(result => console.log(result))
    .catch(error => console.log(result))
*/

/*
const API_KEY = '39740350-c529a147bbdaf7c730f594a58';
const URL = "https://pixabay.com/api/?key=" + API_KEY + "&q=" + encodeURIComponent('red roses');
console.log(URL);

axios.get(URL)
    .then(result => console.log(result))
    .catch(error => console.log(result))
*/
/*
$.getJSON(URL, function (data) {
	if (parseInt(data.totalHits) > 0)
	    $.each(data.hits, function(i, hit){ console.log(hit.pageURL); });
	else
	    console.log('No hits');
	});
*/    