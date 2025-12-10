// more sound effects at https://www.myinstants.com/en/search/?name=FNAF
var IDs = [
  "topBox",
  "midBox",
  "botBox",
  "elecBox1",
  "elecBox2",
  "elecBox3",
  "hintModal",
];
var rotationsbox1 = [
  "strotate-0",
  "rotate-180",
  "strotate-90",
  "strotate-90",
  "strotate-90",
];
var rotationsbox2 = [
  "rotate-180",
  "crotate-0",
  "rotate-270",
  "strotate-90",
  "crotate-0",
  "rotate-180",
  "crotate-90",
];
var rotationsbox3 = [
  "strotate-90",
  "crotate-0",
  "rotate-180",
  "crotate-0",
  "rotate-180",
];
var fakeBox = [
  "rotate-180",
  "strotate-90",
  "strotate-90",
  "strotate-90",
  "crotate-0",
];

var fake = false;
var i;
var straightLength = 0;
var curveLength = 0;
var wires1 = 0;
var wires2 = 0;
var wires3 = 0;
var clicks = 1;
var connected = true;
var straightSelect = false;
var curveSelect = false;
var removal = false;
var box1 = false;
var box2 = false;
var box3 = false;
var timer = 150;
var count = true;
var sparks = 2;
var mute = true;

let clock = setInterval(function () {
  if (count == true) {
    timer--;
    document.getElementById("timer").innerHTML = timer;
    if (timer <= 0) {
      clearInterval(clock);
      jumpScawe();
    }
  }
}, 1000);

function jumpScawe() {
  document.body.style.backgroundImage = "url('images/Chmicken.gif')";
  document.getElementById("jumpScareModal").style.display = "flex";
  mute = false;
  muted(document.getElementById("mutes"));
  document.getElementById("jumps").play();
}

let sound = new Audio("sounds/ambience.wav");
function ambience() {
  sound.volume = 0.8;
  sound.loop = true;
  if (mute == false) {
    sound.play();
  } else if (mute == true) {
    sound.pause();
  }
}

function playSparks() {
  if (mute || sparks == 0) return; // stop if muted
  spark.play();
  spark.onended = () => {
    setTimeout(playSparks, 3000); // schedule next play after 3 seconds
  };
}

let spark = new Audio("sounds/Sparks.wav");
spark.loop = false;
function electricity() {
  sparkVolume();

  if (mute == false) {
    playSparks();
  } else if (mute == true) {
    spark.pause();
  }
}

function sparkVolume() {
  if (sparks == 2) {
    spark.volume = 0.6;
  } else if (sparks == 1) {
    spark.volume = 0.2;
  }
}

function muted(choose) {
  if (mute == true) {
    choose.innerHTML = "UnMuted";
    mute = false;
    choose.setAttribute("class", "muteButton green");
    ambience();
    electricity();
  } else if (mute == false) {
    choose.innerHTML = "Muted";
    mute = true;
    choose.setAttribute("class", "muteButton red");
    ambience();
    electricity();
  }
}

function showModal(mood) {
  i = mood.id;
  document.getElementById(IDs[mood.id]).style.display = "flex";
}

function hideModal() {
  document.getElementById(IDs[i]).style.display = "none";
}

function grabWires(choose) {
  if (choose.src.match("StraightWire")) {
    straightLength++;
    console.log("Straight Wires = " + straightLength);
    choose.src = "";
    for (let p = 0; p < 6; p++) {
      document.getElementById("straightCount" + p).innerHTML = straightLength;
    }
  } else if (choose.src.match("CurvedWire")) {
    curveLength++;
    console.log("Curved Wires = " + curveLength);
    choose.src = "";
    for (let p = 0; p < 6; p++) {
      document.getElementById("curveCount" + p).innerHTML = curveLength;
    }
  }
}

