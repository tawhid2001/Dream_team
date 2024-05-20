const getVal = () => {
  const inputVal = document.getElementById("input-val").value;
  searchPlayer(inputVal);
};

const searchPlayer = (inputVal = "s") => {
  fetch(
    `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${inputVal}`
  )
    .then((res) => res.json())
    .then((data) => displaySearchedPlayer(data));
};

const displaySearchedPlayer = (players) => {
  const mainCon = document.getElementById("main-con");

  if (mainCon.hasChildNodes()) {
    while (mainCon.firstChild) {
      mainCon.removeChild(mainCon.firstChild);
    }
  }

  players.player.forEach((element) => {
    if (element.strThumb != null && element.strDescriptionEN != null) {
      const div = document.createElement("div");
      const facebookLink = element.strFacebook
        ? `https://${element.strFacebook}`
        : "";
      const instagramLink = element.strInstagram
        ? `https://${element.strInstagram}`
        : "";

      div.innerHTML = `
        <div class="card" style="width: 18rem;">
        <img src="${element.strThumb}" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">${element.strPlayer}</h5>
        <p class="card-text">${element.strDescriptionEN.slice(0, 50)}</p>
        <a href="#" class="btn btn-outline-success handleAdd" onclick = "handleAdd(this,'${
          element.strPlayer
        }','${element.idPlayer}')">Add To Group</a>
        <a href="#" class="btn btn-cus" onclick = "details('${
          element.idPlayer
        }')">Details</a>
        <div class="icon-con">${
          facebookLink
            ? `<a href="${facebookLink}" target="_blank"><i class="fa-brands fa-facebook"></i></a>`
            : "NULL"
        }${
        instagramLink
          ? `<a href="${instagramLink}" target="_blank"><i class="fa-brands fa-instagram"></i></a>`
          : "NULL"
      }
        </div>
        </div>
        </div>
         `;
      mainCon.appendChild(div);
    }
  });
};

let ides = [];
const handleAdd = (button, name, id) => {
  const count = document.getElementById("count").innerText;

  let convertedCount = parseInt(count);

  let flag = 0;
  ides.forEach((element) => {
    if (id == element) {
      flag = 1;
    }
  });
  if (flag == 0) {
    if (convertedCount < 11) {
      convertedCount += 1;
      document.getElementById("count").innerText = convertedCount;
      ides.push(id);
      const cartCon = document.getElementById("cart-con");
      const div = document.createElement("div");

      div.innerHTML = `
      <p>Name: ${name}</p>
      `;
      cartCon.appendChild(div);
      button.innerText = "Added";
    } else {
      const div = document.createElement("div");
      div.innerHTML = `
      <h3>Can not ADD more than 11 players</h3>
      `;
      document.getElementById("cart-con").appendChild(div);
    }
  } else {
    button.innerText = "Already Added";
  }
};

const details = (id) => {
  fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
    .then((res) => res.json())
    .then((data) => modalDisplay(data));
};

const modalDisplay = (data) => {
  let player = data.players[0];
  let id = player.idPlayer;
  let name = player.strPlayer;
  let natinality = player.strNationality;
  let sport = player.strSport;
  let team = player.strTeam;

  // console.log(id);
  const modalCon = document.createElement("div");
  modalCon.innerHTML = `
    <div class="modal fade" id="playerModal" tabindex="-1" aria-labelledby="playerModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="playerModal">Player Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><b>Product ID:</b> ${id}</p>
            <p><b>Product Name:</b> ${name}</p>
            <p><b>Product Nationality:</b> ${natinality}</p>
            <p><b>Product Sport:</b> ${sport}</p>
            <p><b>Product Team:</b> ${team}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn closebtn" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const existingModal = document.getElementById("playerModal");
  if (existingModal) {
    existingModal.parentNode.removeChild(existingModal);
  }

  document.body.appendChild(modalCon);

  const modal = new bootstrap.Modal(document.getElementById("playerModal"));
  modal.show();
};

searchPlayer();
