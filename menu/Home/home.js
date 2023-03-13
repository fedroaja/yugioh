

const load_bg_list = [
  '/assets/loader_1.png',
  '/assets/loader_2.jpg',
  '/assets/loader_3.jpg',
  '/assets/loader_4.jpg'
];

const divContainer = document.createElement('div');
const divLoader = document.createElement('div');
const divPBar = document.createElement('div');
const spanBar = document.createElement('span');
const spanProg = document.createElement('span');
const sideBar = document.getElementById('mySideBar');
const Contentcontainer = document.getElementById('Contentcontainer');
const cardArea = document.getElementById('cardContent');

let myModal = new bootstrap.Modal(document.getElementById('cardModal'))

let main_API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?num=20&offset=0';
let fgLoad = false;
let searchFlag = '';

fetchCard();

document.onreadystatechange = function () {
  Contentcontainer.style.visibility = sessionStorage.getItem("thefirst") == '1' ? 'hidden':'visible';
  document.body.style.overflow = 'hidden';
  randomBg();
  // page fully load
  if (document.readyState == "complete" && sessionStorage.getItem("thefirst") == '1') {
      // hide loader after 2 seconds
      divContainer.id = 'container';
      divLoader.id = 'loader';
      divPBar.className = 'progress-bar';
      spanBar.className = 'bar';
      spanProg.className = 'progress'


      spanBar.appendChild(spanProg);
      divPBar.appendChild(spanBar);
      divContainer.appendChild(divPBar);
      divContainer.appendChild(divLoader);
      document.body.appendChild(divContainer);

      setTimeout(function(){ 
          divLoader.style.animationName = 'loader-animation-out';
      
          divLoader.addEventListener("animationend", (ev) => {
              if(ev.type === "animationend")
                  divContainer.style.display = 'none';
                  divContainer.remove();
                  setTimeout(() => {
                      Contentcontainer.style.visibility = 'visible';
                      sideBar.classList.add('sidebarAnimate');
                      document.body.style.overflow = 'auto';
                  }, 1000);
          }, false);


      }, 5500);

      sessionStorage.setItem("thefirst", "0");
  }else{
    document.body.style.overflow = 'auto';
  }
  
  
}

function randomBg(){
  let randImg=Math.floor((Math.random() * (load_bg_list).length));
  let url_p="url(\"" + load_bg_list[randImg] + "\")";
  divLoader.style.backgroundImage = url_p;
}

window.onscroll = function (ev) {
  let scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
  );
  let currentScrollHeight = window.innerHeight + window.scrollY;

  if ((scrollHeight - currentScrollHeight) < 200) {
     if (fgLoad)
     {
      fetchCard()
      fgLoad = false;
     }
  }
};

async function fetchCard(parameter){
let api_Main = main_API_URL;

if(parameter) api_Main = main_API_URL + parameter

fetch(api_Main)
.then(res => res.json())
.then(data => {
    main_API_URL = data.meta.next_page;
    renderCard(data.data)
}).catch(err=>console.error(err));
}

function renderCard(data){

  data.forEach(x => {
      let flipCard = document.createElement('div');
      let flipCardInner = document.createElement('div');
      let flipCardFront = document.createElement('div');
      let frontImg = document.createElement('img');
      let flipCardBack = document.createElement('div');
      let backImg = document.createElement('img');
      
      flipCard.id = 'cardBtn';
      
      flipCard.onclick = function(){
        document.getElementById('cardModalName').innerHTML = x.name;
        document.getElementById('modalCardImg').src = x.card_images[0].image_url

        document.getElementById('cardAttack').innerHTML = '&nbsp; ' + (x.atk ? x.atk : 0);
        document.getElementById('cardDef').innerHTML = '&nbsp; ' + (x.def ? x.def : 0);
        document.getElementById('cardType').innerHTML = '&nbsp; ' + (x.type ? x.type : '-');
        document.getElementById('cardAttribute').innerHTML = '&nbsp; ' + (x.attribute ? x.attribute : '-');
        document.getElementById('cardRace').innerHTML = '&nbsp;&nbsp; ' + (x.race ? x.race : '-');
        document.getElementById('cardArc').innerHTML = '&nbsp;&nbsp; ' + (x.archetype ? x.archetype : '-');
        document.getElementById('cardDesc').innerHTML = (x.desc ? x.desc : '-');

        myModal.show()
      };
      flipCard.classList.add('flip-card');
      flipCard.title = 'Click, to See Detail';
      
      flipCardInner.classList.add('flip-card-inner');

      flipCardFront.classList.add('flip-card-front');
      frontImg.classList.add('cardImg');
      frontImg.alt = 'CARD';
      frontImg.loading = 'lazy';
      frontImg.src = x.card_images[0].image_url;

      flipCardBack.classList.add('flip-card-back');
      backImg.classList.add('cardImg');
      backImg.alt = 'CARD';
      backImg.loading = 'lazy';
      backImg.src = '/assets/card_back.jpg';

      flipCardFront.appendChild(frontImg);
      flipCardBack.appendChild(backImg);

      flipCardInner.appendChild(flipCardFront);
      flipCardInner.appendChild(flipCardBack);

      flipCard.appendChild(flipCardInner);
      cardArea.appendChild(flipCard);
  });

  cardAnimation();
  fgLoad = true;
}

function cardAnimation(){
  document.querySelectorAll(".flip-card").forEach(elem => {
    elem.addEventListener('mouseover', function(e) {
      e.stopPropagation();
      this.classList.add('flip-card-hover');
      document.querySelectorAll(".flip-card:not(.flip-card-hover)").forEach(elem2 =>{
        elem2.classList.add('flip-card-not-hover')
      });
    });
    
    elem.addEventListener('mouseout', function(e) {
      this.classList.remove('flip-card-hover');
      document.querySelectorAll(".flip-card-not-hover").forEach(elem2 =>{
        elem2.classList.remove('flip-card-not-hover');
      });
    });
  });
}

function searchAction(){
  
  cardArea.innerHTML = '';
    let searchCard = document.getElementById('searchBox').value;
    if (searchFlag != searchCard || !searchCard) main_API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?num=20&offset=0';
    fetchCard(searchCard ? '&fname=' + searchCard : '');
}

document.getElementById('searchBox').addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    searchAction()
  }
});