function addWires(choose) {
  if (straightLength > 0 && straightSelect == true) {
    straightLength--;
    choose.src = "images/StraightWire.png";
    choose.classList.add("cursor", "strotate-0");
    choose.classList.remove("StrWire", "CurWire");
    choose.setAttribute("onclick", "removeWires(this)");
    for (let p = 0; p < 6; p++) {
      document.getElementById("straightCount" + p).innerHTML = straightLength;
    }
    choose.setAttribute("onclick", "rotateStraight(this)");
    if (i == 3) {
      wires3++;
    } else if (i == 4) {
      wires2++;
    } else if (i == 5) {
      wires1++;
    }
    console.log("Straight Wires = " + straightLength);
    checkConnect();
  } else if (curveLength > 0 && curveSelect == true) {
    curveLength--;
    choose.src = "images/CurvedWire.png";
    choose.classList.add("cursor", "crotate-0");
    choose.classList.remove("StrWire", "CurWire");
    choose.setAttribute("onclick", "removeWires(this)");
    for (let p = 0; p < 6; p++) {
      document.getElementById("curveCount" + p).innerHTML = curveLength;
    }
    choose.setAttribute("onclick", "rotateCurve(this)");
    if (i == 3) {
      wires3++;
    } else if (i == 4) {
      wires2++;
    } else if (i == 5) {
      wires1++;
    }

    console.log("Curved Wires = " + curveLength);
    checkConnect();
  }
}

function rotateCurve(choose) {
  if (removal == true) {
    removeWires(choose);
  } else if (choose.classList.contains("crotate-0")) {
    choose.classList.remove("crotate-0", "cursor");
    choose.classList.add("crotate-90", "cursor-90");
    checkConnect();
  } else if (choose.classList.contains("crotate-90")) {
    choose.classList.remove("crotate-90", "cursor-90");
    choose.classList.add("rotate-180", "cursor-180");
    checkConnect();
  } else if (choose.classList.contains("rotate-180")) {
    choose.classList.remove("rotate-180", "cursor-180");
    choose.classList.add("rotate-270", "cursor-270");
    checkConnect();
  } else if (choose.classList.contains("rotate-270")) {
    choose.classList.remove("rotate-270", "cursor-270");
    choose.classList.add("crotate-0", "cursor");
    checkConnect();
  }
}

function rotateStraight(choose) {
  if (removal == true) {
    removeWires(choose);
  } else if (choose.classList.contains("strotate-0")) {
    choose.classList.remove("strotate-0", "cursor");
    choose.classList.add("strotate-90", "cursor-90");
    checkConnect();
  } else if (choose.classList.contains("strotate-90")) {
    choose.classList.remove("strotate-90", "cursor-90");
    choose.classList.add("strotate-0", "cursor");
    checkConnect();
  }
}

function pressDown() {
  for (let i = 0; i < 6; i++) {
    let curveEl = document.getElementById("curve" + i);
    let straightEl = document.getElementById("straight" + i);

    if (straightSelect == true) {
      straightEl.classList.add("dent");
      curveEl.classList.remove("dent");
    } else if (curveSelect == true) {
      curveEl.classList.add("dent");
      straightEl.classList.remove("dent");
    }
  }
}

function cursorTemplate(lessThan, ID, match, add, remove1, remove2) {
  for (let i = 0; i < lessThan; i++) {
    if (document.getElementById(ID + i).src.match(match)) {
      document.getElementById(ID + i).classList.add(add);
      document.getElementById(ID + i).classList.remove(remove1);
      document.getElementById(ID + i).classList.remove(remove2);
    }
  }
}

function cursorChange() {
  if (straightSelect == true) {
    cursorTemplate(5, "wir", "Nothing", "StrWire", "CurWire", "cursor");

    cursorTemplate(7, "wire", "Nothing", "StrWire", "CurWire", "cursor");

    cursorTemplate(5, "wore", "Nothing", "StrWire", "CurWire", "cursor");
  } else if (curveSelect == true) {
    cursorTemplate(5, "wir", "Nothing", "CurWire", "StrWire", "cursor");

    cursorTemplate(7, "wire", "Nothing", "CurWire", "StrWire", "cursor");

    cursorTemplate(5, "wore", "Nothing", "CurWire", "StrWire", "cursor");
  }
}

function wireCheck(choose) {
  if (choose.src.match("Straight")) {
    straightSelect = true;
    curveSelect = false;
    cursorChange();
    pressDown();
    console.log("straight " + straightSelect);
  } else if (choose.src.match("Curved")) {
    straightSelect = false;
    curveSelect = true;
    cursorChange();
    pressDown();
    console.log("curve " + curveSelect);
  }
}

