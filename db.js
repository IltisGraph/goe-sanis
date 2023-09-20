// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { get, child, ref, set, getDatabase } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNc8hytBI4Nk7DIOnCxThi5_6Z_1n_CxI",
  authDomain: "goe-sanis.firebaseapp.com",
  projectId: "goe-sanis",
  storageBucket: "goe-sanis.appspot.com",
  messagingSenderId: "944949693404",
  appId: "1:944949693404:web:217d920e3d6edd7efd1d19",
  databaseURL: "https://goe-sanis-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function fill(id, snapshot, db_path) {
    const val = snapshot.val();
    let keys = Object.keys(val);

    for (let key of keys) {
        const parentDiv = document.getElementById(id); // Assuming there's a div with the id 'add'

        const newDiv = document.createElement('div');
        const textNode = document.createTextNode(val[key]);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';
        deleteButton.addEventListener("click", function() {
            set(ref(db, db_path + "/" + key), {});
            window.location.reload();
        })

        newDiv.appendChild(textNode);
        newDiv.appendChild(deleteButton);

        parentDiv.appendChild(newDiv);
    }
}

get(child(ref(db), "handicap")).then((snapshot) => {
    if (!snapshot.exists()) {
        window.alert("Etwas stimmt mit der Datenbank nicht!");
    }
    fill("handicap-add", snapshot, "handicap")
});
get(child(ref(db), "verletzungen")).then((snapshot) => {
    if (!snapshot.exists()) {
        window.alert("Etwas stimmt mit der Datenbank nicht!");
    }
    fill("verletzungen-add", snapshot, "verletzungen")
});
get(child(ref(db), "material/easy")).then((snapshot) => {
    if (!snapshot.exists()) {
        window.alert("Etwas stimmt mit der Datenbank nicht!");
    }
    fill("easy", snapshot, "material/easy")
});
get(child(ref(db), "material/medium")).then((snapshot) => {
    if (!snapshot.exists()) {
        window.alert("Etwas stimmt mit der Datenbank nicht!");
    }
    fill("medium", snapshot, "material/medium")
});
get(child(ref(db), "material/hard")).then((snapshot) => {
    if (!snapshot.exists()) {
        window.alert("Etwas stimmt mit der Datenbank nicht!");
    }
    fill("hard", snapshot, "material/hard")
});

function add_to_db(path) {
    const element = window.prompt("Gib das ein, was du einfügen willst!");
    if (element == null) {
        return;
    }
    set(ref(db, path + "/" + Math.ceil(Date.now())), element);
    window.location.reload()
}


document.getElementById("verletzungen-b").onclick = function() {
    add_to_db("verletzungen");   
}
document.getElementById("handicap-b").onclick = function() {
    add_to_db("handicap")
}
document.getElementById("medium-b").onclick = function() {
    add_to_db("material/medium")
}
document.getElementById("easy-b").onclick = function() {
    add_to_db("material/easy")
}
document.getElementById("hard-b").onclick = function() {
    add_to_db("material/hard")
}
