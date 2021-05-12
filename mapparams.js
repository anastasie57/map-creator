ymaps.ready(init);
var myMap;

function init () {
    let typeOfMap = document.querySelector(".typeOfMap");
    let setUpZoom = document.querySelector(".setUpZoom");
    let pixels = document.querySelector(".pixels");
    let ruler = document.querySelector(".rulerControl");
    let zoom = document.querySelector(".zoomControl");
    let layers = document.querySelector(".layersControl");
    let dragEnable = document.querySelector(".dragEnable");
    let zoomEnable = document.querySelector(".zoomEnable");
    let mapType = 'yandex#map';

    myMap = new ymaps.Map("map", {
        center: [55.7565, 37.6143], // Москва
        zoom: 11,
        type: mapType,
        "controls": [],
        "behaviors":[]
    }, {
        balloonMaxWidth: 100,
        searchControlProvider: 'yandex#search',"suppressMapOpenBlock": true
            });

    typeOfMap.onchange = function () {
        mapType = "yandex#" + typeOfMap.value;
        console.log(mapType);
        myMap.setType(mapType);
    };

    setUpZoom.oninput = function () {
        pixels.textContent = setUpZoom.value;
        console.log(setUpZoom.value);
        myMap.setZoom(setUpZoom.value);
    };

    ruler.onchange = function () {
        console.log(ruler.value);
        if (ruler.checked) {myMap.controls.add('rulerControl');}
        else {myMap.controls.remove('rulerControl');}
    };

    zoom.onchange = function () {
        console.log(zoom.value);
        if (zoom.checked) {myMap.controls.add('zoomControl');}
        else {myMap.controls.remove('zoomControl');}
    };

    layers.onchange = function () {
        console.log(layers.value);
        if (layers.checked) {myMap.controls.add('typeSelector');}
        else {myMap.controls.remove('typeSelector');}
    };

    dragEnable.onchange = function () {
        console.log(dragEnable.value);
        if (dragEnable.checked) {myMap.behaviors.enable('drag');;}
        else {myMap.behaviors.disable('drag');;}
    };

    zoomEnable.onchange = function () {
        console.log(zoomEnable.value);
        if (zoomEnable.checked) {myMap.behaviors.enable('scrollZoom', 'dblClickZoom', 'multiTouch');;}
        else {myMap.behaviors.disable('scrollZoom', 'dblClickZoom', 'multiTouch');;}
    };

    // Обработка события, возникающего при щелчке
    // левой кнопкой мыши в любой точке карты.
    // При возникновении такого события откроем балун.
    myMap.events.add('click', function (e) {
        if (!myMap.balloon.isOpen()) {
            var coords = e.get('coords');
            myMap.panTo(coords);

            myMap.balloon.open(coords, {
                contentBody:'<p>Координаты центра: ' + [
                    coords[0].toPrecision(6),
                    coords[1].toPrecision(6)
                    ].join(', ') + '</p>',
                contentFooter:'<sup>Щелкните еще раз</sup>'
            });
        }
        else {
            myMap.balloon.close();
        }
    });

    // Обработка события, возникающего при щелчке
    // правой кнопки мыши в любой точке карты.
    // При возникновении такого события покажем всплывающую подсказку
    // в точке щелчка.
    myMap.events.add('contextmenu', function (e) {
        myMap.hint.open(e.get('coords'), 'Кто-то щелкнул правой кнопкой');
    });
    
    // Скрываем хинт при открытии балуна.
    myMap.events.add('balloonopen', function (e) {
        myMap.hint.close();
    });
}

let button = document.querySelector(".createJson")

button.addEventListener(
  "click",
  (ev) => {
    ev.preventDefault();

    const inputs = document.querySelectorAll("input");

    const arr = [];
    for (let i = 0; i < inputs.length; i++) {
      arr.push([inputs[i].value, inputs[i++].value]);
    }

    console.log(arr);

    const data = Object.fromEntries(arr);

    console.log(data);

    const file = new Blob([JSON.stringify(data)], {
      type: "application/json"
    });

    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(file));
    link.setAttribute("download", "data.json");
    link.textContent = "DOWNLOAD DATA";
    document.querySelector(".main").append(link);
    URL.revokeObjectURL(file);
  },
  { once: true }
);