function wireRemoval(choose) {
  if (clicks == 1) {
    removal = true;
    cursorChange();
    choose.setAttribute("class", "small-boxes red center cursor");
    for (let i = 0; i < 3; i++) {
      document.getElementById("remove" + i).setAttribute("class", "white-font");
      document.getElementById("button" + i).classList.add("red");
      document.getElementById("button" + i).classList.remove("black");
    }
    clicks = 2;
    console.log(removal);
  } else if (clicks == 2) {
    removal = false;
    cursorChange();
    for (let i = 0; i < 3; i++) {
      document.getElementById("remove" + i).setAttribute("class", "red-font");
      document.getElementById("button" + i).classList.remove("red");
      document.getElementById("button" + i).classList.add("black");
    }
    clicks = 1;
    console.log(removal);
  }
}

function removeWires(choose) {
  if (choose.src.match("CurvedWire")) {
    choose.src = "images/Nothing.png";
    curveLength++;
    console.log("Curved Wires = " + curveLength);
    choose.setAttribute("onclick", "addWires(this)");
    choose.classList.remove("crotate-90", "rotate-180", "rotate-270");
    choose.classList.remove("cursor-90", "cursor-180", "cursor-270");
    if (i == 3) {
      wires3--;
    } else if (i == 4) {
      wires2--;
    } else if (i == 5) {
      wires1--;
    }
    changeColors();
    cursorChange();
    for (let p = 0; p < 6; p++) {
      document.getElementById("curveCount" + p).innerHTML = curveLength;
    }
  } else if (choose.src.match("StraightWire")) {
    choose.src = "images/Nothing.png";
    straightLength++;
    console.log("Straight Wires = " + straightLength);
    choose.setAttribute("onclick", "addWires(this)");
    choose.classList.remove("strotate-90", "rotate-180", "rotate-270");
    choose.classList.remove("cursor-90", "cursor-180", "cursor-270");
    if (i == 3) {
      wires3--;
    } else if (i == 4) {
      wires2--;
    } else if (i == 5) {
      wires1--;
    }
    changeColors();
    cursorChange();
    for (let p = 0; p < 6; p++) {
      document.getElementById("straightCount" + p).innerHTML = straightLength;
    }
  }
}

function nextLevel() {
  if (i == 3) {
    document.getElementById(IDs[i]).style.display = "none";
    i = 4;
    document.getElementById(IDs[i]).style.display = "flex";
    console.log("modal " + i);
  } else if (i == 4) {
    document.getElementById(IDs[i]).style.display = "none";
    i = 5;
    document.getElementById(IDs[i]).style.display = "flex";
    console.log("modal " + i);
  } else if (i == 5) {
    document.getElementById(IDs[i]).style.display = "none";
    document.getElementById(IDs[i]).style.display = "flex";
    console.log("modal " + i);
  }
}

function lastLevel() {
  if (i == 5) {
    document.getElementById(IDs[i]).style.display = "none";
    i = 4;
    document.getElementById(IDs[i]).style.display = "flex";
    console.log("modal " + i);
  } else if (i == 4) {
    document.getElementById(IDs[i]).style.display = "none";
    i = 3;
    document.getElementById(IDs[i]).style.display = "flex";
    console.log("modal " + i);
  } else if (i == 3) {
    document.getElementById(IDs[i]).style.display = "none";
    document.getElementById(IDs[i]).style.display = "flex";
    console.log("modal " + i);
  }
}

function checkConnect() {
  checkRotation();
  if (
    wires1 == 5 &&
    wires2 == 7 &&
    wires3 == 5 &&
    box1 == true &&
    box2 == true &&
    box3 == true
  ) {
    console.log("Winnin");
    connected = true;
    sparks = 0;
    sparkVolume();
  } else {
    connected = false;
  }
}

