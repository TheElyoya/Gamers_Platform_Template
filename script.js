//header section

//switch from dark to light and vice versa (handling scrollbar color too by adding dark to html element)
const darkModeButton = document.querySelector(".dark-toggle");
//check if dark mode is on in local storage
if (window.localStorage.darkMode) {
  if (window.localStorage.darkMode === "dark") {
    document.body.classList.add("dark");
    document.documentElement.classList.add("dark");
  }
}

darkModeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.documentElement.classList.toggle("dark");
  //add dark mode to lacal storage
  if (document.body.classList.contains("dark")) {
    window.localStorage.darkMode = "dark";
  } else {
    window.localStorage.darkMode = "white";
  }
});
//hamburger-button
const hamburgerButton = document.querySelector(".hamburger-btn");
const listItems = document.querySelector(".links");
hamburgerButton.addEventListener("click", (event) => {
  listItems.classList.toggle("hide");
  event.stopPropagation();
});

//this code is to hide ul when user click outside it
document.body.addEventListener("click", (event) => {
  // check if the clicked element is inside the list of links
  if (!listItems.contains(event.target)) {
    // hide the list by adding the "hide" class
    listItems.classList.add("hide");
  }
});

//end header section

//start news section

//declare elements
const contentWrapper = document.querySelector(".news-wrapper");

const cards = document.querySelectorAll(".secondary .card");
const mainImage = document.querySelector(".main .image img");
const mainHeading = document.querySelector(".main .description .title");
const mainText = document.querySelector(".main .description .main-text");

let intervalId; // to clear interval

//function to keep looping trough cards and show them in main section
function startLoop() {
  intervalId = setInterval(() => {
    const activeCard = document.querySelector(".secondary .card.active");
    const nextCard =
      activeCard.nextElementSibling ||
      activeCard.parentElement.firstElementChild;

    showNews(nextCard);
  }, 4000);
}

//stop the above function
function stopLoop() {
  clearInterval(intervalId);
}

// Start the loop initially
startLoop();

// Stop the loop when the mouse enters the container

contentWrapper.addEventListener("mouseenter", stopLoop);

// Start the loop again when the mouse leaves the container
contentWrapper.addEventListener("mouseleave", startLoop);

// Show the news when a card is clicked and stop loop

cards.forEach((card) => {
  card.addEventListener("click", () => {
    stopLoop();
    showNews(card);
  });
});

function showNews(card) {
  const cardImage = card.querySelector(".image img");
  const cardHeading = card.querySelector(".description h3");
  const cardText = card.querySelector(".description p");
  const { src: source } = cardImage;
  const { textContent: title } = cardHeading;
  const { textContent: paragraph } = cardText;

  setTimeout(() => {
    mainImage.src = source;
    mainHeading.textContent = title;
    mainText.textContent = paragraph;
  }, 200);

  cards.forEach((card) => {
    card.classList.remove("active");
  });

  card.classList.add("active");
}

//end news section

// start players section
const myTemplate = document.getElementById("template");
const showPlayers = document.querySelector(".players-wrapper");
let players = [];
const searchBar = document.getElementById("search-bar");

//make request to api
async function searchPlayers() {
  let response = await fetch("https://jsonplaceholder.typicode.com/users");
  let data = await response.json();
  //data inside array
  players = data.map((player) => {
    //clone template children from html and insert in each element
    //the data from the api response
    const card = myTemplate.content.cloneNode(true).children[0];
    const name = card.querySelector(".name");
    const userName = card.querySelector(".user-name");
    const email = card.querySelector(".email");
    name.textContent = player.name;
    userName.textContent = player.username;
    email.textContent = player.email;
    //append it to document
    showPlayers.append(card);
    //return only data we need and save it inside array to do comaparaison
    return {
      name: player.name,
      userName: player.username,
      email: player.email,
      element: card,
    };
  });
}

searchPlayers();

searchBar.addEventListener("input", (e) => {
  let isVisible;
  let value = e.target.value.toLowerCase(); //get searchbar value
  players.forEach((player) => {
    //check if the player infos have the value we're searching for
    //if yes return true and false otherwise
    isVisible =
      player.name.toLowerCase().includes(value) ||
      player.userName.toLowerCase().includes(value) ||
      player.email.toLowerCase().includes(value);
    // only show players that their infos have text inside input search
    player.element.classList.toggle("hide", !isVisible);
  });
});

//end players section

//start sign up section

