const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box "),
  popupTitle = document.querySelector("header p"),
  popupClose = document.querySelector("header i"),
  inputElem = document.querySelector("input"),
  textareaElem = document.querySelector("textarea"),
  buttonElem = document.querySelector("button"),
  wrapperElem = document.querySelector(".wrapper");

let isUpdate = false;
let updateID = null;

let notes = [];

window.addEventListener("load", () => {
  let notes = getLocalStorageNotes();
  generateNotes(notes);
});

addBox.addEventListener("click", showModal);

function showModal(noteTitle, noteDesc) {
  if (isUpdate) {
    popupTitle.innerHTML = "Update main note";
    buttonElem.innerHTML = "Update Note";
    inputElem.value = noteTitle;
    textareaElem.value = noteDesc;
  } else {
    popupTitle.innerHTML = "Add a new note";
    buttonElem.innerHTML = "Add Note";
  }
  inputElem.focus();
  popupBox.classList.add("show");
}
function closeModal() {
  popupBox.classList.remove("show");
}
popupClose.addEventListener("click", closeModal);

window.addEventListener("keyup", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

buttonElem.addEventListener("click", () => {
  if (isUpdate) {
    let allNotes = getLocalStorageNotes();

    allNotes.forEach((note, index) => {
      if (index === updateID) {
        note.title = inputElem.value;
        note.description = textareaElem.value;
      }
    });

    setNotesInLocalStorage(allNotes);
    generateNotes(allNotes);
    closeModal();
    clearInputs();

    isUpdate = false;
  } else {
    let newNote = {
      title: inputElem.value,
      description: textareaElem.value,
      date: getNowDate(),
    };

    notes.push(newNote);
    setNotesInLocalStorage(notes);
    closeModal();
    generateNotes(notes);
    clearInputs();
  }
});

function getNowDate() {
  let now = new Date();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let nowDay = now.getDay();
  let nowMonth = now.getMonth();
  let nowYear = now.getFullYear();
  let dayOfMonth = now.getDate();
  return `${months[nowMonth]} ${dayOfMonth}, ${nowYear} (${days[nowDay]})`;
}

function clearInputs() {
  inputElem.value = "";
  textareaElem.value = "";
}

function generateNotes(notes) {
  document.querySelectorAll(".note").forEach((note) => note.remove());

  notes.forEach((note, index) => {
    wrapperElem.insertAdjacentHTML(
      "beforeend",
      `
        <li class="note">
        <div class="details">
          <p>${note.title}</p>
          <span>${note.description}</span>
        </div>
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i class="uil uil-ellipsis-h" onclick="showSetting(this)"></i>
            <ul class="menu">
              <li onclick="editNote(${index}, '${note.title}', '${note.description}')">
                <i class="uil uil-pen"></i>Edit
              </li>
              <li onclick="removeNote(${index})">
                <i class="uil uil-trash"></i>Delete
              </li>
            </ul>
          </div>
        </div>
      </li>
        `
    );
  });
}

function removeNote(noteIndex) {
  let deleted = confirm("Are you sure to delete note?!");

  if (deleted) {
    let newNotes = getLocalStorageNotes();

    newNotes.splice(noteIndex, 1);
    setNotesInLocalStorage(newNotes);
    generateNotes(newNotes);
  }
}

function editNote(noteID, noteTitle, nodeDesc) {
  isUpdate = true;
  showModal(noteTitle, nodeDesc);
  updateID = noteID;
}

function showSetting(el) {
  el.parentElement.classList.add("show");

  document.addEventListener("click", (event) => {
    if (event.target.tagName !== "I" || event.target != el) {
      el.parentElement.classList.remove("show");
    }
  });
}

function getLocalStorageNotes() {
  let localStorageNotes = localStorage.getItem("notes");

  if (localStorageNotes) {
    notes = JSON.parse(localStorageNotes);
  } else {
    notes = [];
  }

  return notes;
}

function setNotesInLocalStorage(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}
