ymaps.ready(init);
var myMap;

let centerCoords = [55.7565, 37.6143];
let zoomValue = 10;
let mapTypeValue = 'yandex#map';
let controlsValue = [];
let behaviors = [];

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
        zoom: 10,
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

        mapTypeValue = mapType;
    };

    setUpZoom.oninput = function () {
        pixels.textContent = setUpZoom.value;
        console.log(setUpZoom.value);
        myMap.setZoom(setUpZoom.value);

        zoomValue = setUpZoom.value;
    };

    ruler.onchange = function () {
        console.log(ruler.value);
        if (ruler.checked) {myMap.controls.add('rulerControl', controlsValue.push('\"rulerControl\"'));}
        else {myMap.controls.remove('rulerControl'), controlsValue = controlsValue.filter(val => val !== '\"rulerControl\"');;}
    };

    zoom.onchange = function () {
        console.log(zoom.value);
        if (zoom.checked) {myMap.controls.add('zoomControl'), controlsValue.push('\"zoomControl\"');}
        else {myMap.controls.remove('zoomControl'), controlsValue = controlsValue.filter(val => val !== '\"zoomControl\"');}
    };

    layers.onchange = function () {
        console.log(layers.value);
        if (layers.checked) {myMap.controls.add('typeSelector'), controlsValue.push('\"typeSelector\"');}
        else {myMap.controls.remove('typeSelector'), controlsValue = controlsValue.filter(val => val !== '\"typeSelector\"');}
    };

    dragEnable.onchange = function () {
        console.log(dragEnable.value);
        if (dragEnable.checked) {myMap.behaviors.enable('drag'), behaviors.push('\"drag\"');;}
        else {myMap.behaviors.disable('drag'), behaviors = behaviors.filter(val => val !== '\"drag\"');}
    };

    zoomEnable.onchange = function () {
        console.log(zoomEnable.value);
        if (zoomEnable.checked) {myMap.behaviors.enable('scrollZoom', 'dblClickZoom', 'multiTouch'), behaviors.push('\"scrollZoom\"', '\"dblClickZoom\"', '\"multiTouch\"');}
        else {myMap.behaviors.disable('scrollZoom', 'dblClickZoom', 'multiTouch'), behaviors = behaviors.filter(val => val !== '\"scrollZoom\"'), behaviors = behaviors.filter(val => val !== '\"dblClickZoom\"'), behaviors = behaviors.filter(val => val !== '\"multiTouch\"');}
    };

    // Обработка события, возникающего при щелчке
    // левой кнопкой мыши в любой точке карты.
    // При возникновении такого события откроем балун.
    myMap.events.add('click', function (e) {
        if (!myMap.balloon.isOpen()) {
            var coords = e.get('coords');
            myMap.panTo(coords);

            centerCoords = coords;

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

let button = document.querySelector(".createJson");

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

    const template = `{"mapSettings": {
        "state": {
            "center": [${centerCoords}],
            "zoom": ${zoomValue},
            "type": "${mapTypeValue}",
            "controls": [${controlsValue}],
            "behaviors": [${behaviors}]
        },
        "options": {
            "suppressMapOpenBlock": true
        },
        "hideLabels": false,
        "size": "auto"
    }
    }`

    console.log(template);

    const file = new Blob([template], {type:"application/json;charset=utf-8;"});

    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(file));
    link.setAttribute("download", "data.json");
    link.textContent = "Скачать json-разметку";
    document.querySelector(".main").append(link);
    //URL.revokeObjectURL(file);
  },
  { once: true }
);