const signUpForm = document.getElementById("form");
const steps = [...signUpForm.querySelectorAll("[data-form-steps]")];
const password = document.getElementById("password");
const passTwo = document.getElementById("pass2");
const passDoesNotMatchMessage = document.querySelector(".small");

let currentStep = steps.findIndex((step) => {
  return step.classList.contains("active");
});

if (currentStep < 0) {
  steps[0].classList.add("active");
  currentStep = 0;
}

signUpForm.addEventListener("click", (e) => {
  let incrementor;
  let inputs = [...steps[currentStep].querySelectorAll("input")];
  if (e.target.matches("[data-next]")) {
    incrementor = 1;
    let allValid = inputs.every((input) => {
      return input.reportValidity();
    });

    if (password.value.trim() !== passTwo.value.trim()) {
      allValid = false;
      passDoesNotMatchMessage.style.visibility = "visible";
    }

    if (allValid) {
      passDoesNotMatchMessage.style.visibility = "hidden";
      currentStep += incrementor;
      showStep();
    }
  } else if (e.target.matches("[data-pre]")) {
    incrementor = -1;
    currentStep += incrementor;
    showStep();
  }
  if (incrementor === undefined) return;
});

function showStep() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  // animation control
  steps.forEach((step) => {
    step.addEventListener("animationend", (e) => {
      steps[currentStep].classList.remove("hide");
      e.target.classList.toggle("hide", !e.target.classList.contains("active"));
    });
  });
}

//show hide password toggle

const toggleBtnOne = document.querySelector(".hidden.one");
const showBtnOne = document.querySelector(".show.one");
const toggleBtTwo = document.querySelector(".hidden.two");
const showBtnTwo = document.querySelector(".show.two");

toggleBtnOne.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
    toggleBtnOne.style.visibility = "hidden";
    showBtnOne.style.visibility = "visible";
  }
});

toggleBtTwo.addEventListener("click", () => {
  if (passTwo.type === "password") {
    passTwo.type = "text";
    toggleBtTwo.style.visibility = "hidden";
    showBtnTwo.style.visibility = "visible";
  }
});

showBtnOne.addEventListener("click", () => {
  if (password.type === "text") {
    password.type = "password";
    toggleBtnOne.style.visibility = "visible";
    showBtnOne.style.visibility = "hidden";
  }
});
showBtnTwo.addEventListener("click", () => {
  if (passTwo.type === "text") {
    passTwo.type = "password";
    toggleBtTwo.style.visibility = "visible";
    showBtnTwo.style.visibility = "hidden";
  }
});

// Hide icons when inputs are empty
password.addEventListener("input", () => {
  if (password.value === "") {
    toggleBtnOne.style.visibility = "hidden";
    showBtnOne.style.visibility = "hidden";
  } else {
    toggleBtnOne.style.visibility = "visible";
  }
});

passTwo.addEventListener("input", () => {
  if (passTwo.value === "") {
    toggleBtTwo.style.visibility = "hidden";
    showBtnTwo.style.visibility = "hidden";
  } else {
    toggleBtTwo.style.visibility = "visible";
  }
});

//end sign up section

// scroll to top

const scrollTopBtn = document.querySelector(".scroll-top");
const footerSection = document.querySelector(".footer");
window.addEventListener("scroll", function () {
  const scrollHeight = window.innerHeight;

  const footerDistance = footerSection.getBoundingClientRect().top;
  if (
    window.pageYOffset > scrollHeight &&
    footerDistance > scrollHeight &&
    window.innerWidth >= 1300
  ) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

scrollTopBtn.addEventListener("click", scrollToTop);

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// end scroll to top

//modal section
const modal = document.querySelector(".modal-content");
const overlay = document.querySelector(".overlay-modal");
const gamesSection = document.getElementById("games");
const closeModalBtn = document.querySelector(".modal .close-btn");

function checkScroll() {
  const gamesSectionDistance = gamesSection.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  if (gamesSectionDistance < windowHeight) {
    showModal();
    window.removeEventListener("scroll", checkScroll); // Remove the scroll event listener once the modal is shown
  }
}

window.addEventListener("scroll", checkScroll);

closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

function showModal() {
  overlay.classList.add("active");
  modal.classList.add("active");
}

function closeModal() {
  overlay.classList.remove("active");
  modal.classList.remove("active");
}

//end modal section

//loader

const prealoder = document.getElementById("preloader");
window.addEventListener("load", () => {
  prealoder.style.display = "none";
  document.body.style.overflow = "auto";
});
//end
