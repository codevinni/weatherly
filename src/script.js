const input = document.getElementById("input")
let oldSearchs = []

function getKey(){
    return ""
}

function toCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(1);
}

function addToHistory(data) {

    const index = oldSearchs.findIndex(e => e.name === data.name);

    if (index !== -1)
        oldSearchs.splice(index, 1);

    oldSearchs.push(data);

    if (oldSearchs.length > 10)
        oldSearchs.shift();
}

function loadHistory() {

    const sidebarItems = document.getElementById("sidebar-items");
    sidebarItems.innerHTML = "";  

    for (const e of [...oldSearchs].reverse()) {
        
        const item = document.createElement('div');

        item.classList.add('sidebar-item');
        item.innerHTML = `
            <span>${e.name}</span>
            <img src="https://openweathermap.org/img/wn/${e.weather[0].icon}@2x.png" width="40" height="40" alt="${e.weather[0].description}">
        `;

        item.addEventListener('click', () => {
            weather(e.name);
        });

        sidebarItems.appendChild(item);
    }
}

function loadCards(data){

    if(!data){
        console.error("Dados inválidos recebidos:", data);
        return;
    }

    input.value = "";
    document.getElementById("tip").style.display = "none"
    document.getElementById("main-section").style.display = "block"

    addToHistory(data);
    loadHistory();

    const city = document.getElementById('city'),
          date = document.getElementById('date'),
          icon = document.getElementById('icon'),
          temp = document.getElementById('temp'),
          min = document.getElementById('min'),
          max = document.getElementById('max'),
          description = document.getElementById('description'),
          sunriseTime = document.getElementById('sunriseTime'),
          sunsetTime = document.getElementById('sunsetTime');

    city.textContent = data.name.toUpperCase();

    const today = new Date();
    const day = today.toLocaleDateString('en-US', { weekday: 'long' }),
          month = today.toLocaleDateString('en-US', { month: 'long' });

    date.textContent = `${day.toUpperCase()}  -  ${today.getDay()} ${month.toUpperCase()}`;
    icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" width="200" height="200" alt="${data.weather[0].description}">`;
    //icon.innerHTML = `<i style="font-size: 60px;" class="wi wi-owm-${data.weather[0].id}"></i>`;

    temp.textContent = `${toCelsius(data.main.temp)} °C`;
    min.textContent = `${toCelsius(data.main.temp_min)} °C`;
    max.textContent = `${toCelsius(data.main.temp_max)} °C`;
    description.textContent = `There is ${data.weather[0].description}`;

    const sunrise = new Date(data.sys.sunrise * 1000);
    sunriseTime.textContent = sunrise.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const sunset = new Date(data.sys.sunset * 1000);
    sunsetTime.textContent = sunset.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    let main = document.getElementById("main-content");
    let sidebar = document.getElementById("sidebar");
    let bgColor = "linear-gradient(-135deg, #9a1fd3, #2E006C)";
    let sidebarColor = "#260149";

    let tempValue = parseFloat(toCelsius(data.main.temp));
    if (tempValue < 15){
        sidebarColor = "#001F3F"
        bgColor = "linear-gradient(-135deg, #7FDBFF, #045eadff)"
    }
    else
        if(tempValue > 25){
            bgColor = "linear-gradient(135deg, #FF851B, #FF4136)"
            sidebarColor = "#a74b00ff"
        }

    main.style.background = bgColor;
    sidebar.style.background = sidebarColor;
}

function animateMainCards() {

    const mainCards = document.querySelectorAll(".weather-card, .bottom-card");

    mainCards.forEach(card => {
        // Remove e readiciona classes para reiniciar a animação
        card.classList.remove("animate__animated", "animate__bounceIn");
        void card.offsetWidth;
        card.classList.add("animate__animated", "animate__bounceIn");
        card.style.setProperty("--animate-duration", "0.5s");
    });
}

async function requestWeather(city){

    const key = getKey()
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
        
    try {
        var res = await fetch(url)

        if(!res.ok)
            throw new Error(`Erro HTTP: ${resposta.status}`);
        console.log(res)
        return res.json()

    } catch (error) {
        console.error('Erro ao buscar cidade:', error.message);
        return null
    }
}

async function weather(city){

    data = await requestWeather(city);
    
    if(data){
        animateMainCards();
        loadCards(data);
    }
}

input.onkeydown = async (e) => {

    if(e.key === "Enter")
        weather(input.value);
}