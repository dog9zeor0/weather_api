
var myurl = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-1A87DA01-E96E-4D3D-A469-1D428A7B5585&format=JSON';

var objAryAll = [];
var mapAry = [12, 1, 11, 5, 4, 2, 13, 16, 6, 10, 17, 7, 18, 3, 8, 14, 20, 15, 0, 19, 9, 21];
var containerSel = document.querySelector('.container');
var curTimeSeg = 0;
var curArea = 0;

fetchData(myurl);

function fetchData(inUrl){
    fetch(inUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);

            // Store Data (include 3 time segement) and Arrange
            for(var i = 0; i < 3; i++){
                objAryAll.push(storeData(myJson, i));
            }
            console.log(objAryAll);

            // Create Time Seg Btn Text
            genTimeSegTxt(objAryAll);

            // Add Structure
            createCards(objAryAll, curArea, curTimeSeg);

        });
}
function storeData(myData, timeSeg){
    var data = myData.records.location;

    var objTmpAry = [];

    // Push Data into objTmpAry
    for( var i = 0; i < data.length; i++){
        // Create Obj
        var objInfo = {
            city: data[i].locationName,
            sky: data[i].weatherElement[0].time[timeSeg].parameter.parameterName,
            skyVal: data[i].weatherElement[0].time[timeSeg].parameter.parameterValue,
            rain: data[i].weatherElement[1].time[timeSeg].parameter.parameterName,
            minT: data[i].weatherElement[2].time[timeSeg].parameter.parameterName,
            feel: data[i].weatherElement[3].time[timeSeg].parameter.parameterName,
            maxT: data[i].weatherElement[4].time[timeSeg].parameter.parameterName,
            stTime: data[i].weatherElement[0].time[timeSeg].startTime,
            edTime: data[i].weatherElement[0].time[timeSeg].endTime,
        }
        objTmpAry.push(objInfo);
    }

    // Change Position
    var okAry = changePos(objTmpAry, mapAry);

    return okAry;
}
function changePos(orginalAry, indexAry){
    var newAry = [];
    orginalAry.forEach(function(n, i){
        newAry[indexAry[i]] = n;
    });
    return newAry;
}

function genTimeSegTxt(myAry){
    for(var i = 0; i < 3; i++){
        var timeRangeSel = document.querySelector(`.timeRange>ul>li:nth-child(${i+1})`);

        timeRangeSel.innerHTML = 
            `
            <div>${myAry[i][0].stTime.substr(0, 16).replaceAll('-', "/")}</div>
            <div>|</div>
            <div>${myAry[i][0].edTime.substr(0, 16).replaceAll('-', "/")}</div>
            `
        ;
    }
}

function createCards(inAry, area, tseg){
    containerSel.innerHTML = '';
    
    var aRange = getAreaRange(area);
    var outAry = [];
    for(var i = aRange[0]; i < aRange[1]; i++){
        outAry.push(inAry[tseg][i]);
    }
    outAry.forEach(function(n, i){

        containerSel.innerHTML += 
        `
        <div class="box">
            <div class="icon"></div>
            <h2 class="city">${outAry[i].city}</h2>
            <ul class="info">
                <li>${outAry[i].sky}</li>
                <li>氣溫：${outAry[i].minT}~${outAry[i].maxT} °C</li>
                <li>降雨機率：${outAry[i].rain} %</li>
                <li>${outAry[i].feel}</li>
            </ul>
        </div>
        `;

        // Change Img
        var iconAry = document.querySelectorAll('.icon');
        var strtmp = getIconStr(outAry[i].skyVal);
        iconAry[i].style.backgroundImage  = `url(${strtmp})`;
    });

    // Change Selected Btn Style
    changeBtnStyle();
}

