function Event(eventDate, eventPlace){
    function time() { return eventDate }
    function place() { return eventPlace }
    return {
        time: time,
        place: place
    }
}

function DataType(dataType, dataUnit){
    function type() { return dataType }
    function unit() { return dataUnit }
    function setUnit(newUnit) { dataUnit = newUnit }
    return {
        type,
        unit,
        setUnit
    }
}

function DateInterval(dateFrom, dateTo){
    function from() { return dateFrom }
    function to() { return dateTo }
    function contains(containedDate) { 
        if(!(containedDate instanceof Date)){
            return
        }
        if(dateFrom <= containedDate && dateTo >= containedDate){
            return true
        }
        else
            return false
    }
    return {
        from,
        to,
        contains
    }
}

function WeatherData(weatherDate, weatherPlace, weatherType, weatherUnit, weatherValue){
    function value(){ return weatherValue }
    function setValue(newValue) { weatherValue = newValue}
    return Object.assign({}, Event(weatherDate, weatherPlace), 
        DataType(weatherType, weatherUnit), {value, setValue})
}

function Temperature(wDate, wPlace, wType, wUnit, wValue){
    let obj = new WeatherData(wDate, wPlace, wType, wUnit, wValue)
    function convertToF(){
        if(obj.unit() == 'C'){
            obj.setUnit('F')
            obj.setValue((obj.value() * 9 / 5) + 32)
        }
    }
    function convertToC(){
        if(obj.unit() == 'F'){
            obj.setUnit('C')
            obj.setValue((obj.value() - 32) * 5 / 9)
        }
    }
    return Object.assign(obj, {convertToF, convertToC})
}

function Precipitation(wDate, wPlace, wType, wUnit, wValue, pPrecipitationType){
    let obj = new WeatherData(wDate, wPlace, wType, wUnit, wValue)
    function precipitationType(){
        return pPrecipitationType
    }

    function convertToInches(){
        if(obj.unit() == 'MM'){
            obj.setValue(obj.value() / 25.4)
            obj.setUnit('INCH')
        }
    }

    function convertToMM(){
        if(obj.unit() == 'INCH'){
            obj.setValue(obj.value() * 25.4)
            obj.setUnit('MM')
        }
    }
    return Object.assign(obj, {precipitationType, convertToInches, convertToMM})
}

function Wind(wDate, wPlace, wType, wUnit, wValue, wDirection){
    let obj = new WeatherData(wDate, wPlace, wType, wUnit, wValue)
    function direction(){
        return wDirection
    }

    function convertToMPH(){
        if(obj.unit() == 'MS'){
            obj.setUnit('MPH')
            obj.setValue(obj.value() * 2.237)
        }
    }

    function convertToMS(){
        if(obj.unit() == 'MPH'){
            obj.setUnit('MS')
            obj.setValue(obj.value() / 2.237)
        }
    }
    return Object.assign(obj, {direction, convertToMPH, convertToMS})
}

function WeatherHistory(curPlace, curType, curPeriod){
    var weatherData = new Array()
    function WeatherReport(wData) {
        wData.forEach(function(element){
            weatherData.push(element)
        });
    }   
    function getCurrentPlace() { return curPlace }
    function setCurrentPlace(newPlace){ curPlace = newPlace }
    function clearCurrentPlace() { curPlace = "" }
    function getCurrentType() { return curType }
    function setCurrentType(newType) { curType = newType }
    function clearCurrentType() { curType = "" }
    function getCurrentPeriod() { return curPeriod }
    function setCurrentPeriod(newPeriod) { curPeriod = newPeriod }
    function clearCurrentPeriod() { curPeriod = "" }
    function convertToUSUnits() { 
        weatherPrediction.forEach(function(element){
            switch (element.unit()){
                case 'C':
                    element.convertToF()
                    break;
                case 'MM':
                    element.convertToInches()
                    break;
                case 'MS':
                    element.convertToMPH()
                    break;
                default:
                    break;
            }
        });
     }
    function convertToInternationalUnits() { 
        weatherData.forEach(function(element) {
            switch (element.unit()) {
                case 'F':
                    element.convertToC()
                    break;
                case 'INCH':
                    element.convertToMM()
                    break;
                case 'MPH':
                    element.convertToMS()
                    break;
                default:
                    break;
            }
        });
     }
    function add(temp) { weatherData.push(...temp) }
    function data(){
        let temp = []
        weatherData.forEach(function(item, index, array) {
            if(curPlace == item.place() || curPlace == ""){
                if(curType == item.type() || curType == ""){
                    if(curPeriod == "" || curPeriod.contains(item.time())){
                        temp.push(item)
                    }
                }
            }
        });
        console.log('data returns ' + temp.length + ' items')
        return temp
    }
    return{
        getCurrentPlace, setCurrentPlace, clearCurrentPlace,
        getCurrentType, setCurrentType, clearCurrentType,
        getCurrentPeriod, setCurrentPeriod, clearCurrentPeriod,
        convertToUSUnits, convertToInternationalUnits, add,
        data, WeatherReport
    }
}


