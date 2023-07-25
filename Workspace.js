const firebaseConfig = {
  apiKey: "AIzaSyA76xKoi3-xjoEvzH0EguwIQM4RfwPT55M",
  authDomain: "health-59eca.firebaseapp.com",
  databaseURL: "https://health-59eca-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "health-59eca",
  storageBucket: "health-59eca.appspot.com",
  messagingSenderId: "1095808364266",
  appId: "1:1095808364266:web:bfa216a78acb9072147193",
  measurementId: "G-3D1813PSL9"
};

firebase.initializeApp(firebaseConfig);

const toggleSwitch = document.querySelector('input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');
const Workspace = document.getElementById("Workspace")
const home = document.getElementById("home")
const login = document.getElementById("ic")
const logout = document.getElementById("logout")
const name = document.getElementById("nameic")
const icon = document.getElementById("icon");
const arrow = document.getElementById("arrow");
const Mode = document.getElementById("mode");
const drop = document.getElementsByClassName("dropdown-content");
const deletebtn = document.getElementById("delete");
const deletedatabtn = document.getElementById("delete-data");
const Allbtn = document.getElementById("All");
const All = document.getElementsByClassName("container");
const Weekbtn = document.getElementById("Weekly");
const Week = document.getElementsByClassName("container2");

home.onclick = function () {
  window.location.href = "Home.html";
}

login.addEventListener("click", function () {
  if (icon.innerHTML === "login") {
    window.location.href = "Login.html";
  }
});

logout.onclick = function () {
  firebase.database().ref("/Login").update({
    "Login": "False",
    "User": "None"
  })
};

firebase.database().ref("/Login").on("value", function (snapshot) {
  if (snapshot.exists()) {
    console.log(snapshot.val())
    var Webmode = snapshot.val()
    if (Webmode["Login"] == "True") {
      icon.innerHTML = "account_circle";
      name.innerHTML = Webmode["User"];
      arrow.style.display = "flex";
      arrow.onclick = function () {
        for (var i = 0; i < drop.length; i++) {
          var style = window.getComputedStyle(drop[i]);
          if (style.display === "none") {
            drop[i].style.display = "block";
          } else {
            drop[i].style.display = "none";
          }
        }
      };
      Workspace.onclick = function () {
        window.location.href = "Workspace.html";
      }
    }
    if (Webmode["Login"] == "False") {
      icon.innerHTML = "login";
      name.innerHTML = "Login";
      arrow.style.display = "none";
      for (var i = 0; i < drop.length; i++) {
        drop[i].style.display = "none";
      }
      Workspace.onclick = function () {
        swal(
          "",
          "Please login to use this feature!",
          "info"
        )
      }
    }
  }
});

if (currentTheme === 'dark') {
  document.documentElement.classList.add('dark-mode');
  toggleSwitch.checked = true;
} else {
  document.documentElement.classList.add('light-mode');
  toggleSwitch.checked = false;
}

if (currentTheme) {
  document.documentElement.classList.add(currentTheme);
  toggleSwitch.checked = currentTheme === 'dark';
}

function switchTheme() {
  if (toggleSwitch.checked) {
    document.documentElement.classList.remove('light-mode');
    document.documentElement.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  }
  else {
    document.documentElement.classList.remove('dark-mode');
    document.documentElement.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  }
}

Mode.onclick = function () {
  toggleSwitch.checked = !toggleSwitch.checked;
  switchTheme();
}

toggleSwitch.addEventListener('change', switchTheme, false);

// "----------------------------------------------Weekly datas-------------------------------------------------------"
function SelectAllData() {
  firebase.database().ref('Workspace').on('value',
    function (AllRecords) {
      deleteAllRows();
      AllRecords.forEach(
        function (CurentRecord) {
          var Day = CurentRecord.key;
          firebase.database().ref('Workspace').child(CurentRecord.key).on('value',
            function (AllRecords) {
              AllRecords.forEach(
                function (CurentRecord) {
                  var Time = CurentRecord.key;
                  var userID = CurentRecord.val().UserID;
                  var Status = CurentRecord.val().Status;
                  var Temp = CurentRecord.val().Temp;
                  AddItemsToTable(Day, Time, userID, Status, Temp);
                }
              )
            })
        })
    })
}