function changeBtnStyle(){
    
    var btnArea = document.querySelector(`.area li:nth-child(${curArea + 1})`);
    btnArea.style.backgroundColor = 'rgb(255, 196, 0)';
    btnArea.style.color = 'black';
    btnArea.style.border  = '3px solid black';

    var btnOtherArea = document.querySelectorAll(`.area li:not(:nth-child(${curArea + 1}))`);
    btnOtherArea.forEach(function(n) {
        n.style.backgroundColor = 'rgb(255, 222, 111)';
        n.style.color = 'rgb(100, 100, 100)';
        n.style.border  = '2px solid grey';
    });

    var btnTime = document.querySelector(`.timeRange li:nth-child(${curTimeSeg + 1})`);
    btnTime.style.backgroundColor = '#ff9a3b';
    btnTime.style.color = 'black';
    btnTime.style.border  = '3px solid black';

    var btnOtherTime = document.querySelectorAll(`.timeRange li:not(:nth-child(${curTimeSeg + 1}))`);
    btnOtherTime.forEach(function(n) {
        n.style.backgroundColor = '#FFC288';
        n.style.color = 'rgb(100, 100, 100)';
        n.style.border  = '2px solid grey';
    });

}

function getIconStr(val){
    val = Number(val);
    var str;
    if(val <= 1){
        str = 'img/sun.png';
    }else if(val <= 3){
        str = 'img/sun_cloud.png';
    }else if(val <= 4){
        str = 'img/cloud.png';
    }else if(val <= 7){
        str = 'img/cloudy.png';
    }else if(val <= 10){
        str = 'img/rain_small.png';
    }else if(val <= 14){
        str = 'img/rain.png';
    }else if(val <= 18){
        str = 'img/thunder_rain.png';
    }else if(val <= 20){
        str = 'img/sun_cloud_rain.png';
    }else if(val <= 22){
        str = 'img/sun_thunder_rain.png';
    }else if(val <= 23){
        str = 'img/snow.png';
    }else if(val <= 28){
        str = 'img/fog.png';
    }else if(val <= 30){
        str = 'img/rain_small.png';
    }else if(val <= 32){
        str = 'img/fog_rain.png';
    }else if(val <= 34){
        str = 'img/thunder_rain.png';
    }else if(val <= 36){
        str = 'img/fog_thunder_rain.png';
    }else if(val <= 37){
        str = 'img/fog_snow.png';
    }else if(val <= 39){
        str = 'img/fog_rain.png';
    }else if(val <= 41){
        str = 'img/fog_thunder_rain.png';
    }else if(val <= 42){
        str = 'img/snow_big.png';
    }else{
        str = 'img/cold.png';
    }

    return str;
}

// ---------- Btn Click Func ---------- //

function showAll(){
    curArea = 0;
    createCards(objAryAll, curArea, curTimeSeg);
}
function showNorth(){
    curArea = 1;
    createCards(objAryAll, curArea, curTimeSeg);
}
function showWest(){
    curArea = 2;
    createCards(objAryAll, curArea, curTimeSeg);
}
function showSouth(){
    curArea = 3;
    createCards(objAryAll, curArea, curTimeSeg);
}
function showEast(){
    curArea = 4;
    createCards(objAryAll, curArea, curTimeSeg);
}
function showIsland(){
    curArea = 5;
    createCards(objAryAll, curArea, curTimeSeg);
}
function showT0(){
    curTimeSeg = 0;
    createCards(objAryAll, curArea, curTimeSeg);
}
function showT1(){
    curTimeSeg = 1;
    createCards(objAryAll, curArea, curTimeSeg);
}
function showT2(){
    curTimeSeg = 2;
    createCards(objAryAll, curArea, curTimeSeg);
}

function getAreaRange(inArea){
    switch (inArea){
        case 0:
            return [0, 22];
        case 1:
            return [0, 7];
        case 2:
            return [7, 13];
        case 3:
            return [13, 16];
        case 4:
            return [16, 19];
        case 5:
            return [19, 22];
    }
}

// ---------- Get Time Func ---------- //

function getMyDate(){

    const d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var date = d.getDate();
    var day = d.getDay();
    var dayCh;

    switch (Number(day)){
        case 0:
            dayCh = '日';
            break;
        case 1:
            dayCh = '一';
            break;
        case 2:
            dayCh = '二';
            break;
        case 3:
            dayCh = '三';
            break;
        case 4:
            dayCh = '四';
            break;
        case 5:
            dayCh = '五';
            break;
        case 6:
            dayCh = '六';
            break;
    }

    var dateStr = `${year}年${month}月${date}日  星期${dayCh}`;
    console.log(dateStr);
    return dateStr;
}
function getMyTime(){
    const d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var secs = d.getSeconds();

    var timeStr = `${hours} : ${minutes} : ${secs}`;
    console.log(timeStr);
    return timeStr;
}