function WeatherPrediction(predictionDate, predictionPlace, predictionType, predictionUnit, predictionFrom, predictionTo){
    function matches(data) { return (data.value() >= from && data.value() <= to ) }
    function to(){ return predictionTo }
    function from() { return predictionFrom }
    function setTo(newValue){ predictionTo = newValue }
    function setFrom(newValue) { predictionFrom = newValue }
    return Object.assign({}, Event(predictionDate, predictionPlace), 
        DataType(predictionType, predictionUnit), {matches, to, from, setTo, setFrom})
}


function TemperaturePrediction(pDate, pPlace, pType, pUnit, pFrom, pTo){
    let obj = new WeatherPrediction(pDate, pPlace, pType, pUnit, pFrom, pTo)
    function convertToF(){
        if(obj.unit() == 'C'){
            obj.setUnit('F')
            obj.setFrom((obj.from() * 9 / 5) + 32)
            obj.setTo((obj.to() * 9 / 5) + 32)
        }
    }
    function convertToC(){
        if(obj.unit() == 'F'){
            obj.setUnit('C')
            obj.setFrom((obj.from() - 32) * 5 / 9)
            obj.setTo((obj.to() - 32) * 5 / 9)
        }
    }
    return Object.assign(obj, {convertToF, convertToC})
}

function PrecipitationPrediction(pDate, pPlace, pType, pUnit, pFrom, pTo, pPrecipitationTypes){
    let obj = new WeatherPrediction(pDate, pPlace, pType, pUnit, pFrom, pTo)
    function types(){
        return pPrecipitationTypes
    }

    function matches(data) { return (data.value() >= from && data.value() <= to) }

    function convertToInches(){
        if(obj.unit() == 'MM'){
            obj.setFrom(obj.from() / 25.4)
            obj.setTo(obj.to() / 25.4)
            obj.setUnit('INCH')
        }
    }

    function convertToMM(){
        if(obj.unit() == 'INCH'){
            obj.setFrom(obj.from() * 25.4)
            obj.setTo(obj.to() * 25.4)
            obj.setUnit('MM')
        }
    }
    return Object.assign(obj, {types, matches, convertToInches, convertToMM})
}

function WindPrediction(pDate, pPlace, pType, pUnit, pFrom, pTo, pDirections){
    let obj = new WeatherPrediction(pDate, pPlace, pType, pUnit, pFrom, pTo)
    function directions(){
        return pDirections
    }

    function matches(data) { 
        var b1 = (data.value() >= from && data.value() <= to) 
        var b2 = pDirections.includes(data.direction())
        return b1 && b2
    }

    function convertToMPH(){
        if(obj.unit() == 'MS'){
            obj.setUnit('MPH')
            obj.setFrom(obj.from() * 2.237)
            obj.setTo(obj.to() * 2.237)
        }
    }

    function convertToMS(){
        if(obj.unit() == 'MPH'){
            obj.setUnit('MS')
            obj.setFrom(obj.from() / 2.237)
            obj.setTo(obj.to() / 2.237)
        }
    }
    return Object.assign(obj, {directions, matches, convertToMPH, convertToMS})
}

function WeatherForecast(curPlace, curType, curPeriod){
    var weatherPrediction = new Array()
    function WeatherReport(pData) {
        pData.forEach(function(element){
            weatherPrediction.push(element)
        });
    }   
    function getCurrentPlace() { return curPlace }
    function setCurrentPlace(newPlace){ curPlace = newPlace }
    function clearCurrentPlace() { curPlace = "" }
    function getCurrentType() { return curType }
    function setCurrentType(newType) { curType = newType }
    function clearCurrentType() { curType = "" }
    function getCurrentPeriod() { return curPeriod }
    function setCurrentPeriod(newPeriod) { curPeriod = newPeriod }
    function clearCurrentPeriod() { curPeriod = "" }
    function convertToUSUnits() { 
        weatherPrediction.forEach(function(element){
            switch (element.unit()){
                case 'C':
                    element.convertToF()
                    // console.log('converted successfully to ' + element.unit() + ' ' + element.from() + ' - ' + element.to())
                    break;
                case 'MM':
                    element.convertToInches()
                    break;
                case 'MS':
                    element.convertToMPH()
                    break;
                default:
                    break;
            }
        });
     }
    function convertToInternationalUnits() { 
        weatherPrediction.forEach(function(element) {
            console.log('converting from ' + element.unit() + ' to Normal units')
            switch (element.unit()) {
                case 'F':
                    element.convertToC()
                    break;
                case 'INCH':
                    element.convertToMM()
                    break;
                case 'MPH':
                    element.convertToMS()
                    break;
                default:
                    break;
            }
        });
     }
    function add(temp) { weatherPrediction.push(...temp) }
    function data(){
        let temp = []
        weatherPrediction.forEach(function(item, index, array) {
            console.log((index + 1) + '. In ' + item.place() + ' the expected '+ item.type() + ' is ' + item.unit() + ' between ' + item.from() + ' - ' + item.to())
            if(curPlace == item.place() || curPlace == ""){
                if(curType == item.type() || curType == ""){
                    if(curPeriod == "" || curPeriod.contains(item.time())){
                        temp.push(item)
                    }
                }
            }
        });
        return temp
    }
    return{
        getCurrentPlace, setCurrentPlace, clearCurrentPlace,
        getCurrentType, setCurrentType, clearCurrentType,
        getCurrentPeriod, setCurrentPeriod, clearCurrentPeriod,
        convertToUSUnits, convertToInternationalUnits, add,
        data, WeatherReport
    }
}