function AddItemsToTable(Day, Time, userID, Status, Temp) {
  var tbody = document.getElementById('tbody2');
  var trow = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var td5 = document.createElement('td');
  td1.innerHTML = Day;
  td2.innerHTML = Time;
  td3.innerHTML = userID;
  td4.innerHTML = Status;
  td5.innerHTML = Temp;
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);
  tbody.insertBefore(trow, tbody.firstChild);
}

function deleteAllRows() {
  var table = document.getElementById("tbody2");
  var rowCount = table.rows.length;
  for (var i = rowCount - 1; i >= 0; i--) {
    table.deleteRow(i);
  }
}

deletebtn.onclick = function () {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Please enter password!',
        input: 'password',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
          return firebase.database().ref("/Login").once("value").then(function (snapshot) {
            if (snapshot.exists()) {
              var Webmode = snapshot.val();
              const change = {
                Username: Webmode["User"],
                Password: password
              };
              return firebase.database().ref("/users").child(change.Username).once("value").then(function (snapshot) {
                if (snapshot.exists()) {
                  var Password = snapshot.val();
                  if (Password["Password"] == change.Password) {
                    firebase.database().ref('Workspace').remove()
                    Swal.fire(
                      "",
                      "Delete successful",
                      "success"
                    );
                  } else {
                    Swal.fire(
                      "",
                      "Delete failed! Wrong password!",
                      "error"
                    );
                  }
                }
              });
            }
          });
        }
      });
    }
  });
};
// "----------------------------------------------Weekly datas-------------------------------------------------------"

// "----------------------------------------------All datas----------------------------------------------------------"

function SelectAllData1() {
  firebase.database().ref('UserID').on('value', function (AllRecords) {
    deleteAllRows1();
    AllRecords.forEach(function (CurentRecord) {
      var UserID = CurentRecord.key;
      var Name = CurentRecord.child("Name").val();
      var WeekDayObj = CurentRecord.child("WeekDay").val();
      var MonObj = WeekDayObj.Mon;
      var Mon = MonObj.Status;
      var TueObj = WeekDayObj.Tue;
      var Tue = TueObj.Status;
      var WedObj = WeekDayObj.Wed;
      var Wed = WedObj.Status;
      var ThuObj = WeekDayObj.Thu;
      var Thu = ThuObj.Status;
      var FriObj = WeekDayObj.Fri;
      var Fri = FriObj.Status;
      var SatObj = WeekDayObj.Sat;
      var Sat = SatObj.Status;
      var SunObj = WeekDayObj.Sun;
      var Sun = SunObj.Status;
      AddItemsToTable1(UserID, Name, Mon, Tue, Wed, Thu, Fri, Sat, Sun);
    });
  });
}

