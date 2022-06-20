'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button scrolling

btnScrollTo.addEventListener('click', function(e){
  // we need to get coordinates to the element that we want to scroll to: 
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);


//Scrolling 
  window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset); //.top is always relative to the viewport, but not to the document(top of the page).
//Old school 
 /* window.scrollTo({
    left: s1coords.left + window.pageXOffset,// Sau valoare: 0;
    top: s1coords.top + window.pageYOffset, //Sau valoare: 1350,
    //behavior: 'smooth',
  });*/

//New way of scrolling: 
//We take the element that we want to scroll to (section1)
section1.scrollIntoView({behaviour: 'smooth'});
});

////////////////////////////////////////////////////
//Page Navigation 

/*document.querySelectorAll('.nav__link').forEach(function(el){
  el.addEventListener('click', function(e){
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);    
    document.querySelector(id).scrollIntoView({behaviour: 'smooth'});
  });
});*/

  // Event Delegation:
//1. Add event listener to common parent element
//2. In the above event listener, determine what element originated the event.

document.querySelector('.nav__links').addEventListener('click', function (e){
  e.preventDefault();

  //Matching strategy (Ignore clicks that don't happen on one of those links from top page)
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    console.log(id);    
    document.querySelector(id).scrollIntoView({behaviour: 'smooth'});
  }
});

//Tabbed component: Add/remove classes as necessary to manipulate the content to our needs:
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
//Three content areas: 
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e){
  const clicked = e.target.closest('.operations__tab'); // closest comes because I need to click on both span and text from tab;
  console.log(clicked);

  //Guard clause; - Will return early if some condition is matched.
  if(!clicked) return; //When clicking outside the button, "Cannot read properties of null"
  // will not be returned.

  //Remove active classes for both the TAB and content areas:
  tabs.forEach(t=> t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate TAB

  clicked.classList.add('operations__tab--active');

  //Activate content area -> Look in CSS (.operations__content has display: none 
  // .operations__content--active has display:grid)
  console.log(clicked.dataset.tab);
  document
  .querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active');

});

//Refactoring for below Code 1 and Code 2 (They are similar). Done through a function
 
const handleHover = function (e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this; //this keyword is our opacity now
    });
    logo.style.opacity = this;//this keyword is our opacity now
  }
}

//In the below sequence, addEventListener expects a function . It is better to add a function 
//which JS will call it for us, whenever the event will happen
/*nav.addEventListener('mouseover', function(e){
  handleHover(e , 0.5); //opacity for hovering over the tabs;
});*/

//Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

/*
nav.addEventListener('mouseout',function(e){
  handleHover(e , 1); //opacity when hovering goes outside the tabs;
});*/
nav.addEventListener('mouseover', handleHover.bind(1));

//Sticky navigation:
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);
/*
//1.Scroll event -> it is available in window (NOT DOCUMENT):
//Using scroll event for performing a scrolling action at a certain position in the page
//is not the way to go except some particular cases (Scroll event fires all the time no matter
//how small the change is here in the scroll -> check with console log )
window.addEventListener('scroll', function(){
  console.log(window.scrollY);

  //window.scrollY is the position reached in the page ;
  //initialCoords.top is the first section from the top.
  //getBoundingClientRect() gives the dom coordinates for a particular area.

  if(window.scrollY > initialCoords.top) nav.classList.add('sticky')
   else nav.classList.remove('sticky')

//When we reach the first position of section 1, we want to make the nav sticky:
//Must be calculated dinamically (not hard coded. How? Re: We can determine the 
//position of section 1:


});
*/

//Sticky navigation: Intersection Observer API - This API allows our code to observe changes
//to the way that a certain target element intersects another element or the way it interescts
// the viewport.

const obsCallBack = function (entries, observer){
//entries are an array of the threshold entries -? only one element there -> 0.1
  entries.forEach(entry => {
    console.log(entry);
  })
}
//this callback function will be called each time the observed element (target element -> section1) is
//intersecting the root element at the threshold that we defined.
//Whenever section1 is intersecting the viewport at 10%(0.1) the function will be called, no matter
//if we scroll up or down.

//Theory:
/*const obsOptions = {
  //1st element is the element that the target (section1 is the target) is interescting => root element;
  root: null, //intersects the entire viewport;
  threshold: [0, 0.2], //10 % - this is the percentage of intersection at which the observer callback will be called;
// 0 % from threshold means that our callback will trigger each time that the target element
// moves completely out of the view, and also as soon as it enters the view.
};

//1. Creation of a new observer + store it in a variable
const observer = new IntersectionObserver(obsCallBack, obsOptions);
//2. The variable must observe the changes -> .observe (target element);
observer.observe(section1);

//When do we want the navigation to be sticky? When the header moves completely out from the view.
//We need to observe the header element. Let's start by selecting that:
*/

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; // Pick height from the DOMRect
console.log(navHeight);

