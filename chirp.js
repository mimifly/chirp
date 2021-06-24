const database = firebase.database();
const chirpsStorage = firebase.database().ref("chirps/");
const textarea = document.querySelector("textarea");
const form = document.querySelector("form");
const chirps = document.querySelector(".chirps");
const button = document.querySelector(".submit");
const isblank = /[^\s]/;
let lastStamp = 0;

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
  /* let date = time.getDate() + " " + time.getMonth() + " " + time.getFullYear()
  let time = time.getHours() + ":" + time.getMinutes() + */
  database.ref("chirps/" + `${time}/`).set(textarea.value);
  /* const newChirp = document.createElement("li");
  newChirp.textContent = textarea.value;
  chirps.insertBefore(newChirp, chirps.firstChild); */
});

chirpsStorage.on("value", (snapshot) => {
  let dataFromSnapshot = snapshot.val();
  for (let key in dataFromSnapshot) {
    if (key > lastStamp) {
      lastStamp = key;
      const newChirp = document.createElement("li");
      newChirp.textContent = dataFromSnapshot[key];
      chirps.insertBefore(newChirp, chirps.firstChild);
    }
  }
});