function checkRotation() {
  for (let e = 0; e < rotationsbox1.length; e++) {
    const check = document.getElementById("wir" + e);
    if (!check.classList.contains(rotationsbox1[e])) {
      // sets the success flag to false and stops th  e loop
      box1 = false;
      changeColors();
      sparks = 2;
      sparkVolume();
      break;
    } else {
      box1 = true;
      changeColors();
      sparks = 1;
      sparkVolume();
    }
  }
  for (let e = 0; e < rotationsbox2.length; e++) {
    const check = document.getElementById("wire" + e);
    if (!check.classList.contains(rotationsbox2[e])) {
      // sets the success flag to false and stops the loop
      box2 = false;
      changeColors();
      sparks = 2;
      sparkVolume();
      break;
    } else {
      box2 = true;
      changeColors();
      sparks = 1;
      sparkVolume();
    }
  }
  for (let p = 0; p < rotationsbox3.length; p++) {
    const checked = document.getElementById("wore" + p);
    if (!checked.classList.contains(rotationsbox3[p])) {
      // sets the success flag to false and stops the loop
      box3 = false;
      changeColors();
      sparks = 2;
      sparkVolume();
      break;
    } else {
      box3 = true;
      changeColors();
      sparks = 1;
      sparkVolume();
    }
  }
  for (let p = 0; p < fakeBox.length; p++) {
    const checks = document.getElementById("wire" + p);
    if (!checks.classList.contains(fakeBox[p])) {
      // sets the success flag to false and stops the loop
      fake = false;
      fakeColor();
      sparks = 2;
      sparkVolume();
      break;
    } else {
      fake = true;
      fakeColor();
      sparks = 1;
      sparkVolume();
    }
  }
}

function changeColors() {
  let z = 1;
  let y = 2;
  let values = [box1, box2, box3];
  let wireVar = [wires1, wires2, wires3];
  let wireCount = [5, 7, 5];
  for (let o = 0; o <= 2; o++) {
    if (values[o] == true && wireVar[o] == wireCount[o]) {
      for (let t = z; t <= y; t++) {
        document.getElementById("Start" + t).classList.remove("blood");
        document.getElementById("Start" + t).classList.add("green");
      }
    } else {
      for (let t = z; t <= y; t++) {
        document.getElementById("Start" + t).classList.add("blood");
        document.getElementById("Start" + t).classList.remove("green");
      }
    }
    z = z + 2;
    y = y + 2;
  }
}

function fakeColor() {
  if (wires2 == 5 && fake == true) {
    document.getElementById("Start3").classList.remove("blood");
    document.getElementById("Start3").classList.add("green");
    document.getElementById("Start4").classList.remove("blood");
    document.getElementById("Start4").classList.add("green");
  } else {
    document.getElementById("Start3").classList.remove("green");
    document.getElementById("Start3").classList.add("blood");
    document.getElementById("Start4").classList.remove("green");
    document.getElementById("Start4").classList.add("blood");
  }
}

function removeKey(choose) {
  if (choose.src.match("KEY")) {
    choose.src = "images/Nothing.png";
    document.getElementById("bread").play();
    document.getElementById("bigKey").src = "images/KEY.png";
    document.getElementById("bigKey").classList.add("bottomKey");
    choose.classList.remove("cursor");
    document.getElementById("leave").setAttribute("onclick", "goUp()");
    document.getElementById("leave").src = "images/uparrow.png";
  }
}

function lights() {
  checkConnect();
  if (connected == true) {
    if (document.body.style.backgroundImage.match("Bright")) {
      document.body.style.backgroundImage = "url('images/FNAFKitchen.webp')";
      document.getElementById("6").src = "images/Nothing.png";
      document.getElementById("6").classList.remove("cursor");
      count = true;
    } else {
      document.body.style.backgroundImage =
        "url('images/FNAFKitchenBright.jpg')";
      document.getElementById("6").src = "images/KEY.png";
      document.getElementById("6").classList.add("cursor");
      document.getElementById("6").setAttribute("onclick", "removeKey(this)");
      count = false;
      document.body.style.backgroundColor = "white";
    }
  }
}

//! means not so its checking if it doesn't meet the requirements

//if (choose.classList.contains("rotate-90")) {
//}

//if (check()) {
//}

// Arrow Code
function goUp() {
  window.location.href = "https://227k25.csb.app/";
}
function restart() {
  window.location.href = "";
}
