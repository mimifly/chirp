const database = firebase.database();
const chirpsStorage = firebase.database().ref("chirps/");
const textarea = document.querySelector("textarea");
const form = document.querySelector("form");
const chirps = document.querySelector(".chirps");
const button = document.querySelector(".submit");
const limitDisplay = document.querySelector(".limit");
const isblank = /[^\s]/;
const dayInUnix = 86400000;
const characterLimit = 250;
let lastStamp = 0;
let chirpsArray = [];

function elapsedUnix(u) {
  const time = new Date().valueOf();
  let elapsed = time - u;
  if (elapsed > 3600000) {
    return Math.round(elapsed / 3600000) + " hr ago";
  } else if (elapsed / 60000 < 1) {
    return "now";
  } else {
    return Math.round(elapsed / 60000) + " m ago";
  }
}

textarea.addEventListener("input", (event) => {
  textarea.style.height = textarea.style.minHeight;
  textarea.style.height = event.target.scrollHeight + 1 + "px"; // + 1to escape scrollbar
  const characterCount = textarea.value.length;
  if (!isblank.test(textarea.value)) {
    button.classList.remove("active");
    limitDisplay.innerHTML = "";
  } else if (characterCount > characterLimit) {
    button.classList.remove("active");
    limitDisplay.innerHTML = `<span class="maxed">${characterCount} of ${characterLimit} characters</span>`;
  } else {
    button.classList.add("active");
    limitDisplay.innerHTML = `${characterCount} of ${characterLimit} characters`;
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isblank.test(textarea.value) || textarea.value.length > characterLimit)
    return;
  const time = new Date().valueOf();
  database.ref("chirps/" + `${time}/`).set(textarea.value);
});

chirpsStorage.on("value", (snapshot) => {
  let dataFromSnapshot = snapshot.val();
  for (let key in dataFromSnapshot) {
    const time = new Date().valueOf();
    if (time - key > dayInUnix) {
      database.ref("chirps/" + key).remove();
    } else if (key > lastStamp) {
      lastStamp = key;
      chirpsArray.push({ time: key, message: dataFromSnapshot[key] });
      let chirpsHTML = chirpsArray
        .map((chirp) => {
          return ` 
        <li>
          <p class="time">${elapsedUnix(chirp.time)}</p>
          <p class="message">${chirp.message}</p>
        </li>
        `;
        })
        .reverse()
        .join("");
      chirps.innerHTML = chirpsHTML;
    }
  }
  textarea.value = "";
  textarea.style.height = textarea.style.minHeight;
  limitDisplay.innerHTML = "";
  button.classList.remove("active");
});
