"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const navLinks = document.querySelector(".nav__links");
const allSections = document.querySelectorAll(".section");
const header = document.querySelector(".header");
const slideContainer = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//button scrolling
btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
// Page Navigation
//with event delegation
//events bubble up
//we add event listener to common parent element.
//so callback function is added only on element and works for all children
navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(e.target);

  //Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////
// Tabbed Component
//event delegation.
tabsContainer.addEventListener("click", function (e) {
  //we use closest because there may be accidental clicks to child or parent elements
  const clicked = e.target.closest(".operations__tab");

  //Guard Clause
  if (!clicked) {
    return;
  }

  //Active tab
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  //Activate Content Area
  tabsContent.forEach((content) =>
    content.classList.remove("operations__content--active")
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

///////////////////////////////////////
// Fade out Navigation
const handleHover = function (e) {
  //we do not use closest because there will be no accidental clicks to child or parent elements.
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};

//Passing "argument" into handler function - bind method
nav.addEventListener("mouseover", handleHover.bind(0.5)); //this = 0.5
nav.addEventListener("mouseout", handleHover.bind(1)); //this = 1

///////////////////////////////////////
// Sticky Navigation
//first we need to create new intersection observer
//we pass there callback function and object of options
//callback function will get called every time observed (target) element intersecting the root element at the threshold that we defined.
//function will called with 2 arguments: threshold entries and observer object
//get height of navigation
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);

//revealing Elements on Scroll
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  }
};

const revealOptions = {
  root: null,
  threshold: 0.2,
};

const sectionObserver = new IntersectionObserver(revealSection, revealOptions);

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//Lazy Loading Images
const imgTargets = document.querySelectorAll("img[data-src]");

const imgObserve = function (entries, observer) {
  const [entry] = entries;

  //replace src with data-src
  if (!entry.isIntersecting) {
    return;
  }

  entry.target.src = entry.target.dataset.src;

  //load event: load images after whole page loads
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgOptions = {
  root: null,
  threshold: 0,
  rootMargin: "200px",
};

const imgObserver = new IntersectionObserver(imgObserve, imgOptions);

imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

//Building a Slider Component
const slider = function () {
  let currentSlide = 0;
  const maxSlide = slides.length;

  /////////////functions
  //create dots
  const createDots = function () {
    slides.forEach(function (_s, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  //activate dot
  const activateDot = function (slide) {
    const allDots = document.querySelectorAll(".dots__dot");
    allDots.forEach((dot) => dot.classList.remove("dots__dot--active"));

    //select dot based on data set attribute
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  //default slide
  const goToSlide = function (slide) {
    slides.forEach(function (s, index) {
      s.style.transform = `translateX(${100 * (index - slide)}%)`;
    });
  };

  //going next slide
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  //going prev slide
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  //short circuiting
  document.addEventListener("keydown", function (e) {
    e.key === "ArrowRight" && nextSlide();
    e.key === "ArrowLeft" && prevSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
