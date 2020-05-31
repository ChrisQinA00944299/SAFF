// Javascript File for slider with location info

const slide = document.getElementById('slide');
const slider = document.getElementById('slider')
const slideIcon = document.querySelector('.slider_icon');
// const slideIcon = document.querySelector()

slide.addEventListener('click', e => {
    e.preventDefault();
    if(slider.classList.contains('expand')){
        slider.classList.remove('expand');
        // slideIcon.classList.add('inactive');
    } else {
        slider.classList.add('expand');
        // slideIcon.classList.remove('inactive');
        
    }
}

    
);