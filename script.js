
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

function randint(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let l1 = false;
let l2 = false;
let l3 = false;

let verletzte = 0;
let verletzungen = [];
let sanis = 0;
let material = "";
let handicaps = []

document.getElementById("submit").onclick = function () {
    // reset
    document.getElementById("out").innerHTML = `<h3>Szenario</h3>
    <span class="h">Verletzte: </span><span id="verletzte"></span><br>
    <span class="h" id="h_1">Verletzung von Person 1: </span><span id="verletzungen_1"></span><br>
    <span class="h" id="h_2">Verletzung von Person 2: </span><span id="verletzungen_2"></span><br>
    <span class="h" id="h_3">Verletzung von Person 3: </span><span id="verletzungen_3"></span><br>
    <span class="h" id="h_4">Verletzung von Person 4: </span><span id="verletzungen_4"></span><br>
    <span class="h" id="h_5">Verletzung von Person 5: </span><span id="verletzungen_5"></span><br>
    <span class="h" id="h_6">Verletzung von Person 6: </span><span id="verletzungen_6"></span><br>
    <span class="h">Sanis: </span><span id="sanis"></span><br>
    <span class="h">Material: </span><span id="material"></span><br>
    <span class="h">Handicap 1: </span><span id="handicap_0"></span><br>
    <span class="h">Handicap 2: </span><span id="handicap_1"></span><br>`

    l1 = false;
    l2 = false;
    l3 = false;

    verletzte = 0;
    verletzungen = [];
    sanis = 0;
    material = "";
    handicaps = []
    // Get the selected radio button.
    const selectedRadioButton = document.querySelector('input[name="difficulty"]:checked');

    // Get the value of the selected radio button.
    const difficulty = selectedRadioButton.value;

    
    
    if (difficulty === "Einfach") {
        verletzte = Math.round(Math.random() + 1);
        sanis = randint(3, 4);
    } else if (difficulty === "Mittel") {
        verletzte = Math.round(Math.random()+3);
        sanis = randint(2, 5);
    } else {
        verletzte = Math.round(Math.random()+5);
        sanis = randint(1, 6);
    }

    // choose verletzungen

    get(child(ref(db), "verletzungen")).then((snapshot) => {
        if (!snapshot.exists()) {
            window.alert("Etwas stimmt mit der Datenbank nicht!");
        }
        const val = snapshot.val();
        let keys = Object.keys(val);
        for (let i = 0; i < verletzte; i++) {
            let toappend = val[keys[randint(0, keys.length - 1)]];
            verletzungen.push(toappend);
        }
        console.log("Verletzungen: ");
        console.log(verletzungen);
        l1 = true;
    });

    // choose Material
    let difficulty_translator = {"Einfach":"easy", "Mittel":"medium", "Schwer":"hard"};

    get(child(ref(db), "material/" + difficulty_translator[difficulty])).then((snapshot) => {
        if (!snapshot.exists()) {
            window.alert("Etwas stimmt mit der Datenbank nicht!");
        }

        const val = snapshot.val();
        let keys = Object.keys(val);
        material = val[keys[randint(0, keys.length - 1)]];
        l2 = true;

    });

    // choose handicap
    if (difficulty !== "Einfach") {
        get(child(ref(db), "handicap")).then((snapshot) => {
            if (!snapshot.exists()) {
                window.alert("Etwas stimmt mit der Datenbank nicht!");
            }

            const val = snapshot.val();
            let keys = Object.keys(val);
            if (difficulty === "Mittel") {
                handicaps.push(val[keys[randint(0, keys.length)]]);
            } else {
                let k = randint(0, keys.length);
                handicaps.push(val[keys[k]]);
                while (true) {
                    let r = randint(0, keys.length);
                    if (r !== k) {
                        handicaps.push(val[keys[r]]);
                        break;
                    }
                }
            }
            l3 = true;

        });
    } else {
        l3 = true;
    }
    setTimeout(t, 100);

}

function t() {
    console.log("Checking for data loaded")
    if (l1 && l2 && l3) {
        console.log("all data loaded!");
        fill()
        return;
    }
    setTimeout(t, 100);
}

function fill() {
    document.getElementById("verletzte").innerHTML = verletzte;
    document.getElementById("sanis").innerHTML =  sanis;
    document.getElementById("material").innerHTML =  material;
    for (let i = 0; i < verletzungen.length; i++) {
        document.getElementById("verletzungen_" + (i + 1)).innerHTML = verletzungen[i];
    }
    for (let i = 0; i < 6; i++) {
        if (i <= verletzungen.length - 1){ 
            continue; 
        }
        document.getElementById("h_" + (i + 1)).style.display = "none";
    }
    for (let i = 0; i < handicaps.length; i++) {
        if (handicaps[i] != undefined) {
            document.getElementById("handicap_" + i).innerHTML =  handicaps[i];
        }
    }

    document.getElementById("out").style.display = "initial";

    // document.querySelector(".h").style = "font-weight: bold";
    
}

