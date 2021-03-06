const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images
const showImages = (images) => {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach((image) => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
        div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
        gallery.appendChild(div);
        toggleSpinner(false);
    });
};

const getImages = (query) => {
    const url = (`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    toggleSpinner(true);
    fetch(url)
        .then((response) => response.json())
        .then((data) => showImages(data.hits))
        .catch((err) => console.log(err));
};

// slide selection option
let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;

    let item = sliders.indexOf(img);
    element.classList.toggle('added');
    if (item === -1) {
        sliders.push(img);
    } else {
        sliders = sliders.filter(selectImg => selectImg !== img)
            // issueCount();
    }
}
var timer;
const createSlider = () => {
    // check slider image length
    const totalSlider = document.getElementById('count-slider');
    totalSlider.innerText = sliders.length;
    if (sliders.length < 2) {
        alert('Select at least 2 image.');
        return;
    }

    // crate slider previous next area
    const duration = document.getElementById('duration');
    let durationNumber = duration.value || 1000;
    if (durationNumber >= 0) {

        sliderContainer.innerHTML = '';
        const prevNext = document.createElement('div');
        prevNext.className = 'prev-next d-flex w-100 justify-content-between align-items-center';
        prevNext.innerHTML = ` 
      <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
      <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
      `;

        sliderContainer.appendChild(prevNext);
        document.querySelector('.main').style.display = 'block';
        // hide image aria
        imagesArea.style.display = 'none';

        sliders.forEach((slide) => {
            let item = document.createElement('div');
            item.className = 'slider-item';
            item.innerHTML = `<img class="w-100"
          src="${slide}"
          alt="">`;
            sliderContainer.appendChild(item);
        })
        changeSlide(0);
        timer = setInterval(function() {
            slideIndex++;
            changeSlide(slideIndex);
        }, durationNumber);
    } else {
        alert("Sorry (-) Number not support");
        duration.value = "";
    }

}

// change slider index
const changeItem = (index) => {
    changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1;
        index = slideIndex;
    }

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach((item) => {
        item.style.display = 'none';
    });

    items[index].style.display = 'block';
};


const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', function() {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    getImages(search.value)
    sliders.length = 0;
});
// Keyboard Handler 
search.addEventListener("keypress", function(event) {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

sliderBtn.addEventListener('click', function() {
    createSlider();
});

// loading Spinner
const spinner = document.getElementById('loading-spinner');
const toggleSpinner = (show) => {
    if (show) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none');
    }
};