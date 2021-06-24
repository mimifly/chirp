const database = firebase.database();
const chirpsStorage = firebase.database().ref("chirps/");
const textarea = document.querySelector("textarea");
const form = document.querySelector("form");
const chirps = document.querySelector(".chirps");
const button = document.querySelector(".submit");
const isblank = /[^\s]/;
let lastStamp = 0;
const dayInUnix = 86400000;

textarea.addEventListener("input", (event) => {
  textarea.style.height = textarea.style.minHeight;
  textarea.style.height = event.target.scrollHeight + 1 + "px"; // + 1to escape scrollbar

  if (!isblank.test(textarea.value)) {
    button.classList.remove("active");
  } else {
    button.classList.add("active");
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isblank.test(textarea.value)) return;
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
      const newChirp = document.createElement("li");
      newChirp.textContent = dataFromSnapshot[key];
      chirps.insertBefore(newChirp, chirps.firstChild);
    }
  }
  textarea.value = "";
  button.classList.remove("active");
});
