let titleLogo = document.querySelector(".title");
let bodyElem = document.querySelector("body");
let lat;
let long;


window.addEventListener("load", () => {
	let randNum = Math.ceil(Math.random() * 10);
	bodyElem.style.backgroundImage = `url('images/bg${randNum}.jpg')`;
	if (randNum == 1 ||randNum == 3 || randNum == 5 || randNum == 7 || randNum == 8 ) {
		titleLogo.style.color = "white";
	}
});

let citySearch = document.querySelector("#get-city")
let btnCitySearch = document.querySelector("#btn-get-city")

citySearch.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
      obtenerCoordenadas();
      obtenerClima();
  }   
  });

  btnCitySearch.addEventListener("click", (event) => {
      obtenerCoordenadas();
      obtenerClima();
  });

citySearch.value = "Caracas";
obtenerCoordenadas()
citySearch.value = "";

function obtenerCoordenadas() {
  const city = citySearch.value;
  const url = `https://nominatim.openstreetmap.org/search?q=${city}&format=json`;
  let coordenate = document.querySelector(".coordenate")
  let cityName = document.querySelector(".city-name")
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data && data.length > 0) {
        lat = data[0].lat;
        long = data[0].lon;
        let country = data[0].display_name;
        
        country = country.split(" ")
        country = country[country.length -1]

        console.log(`Coordenadas de ${city}: Latitud ${lat}, Longitud ${long}, Pais ${country}`);
        cityName.textContent = `${city}, ${country}`;
        coordenate.textContent = `lat ${lat}, long ${long}`
        obtenerClima(lat, long)
      } else {
        console.log(`No se encontraron coordenadas para ${city}`);
      }
    })
    .catch(error => console.error('Error:', error));
  

    citySearch.value = "";
  }


function obtenerClima (lat, long) { 
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min&current=temperature_2m,is_day,precipitation`;
  let elementDegree = document.querySelector(".weather-deg")
  let elementDayNight = document.querySelector(".day-night")
  let elementCurrentDate = document.querySelector(".date-info")


  fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(url)
        const currentDegree = data.current.temperature_2m; // Temperatura actual ejemplo: 3, falta agregar manualmente simbolo de grados
        const dayNight = data.current.is_day; // Temperatura actual ejemplo: 13, falta agregar manualmente simbolo de grados 
        const currentDay = data.current.time;

        const minDegree = data.daily.temperature_2m_min; 
        const maxDegree = data.daily.temperature_2m_max; 
        const precipitation = data.daily.precipitation_probability_max; //
        const days = data.daily.time;
        const dailyInfo = document.querySelector('.daily-info');



        elementDegree.textContent = `${currentDegree} °`;
        elementCurrentDate.textContent = currentDay;


        if( dayNight == 1 ) {
          elementDayNight.textContent = "🌞";
        } else {
          elementDayNight.textContent = "🌜";
        }

        clearElements()


        for (let i = 0; i < days.length; i ++) {
            let tr = document.createElement("tr");

            let dailyDate = document.createElement("td"); 
            dailyDate.textContent = `${days[i]}:   `;
            tr.appendChild(dailyDate);
            dailyDate.classList.add("daily-date")

            let dailyMinDegree = document.createElement("td");
            dailyMinDegree.textContent = `${minDegree[i]} C° -`;
            tr.appendChild(dailyMinDegree);
            dailyMinDegree.classList.add("daily-min-degree")

            let dailyMaxDegree = document.createElement("td");
            dailyMaxDegree.textContent = ` ${maxDegree[i]} C° `;
            tr.appendChild(dailyMaxDegree);
            dailyMaxDegree.classList.add("daily-max-degree")

            let dailyPrecipitation = document.createElement("td");
            dailyPrecipitation.textContent = `Probabilidad de lluvia: ${precipitation[i]}%`;
            tr.appendChild(dailyPrecipitation);
            dailyPrecipitation.classList.add("daily-precipitation")
            
            dailyInfo.appendChild(tr);
          }

        })
        .catch(error => console.error('Error:', error));

}

function clearElements () {
  let tabla = document.getElementById("tabla");
  tabla.innerHTML = "";
}
