var buttons = [];
var slides = [];
var currentSlide = null;
var answers = new Map();
var controls = [];
var questions = [];
let feed = new Map();
feed.set('Alto', 'ALTO: refleja una persona que pone en marcha su capacidad resiliente a través de la búsqueda de soluciones para superar la situación estresante. Ante las adversidades consiguen resistir, adaptarse y salir bien librados. Cada adversidad puede ser vista como un desafío en el cual se pone en práctica la capacidad de afronte, de superación y adaptación positiva a la experiencia.');
feed.set('Moderado', 'MODERADO: Sugiere la presencia de recursos psicológicos positivos que posiblemente permitirán que logres afrontar las adversidades de manera funcional que te posibiliten desarrollarte de manera adecuada en diversos ámbitos. Aun cuando puede haber distractores, te enfocas en resolver las dificultades, analizando cómo manejarte frente al estresor y procurando organizar estrategias de acción.');
feed.set('Sugestivo', 'SUGESTIVO: Las personas con este nivel de resiliencia y afrontamiento suelen llevar a cabo ante los problemas y las dificultades, estrategias no adaptativas las cuales quizá reducen el estrés a corto plazo, pero pueden dañar la salud a largo plazo.');
feed.set('Bajo', 'BAJO: Las personas con este nivel de afrontamiento, ante la presencia de algún problema o dificultad suelen ignorarlos. Son comunes las reacciones emocionales como auto inculparse, preocuparse, reservarlo a sí mismo sin compartir con los demás lo que están viviendo, situación que puede generar mayor angustia y malestar emocional. Sueles ver las adversidades como crisis sin darte la oportunidad de aprender de ellas.');
feed.set('Nulo', 'NULO: Como resultado de esto puedes presentar dificultades en diversos ámbitos de tu vida como el personal, laboral, familiar, social, etc. En este nivel de afrontamiento es común que se presenten aspectos como el sentimiento de culpa, el aislamiento social o acciones que no están focalizadas en la resolución del problema (negación, distanciamiento).');

buttons = Array.from(document.getElementsByClassName('button'));
slides = Array.from(document.getElementsByClassName('slides')[0].childNodes);
controls = Array.from(document.getElementsByClassName('controls')[0].childNodes);
questions = Array.from(slides.slice(2, 33).map((e) => (e.getAttribute('data-id'))));

controls.forEach((control) => {
    if (control.nodeName == 'BUTTON' && (control.classList.contains('navigate-right'))) {
        control.addEventListener('click', slideHandler)
    }
})


buttons.forEach((button) => {
    button.addEventListener('mouseover', Hover);
    button.addEventListener('mouseleave', Leave);

    if (button.classList.contains('ra')) {
        button.addEventListener('click', () => {
            currentSlide = document.getElementsByClassName('present')[0];
            selectOption(currentSlide, button, 0);
        })
    }

    if (button.classList.contains('rb')) {
        button.addEventListener('click', () => {
            currentSlide = document.getElementsByClassName('present')[0];
            selectOption(currentSlide, button, 1);
        })
    }

    if (button.classList.contains('rc')) {
        button.addEventListener('click', () => {
            currentSlide = document.getElementsByClassName('present')[0];
            selectOption(currentSlide, button, 2);
        })
    }

    if (button.classList.contains('rd')) {
        button.addEventListener('click', () => {
            currentSlide = document.getElementsByClassName('present')[0];
            selectOption(currentSlide, button, 3);
        })
    }
})

function selectOption (slide, button, value,) {
    console.log(slide)
    answers.set(slide.getAttribute('data-id'), value);
    removeClassFromChild(currentSlide, 'selected-btn');
    button.classList.add('selected-btn');
    fillButton(button, 'rgb(65, 92, 137)');
}

function removeClassFromChild (node, className) {
    node.childNodes.forEach((child) => {
        if (child.nodeName == 'DIV' && child.classList.contains(className)) {
            child.classList.remove(className);
        }
        if (child.nodeName == 'DIV' && child.classList.contains('button')) {
            console.log(child)
            fillButton(child, 'rgb(74, 134, 232)')
        }
    })
}

function fillButton (button, color) {
    let rectangle = button.childNodes[1]["childNodes"][1]["childNodes"][1]["childNodes"][0]["childNodes"][1];
    rectangle.style.fill = color;
}

function Hover (evt) { 
        fillButton(evt.currentTarget, 'rgb(65, 92, 137)');
}

function Leave(evt) { 
    if (!evt.currentTarget.classList.contains('selected-btn')) {
        fillButton(evt.currentTarget, 'rgb(74, 134, 232)'); 
    } else {
        fillButton(evt.currentTarget, 'rgb(65, 92, 137)');
    }
}

function slideHandler () {
    let future = document.getElementsByClassName('future')
    if ( future.length <= 2 ) {
        evaluation();
        document.getElementsByClassName('controls')[0].style.display = 'none';
    }
    loadAnswers();
}

function loadAnswers () {
    currentSlide = document.getElementsByClassName('present')[0];
    if (answers.has(currentSlide.getAttribute('data-id'))) {
        answers.get(currentSlide.getAttribute('data-id'));
    }
}



function evaluation () {
    let score = null;

    if (validateAnswers(questions, answers)) {
        score = 0;
        for (let [key, value] of answers) {
            score += value;
        }
        let feedback = getFeedBack(score);
        sendData(score, feedback);
        document.getElementById('feedback').innerHTML = '<p>' + feedback + '</p>';
    } else {
        alert("te faltan preguntas por contestar!")
    }
}

function validateAnswers (q, a) {
    res = true;
    q.forEach((idQuestion) => {
        if(!a.has(idQuestion)) {
            res = false;
        } 
    })

    return res;
}

function getFeedBack (score) {
    if (score > 90) {
        return feed.get('Alto');
    } else if (score > 73) {
        return feed.get('Moderado');
    } else if (score > 53){
        return feed.get('Sugestivo');
    } else if (score > 34) {
        return feed.get('Bajo');
    } else {
        return feed.get('Nulo');
    }
}

function sendData (score, feedback) {
    let jsonObj = {
        "curso": "UDC9190",
        "recurso": "A1",
        "calificacion": score,
        "retro": feedback,
        "url": "https://www.w3schools.com/html/html_attributes.asp",
        "usuario": "agentestic@ucol.mx"
      }

    console.log(JSON.stringify(jsonObj));
    let APIUrl = 'http://deveduc.ddns.net:88/api/cursos/alumnos/calificaciones';
    postData(APIUrl, jsonObj).then(result => console.log(result)).catch(error => console.log('error', error));
}

async function postData(url = '', data = {}) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Mzc5NjA0MTEsImV4cCI6MTY0MDU1MjQxMSwidXNlckRhdGEiOnsiaWQiOiIxIn19.ibbDwE-szOqq-eQTFy2V1XGQc723--vXzQiLNu5cta0");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "PHPSESSID=5768enb10orcmtimk223enmna4");
   // myHeaders.append("http-equiv", "Content-Security-Policy");
   // myHeaders.append("content", "upgrade-insecure-requests");


    var raw = JSON.stringify(data);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
    mode: 'cors'
    };

    let res = await fetch(url, requestOptions)
    return res.json();
     // parses JSON response into native JavaScript objects
  
}