const stickyNav = function (entries){
  const entry = entries[0];
  //console.log(entry);

  //When the target is not intersecting the root, we want the sticky to be applied
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //set to null, When we are interested in the entire viewport
  threshold: 0,//When 0% of the header is visible, we want something to happen.
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);





//////////////////////////////////////////////////////////////////////
//Reveal Sections: 
const allSections = document.querySelectorAll('.section')

const revealSection = function (entries,observer){
  const [entry] = entries; //similar with entry=entries[0];
  if(!entry.isIntersecting) return; 
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);  //none of the sections will be observed anymore.
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function(section){
  sectionObserver.observe(section)
  //section.classList.add('section--hidden');
});

//Lazy loading images: 

const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);


const loadImg = function (entries, observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  //Replace src with data-src:
  entry.target.src = entry.target.dataset.src;
  

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null, // entire viewport
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img=>imgObserver.observe(img));


//Slider

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let curSlide = 0;
const maxSlide = slides.length;


/*const slider = document.querySelector('.slider')
slider.style.transform = 'scale(0.4) translateX(-800px)';
slider.style.overflow = 'visible';*/

slides.forEach((s, i) => s.style.transform = `translateX(${100 * i}%)`);
//first slide should be at 0%, 2nd at 100%, 3rd at 200%, 4th at 300%

const goToSlide = function (slide){
  slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i-slide)}%)`);
};

goToSlide(0);


//Go to the next slide:

const nextSlide = function (){
  if(curSlide === maxSlide - 1){ //maxSlide is not zero based;
    curSlide = 0;
  } else {
    curSlide++;
  };
  
  goToSlide(curSlide);
};

const prevSlide = function (){
  if(curSlide === 0){
    curSlide = maxSlide - 1 ; 
  } else {
    curSlide--;
  }
  
  goToSlide(curSlide);
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);








////////////////////////////////////////////////////////////////
/*
//Menu fade animation: 
//Code 1 - For mouse hovering on top of the tabs:

nav.addEventListener('mouseover', function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = 0.5;
    });
    logo.style.opacity = 0.5;
  }
});

//Code 2- For mouse clicking outside the tabs, everything must return on initial values ( opacity 1)
nav.addEventListener('mouseout', function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = 1;
    });
    logo.style.opacity = 0.5;
  }
});
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


/*
const h1 = document.querySelector('h1');

//Going downwards: Selecting child elements (using querySelector - work also on elements(not only on the document))
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.children);
h1.firstElementChild.style.color = 'magenta';
h1.lastElementChild.style.color = 'orangered';

//Going upwards: Selecting parents 

console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

//Going sideways : siblings 

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function(el){
  if(el !== h1) el.style.transform = 'scale(0.5)';
})

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSection = document.querySelectorAll('.section');
console.log(allSection);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

//Creating and inserting elements
//.insertAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent = 'We use cookies for improved functionality and analytics';
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class = "btn btn--close-cookie">Got it!</button>';

//header.prepend(message);
header.append (message);
//header.append(message.cloneNode(true));

//header.before(message);
//header.after(message);


//Delete elements: (Removing cookie when the Got it button is clicked)
document.querySelector('.btn--close-cookie').addEventListener('click', function (){
  message.remove();
})

//Styles 
/*
message.style.backgroundColor='#37383e';
message.style.width = '120%';
console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 +'px';


//Makes link with .root object from CSS style, and it is considered as a document element there :
document.documentElement.style.setProperty('--color-primary', 'orangered');


//Attributes : 

const logo = document.querySelector('.nav__logo');
console.log(logo.alt);//standard property on images;
console.log(logo.src);//standard property on images;
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';


//Non-standard
console.log(logo.designer); // Will show undefined because designer is not a standard property that is expected to be on images.
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist'); //Create a new attribute


console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

//Data attributes 
//Special kind of attributes that start with the word data, and then whatever word we want.(Ex: data-version-number = "3.0")

console.log(logo.dataset.versionNumber);

//Classes:

logo.classList.add('c','j');
logo.classList.remove('c','j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes 

//Don't use 
// logo.className ='jonas'; //will overwrite whatever is already there while the upper 4 methods
                        // make it really nice to work with the classes.
*/
//One click and smooth scroll to a first section in the web site.

/*
const h1 = document.querySelector('h1');

const alerth1 = function(e){
  alert('addEventListener: Great! You are reading the heading :D');

  h1.removeEventListener('mouseenter',alerth1);
};

h1.addEventListener('mouseenter', alerth1);


setTimeout(()=> h1.removeEventListener('mouseenter',alerth1), 3000);
/*h1.onmouseenter = function(e){
  alert('onmouseenter: Great! You are reading the heading :D');
};*/


//random colour rgb(255,255,255)
/*
const randomInt = (min,max) =>Math.floor(Math.random()*(max-min+1)+min);
const randomColor = () => `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;
console.log(randomColor(0,255));

document.querySelector('.nav__link').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target);
});

document.querySelector('.nav__links').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target);
});

document.querySelector('.nav').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target);
});*/