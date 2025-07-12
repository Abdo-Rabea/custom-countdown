const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdown-form");
const titleEl = document.getElementById("title");
const dateEl = document.getElementById("date");
const countDownContainer = document.getElementById("countdown");
const countDownTitleEl = document.getElementById("countdown-title");
const countDownValues = document.querySelectorAll("span");
const completeContainer = document.getElementById("complete");
const completeInfoEl = document.getElementById("complete-info");
const countdownReset = document.getElementById("countdown-button");
const newCountDown = document.getElementById("complete-button");

let countDownTitle = "";
let countDownDate = new Date();
let updateDomIntervralId = 0;

// local storage functionalities
function clearLocalStorgeCountDown() {
  localStorage.removeItem("count-down");
}
// sets the count down date and title if exists & update dom
function getLocalStorageCountDown() {
  const localStorageCountDown = JSON.parse(localStorage.getItem("count-down"));
  if (localStorageCountDown) {
    countDownDate = new Date(localStorageCountDown.date);
    countDownTitle = localStorageCountDown.title;
    updateDomIntervralId = setInterval(updateDom, 1000);
    updateDom();
  }
}

function showView(view) {
  inputContainer.hidden = true;
  countDownContainer.hidden = true;
  completeContainer.hidden = true;
  if (view === "countdownForm") inputContainer.hidden = false;
  else if (view === "countDownTimer") countDownContainer.hidden = false;
  else if (view === "complete") completeContainer.hidden = false;
}
function getCountDownValues(futureDate) {
  let totalTime = (futureDate.getTime() - new Date().getTime()) / 1000; // total time in seconds

  const days = Math.floor(totalTime / 60 / 60 / 24);
  totalTime -= days * 24 * 60 * 60;
  const hours = Math.floor(totalTime / 60 / 60);
  totalTime -= hours * 60 * 60;
  const minutes = Math.floor(totalTime / 60);
  totalTime -= minutes * 60;
  const seconds = Math.floor(totalTime);
  return [days, hours, minutes, seconds];
}

// update the Dom probely ( just set the countDownDate )
function updateDom() {
  if (countDownDate > new Date()) {
    // show countDown
    // set its timer
    showView("countDownTimer");
    // populate data (title - date values)
    const dateValues = getCountDownValues(countDownDate);
    countDownTitleEl.textContent = countDownTitle;
    countDownValues.forEach((e, i) => (e.textContent = dateValues[i]));
  } else {
    // stop timer
    clearInterval(updateDomIntervralId);
    // show complete view
    showView("complete");
    // update dom count down finished on (countDownDate)
    completeInfoEl.textContent = `Countdow Finished on ${
      countDownDate.toISOString().split("T")[0]
    }`;
  }
}

function updateCountdown(e) {
  e.preventDefault();
  // update title and date state
  if (e.target[1].value === "") {
    alert("please enter a valid date");
    return;
  }
  countDownTitle = e.target[0].value; // = sourceElement
  countDownDate = new Date(e.target[1].value);

  // show countdown view * populate data
  updateDom();
  updateDomIntervralId = setInterval(updateDom, 1000);

  // save date into localStorage
  localStorage.setItem(
    "count-down",
    JSON.stringify({
      date: countDownDate.toISOString(),
      title: countDownTitle,
    })
  );
}
// Reset timer & back to countDown Form view
function resetCountDown() {
  clearInterval(updateDomIntervralId);
  showView("countdownForm");
  // no state here idiot
  countDownTitle = "";
  countDownDate = Date;
  titleEl.value = "";
  dateEl.value = Date;

  clearLocalStorgeCountDown();
}
// Eventhandlers
countdownForm.addEventListener("submit", updateCountdown);
countdownReset.addEventListener("click", resetCountDown);
newCountDown.addEventListener("click", resetCountDown);
// on load
// set date input min with today's date
dateEl.setAttribute("min", new Date().toISOString().split("T")[0]);

// local storage load
getLocalStorageCountDown();