function AddItemsToTable1(UserID, Name, Mon, Tue, Wed, Thu, Fri, Sat, Sun) {
  var tbody = document.getElementById('tbody1');
  var trow = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var td5 = document.createElement('td');
  var td6 = document.createElement('td');
  var td7 = document.createElement('td');
  var td8 = document.createElement('td');
  var td9 = document.createElement('td');
  var td10 = document.createElement('td');
  var td11 = document.createElement('td');
  td10.style.backgroundColor = "red"
  td10.style.color = "#fafafa"
  td10.style.cursor = "pointer"
  td11.style.backgroundColor = "inherit"
  td11.style.color = "#inherit"
  td11.style.cursor = "pointer"
  td10.onmouseenter = function () {
    td10.style.backgroundColor = "green"
  }
  td10.onmouseleave = function () {
    td10.style.backgroundColor = "red"
  }
  td11.onmouseenter = function () {
    td11.style.backgroundColor = "#3A4F50"
  }
  td11.onmouseleave = function () {
    td11.style.backgroundColor = "inherit"
  }
  td1.innerHTML = UserID;
  td2.innerHTML = Name;
  td3.innerHTML = Mon;
  td4.innerHTML = Tue;
  td5.innerHTML = Wed;
  td6.innerHTML = Thu;
  td7.innerHTML = Fri;
  td8.innerHTML = Sat;
  td9.innerHTML = Sun;
  td10.innerHTML = "Delete";
  td11.innerHTML = "Detail";
  if (Mon == "Late") {
    td3.style.backgroundColor = "Yellow";
    td3.style.color = "#1B2223"
  }
  if (Tue == "Late") {
    td4.style.backgroundColor = "Yellow";
    td4.style.color = "#1B2223"
  }
  if (Wed == "Late") {
    td5.style.backgroundColor = "Yellow";
    td5.style.color = "#1B2223"
  }
  if (Thu == "Late") {
    td6.style.backgroundColor = "Yellow";
    td6.style.color = "#1B2223"
  }
  if (Fri == "Late") {
    td7.style.backgroundColor = "Yellow";
    td7.style.color = "#1B2223"
  }
  if (Sat == "Late") {
    td8.style.backgroundColor = "Yellow";
    td8.style.color = "#1B2223"
  }
  if (Sun == "Late") {
    td9.style.backgroundColor = "Yellow";
    td9.style.color = "#1B2223"
  }
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);
  trow.appendChild(td6);
  trow.appendChild(td7);
  trow.appendChild(td8);
  trow.appendChild(td9);
  trow.appendChild(td10);
  trow.appendChild(td11);
  tbody.appendChild(trow);

  td10.onclick = function () {
    var row = this.parentNode;
    var tableBody = row.parentNode;
    var id = row.cells[0].innerHTML;
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Please enter password!',
          input: 'password',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Submit',
          showLoaderOnConfirm: true,
          preConfirm: (password) => {
            return firebase.database().ref("/Login").once("value").then(function (snapshot) {
              if (snapshot.exists()) {
                var Webmode = snapshot.val();
                const change = {
                  Username: Webmode["User"],
                  Password: password
                };
                return firebase.database().ref("/users").child(change.Username).once("value").then(function (snapshot) {
                  if (snapshot.exists()) {
                    var Password = snapshot.val();
                    if (Password["Password"] == change.Password) {
                      firebase.database().ref("UserID").child(id).remove();
                      Swal.fire(
                        "",
                        "Delete successful",
                        "success"
                      );
                    } else {
                      Swal.fire(
                        "",
                        "Delete failed! Wrong password!",
                        "error"
                      );
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  }
}

function deleteAllRows1() {
  var tbody = document.getElementById('tbody1');
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
}

deletedatabtn.onclick = function () {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Please enter password!',
        input: 'password',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
          return firebase.database().ref("/Login").once("value").then(function (snapshot) {
            if (snapshot.exists()) {
              var Webmode = snapshot.val();
              const change = {
                Username: Webmode["User"],
                Password: password
              };
              return firebase.database().ref("/users").child(change.Username).once("value").then(function (snapshot) {
                if (snapshot.exists()) {
                  var Password = snapshot.val();
                  if (Password["Password"] == change.Password) {
                    firebase.database().ref('UserID').remove()
                    Swal.fire(
                      "",
                      "Delete successful",
                      "success"
                    );
                  } else {
                    Swal.fire(
                      "",
                      "Delete failed! Wrong password!",
                      "error"
                    );
                  }
                }
              });
            }
          });
        }
      });
    }
  });
};

window.onload = function () {
  SelectAllData();
  SelectAllData1()
}

Allbtn.onclick = function () {
  for (var i = 0; i < Week.length; i++) {
    Week[i].style.display = "none";
  }
  for (var i = 0; i < All.length; i++) {
    All[i].style.display = "block";
  }
  Allbtn.style.backgroundColor = "#3A4F50";
  Allbtn.style.color = "#0EF6CC";
  Weekbtn.style.backgroundColor = "#fafafa";
  Weekbtn.style.color = "black";
}

Weekbtn.onclick = function () {
  for (var i = 0; i < All.length; i++) {
    All[i].style.display = "none";
  }
  for (var i = 0; i < Week.length; i++) {
    Week[i].style.display = "block";
  }
  Weekbtn.style.backgroundColor = "#3A4F50";
  Weekbtn.style.color = "#0EF6CC";
  Allbtn.style.backgroundColor = "#fafafa";
  Allbtn.style.color = "black";
}