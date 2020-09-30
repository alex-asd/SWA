class DateInterval {
    constructor(from, to) {
        this._from = from
        this._to = to
    }

    from() { return this._from }
    to() { return this._to }
    contains(d) {
        return d.getTime() >= this._from && d.getTime() <= this._to 
    }
}


class Event {
    constructor(atime, aplace) {
        this._time = atime
        this._place = aplace
    }

    time() { return this._time }
    place() { return this._place }
}


class DataType extends Event {
    constructor(atime , aplace, atype, aunit) {
        super(atime, aplace)
        this._type = atype
        this._unit = aunit
    }

    type() { return this._type }
    unit() { return this._unit }
}


class WeatherData extends DataType {
    constructor(atime , aplace, atype, aunit, avalue) {
        super(atime , aplace, atype, aunit)
        this._value = avalue
    }

    value() { return this._value }
}


class Temperature extends WeatherData {
    constructor(atime , aplace, atype, aunit, avalue) {
        super(atime , aplace, atype, aunit, avalue)
    }

    convertToF() { 
        if(this._unit == 'C') {
            this._value = (this._value * (9/5)) + 32
            this._unit = 'F'
        }
    }

    convertToC() {
        if(this._unit == 'F') {
            this._value = (this._value - 32) * (5/9)
            this._unit = 'C'
        }
    }
}


class Precipation extends WeatherData {
    constructor(atime , aplace, atype, aunit, avalue, aprecipationType) {
        super(atime , aplace, atype, aunit, avalue)
        this._precipationType = aprecipationType
    }

    precipationType() { return this._precipationType }

    convertToInches() {
        if(this._unit == "MM") {
            this._value = this._value*25.4
            this._unit = "INCH"
        }
    }

    convertToMM() {
        if(this._unit == "INCH") {
            this._value = this._value/25.4
            this._unit = "MM"
        }
    }
}


class Wind extends WeatherData {
    constructor(atime , aplace, atype, aunit, avalue, adirection) {
        super(atime , aplace, atype, aunit, avalue)
        this._direction = adirection
    }

    direction() { return this._direction }

    convertToMPH() {
        if(this._unit == "MS") {
            this._value = this._value * 2.237
            this._unit = "MPH"
        }
    }   
    
    convertToMS() {
        if(this._unit == "MPH") {
            this._value = this._value / 2.237
            this._unit = "MS"
        }
    }
}


class CloudCoverage extends WeatherData {
    constructor(atime , aplace, atype, aunit, avalue) {
        super(atime , aplace, atype, aunit, avalue)
    }
}


class WeatherHistory {
    constructor(adata, acurrentPlace, acurrentType, acurrentPeriod) {
        this._data = adata
        this._currentPlace = acurrentPlace
        this._currentType = acurrentType
        this._currentPeriod = acurrentPeriod
    }

    getCurrentPlace() { return this._currentPlace }
    setCurrentPlace(ncurrentPlace) { this._currentPlace = ncurrentPlace }
    clearCurrentPlace() { this._currentPlace = "" }

    getCurrentType() { return this._currentType }
    setCurrentType(ncurrentType) { this._currentType = ncurrentType }
    clearCurrentType() { this._currentType = "" }

    getCurrentPeriod() { return this._currentPeriod }
    setCurrentPeriod(ncurrentPeriod) { this._currentPeriod = ncurrentPeriod }
    clearCurrentPeriod() { this._currentPeriod = "" }

    convertToUSUnits() {
        this._data.forEach(function(element) {
            switch (element.unit()) {
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

    convertToInternationalUnits() {
        this._data.forEach(function(element) {
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
        }, this);
    }
    
    add(ndata) {
        this._data.push(...ndata)
    }

    data() {
        let temp = [] 
        this._data.forEach(function(dataElement) {
            if(this._currentPlace == dataElement.place() || this._currentPlace == "") {
                if(this._currentPeriod == "" || this._currentPeriod.contains(dataElement.time())) {
                    if(this._currentType == dataElement.type() || this._currentType == "") {
                        temp.push(dataElement)
                    }
                }
            }
        }, this)
        console.log("Returning " + temp.length + " items")
        return temp
    }    
}


class WeatherPrediction extends DataType {
    constructor(atime , aplace, atype, aunit, afrom, ato) {
        super(atime , aplace, atype, aunit)
        this._from= afrom
        this._to = ato
    }

    matches(data) { 
        return data.value() >= this._from 
        && data.value() <= this._to 
        && this._type == data.type()
        && this._place == data.place()
    } 

    to() { return this._to }
    from() { return this._from }
}


class TemperaturePrediction extends WeatherPrediction {
    constructor(atime , aplace, atype, aunit, afrom, ato) {
        super(atime , aplace, atype, aunit, afrom, ato)
    }

    convertToF() { 
        if(this._unit == 'C') {
            this._from = (this._from * (9/5)) + 32
            this._to = (this._to * (9/5)) + 32
            this._unit = 'F'
        }
        
    }
    
    convertToC() {
        if(this._unit == 'F') {
            this._from = (this._from - 32) * (5/9)
            this._to = (this._to - 32) * (5/9)
            this._unit = 'C'
        }
    }
}


class PrecipationPrediction extends WeatherPrediction {
    constructor(atime , aplace, atype, aunit, afrom, ato, atypes) {
        super(atime , aplace, atype, aunit, afrom, ato)
        this._types = atypes
    }

    types() { return this._types }
    matches(data) { 
        if(!this._types.includes(data.precipationType())) {
            return false
        } else {
            return data.value() >= this._from 
            && data.value() <= this._to 
            && this._place == data.place()
        }
    } 

    convertToInches() {
        if(this._unit == "MM") {
            this._from = this._from/25.4
            this._to = this._to/25.4
            this._unit = "INCH"
        }
    }

    convertToMM() {
        if(this._unit == "INCH") {
            this._from = this._from*25.4
            this._to = this._to*25.4
            this._unit = "MM"
        }
    }
}


class WindPrediction extends WeatherPrediction {
    constructor(atime , aplace, atype, aunit, afrom, ato, adirections) {
        super(atime , aplace, atype, aunit, afrom, ato)
        this._directions = adirections
    }

    directions() { return this._directions }

    matches(data) { 
        if(!this._directions.includes(data.direction())) {
            return false
        } else {
            return data.value() >= this._from 
            && data.value() <= this._to 
            && this._type == data.type()
            && this._place == data.place()
        }
    } 

    convertToMPH() {
        if(this._unit == "MS") {
            this._from = this._from / 2.237
            this._to = this._to / 2.237
            this._unit = "MPH"
        }
    }   
    
    convertToMS() {
        if(this._unit == "MPH") {
            this._from = this._from * 2.237
            this._to = this._to * 2.237
            this._unit = "MS"
        }
    }
}


class CloudCoveragePrediction extends WeatherPrediction {
    constructor(atime , aplace, atype, aunit, afrom, ato) {
        super(atime , aplace, atype, aunit, afrom, ato)
    }
}

class WeatherForecast {
    constructor(adata, acurrentPlace, acurrentType, acurrentPeriod) {
        this._data = adata
        this._currentPlace = acurrentPlace
        this._currentType = acurrentType
        this._currentPeriod = acurrentPeriod
    }

    getCurrentPlace() { return this._currentPlace }
    setCurrentPlace(ncurrentPlace) { this._currentPlace = ncurrentPlace }
    clearCurrentPlace() { this._currentPlace = "" }

    getCurrentType() { return this._currentType }
    setCurrentType(ncurrentType) { this._currentType = ncurrentType }
    clearCurrentType() { this._currentType = "" }

    getCurrentPeriod() { return this._currentPeriod }
    setCurrentPeriod(ncurrentPeriod) { this._currentPeriod = ncurrentPeriod }
    clearCurrentPeriod() { this._currentPeriod = "" }

    convertToUSUnits() {
        this._data.forEach(function(element) {
            switch (element.unit()) {
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
        }, this);
    }

    convertToInternationalUnits() {
        this._data.forEach(function(element) {
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
        }, this);
    }
    
    add(ndata) {
        this._data.push(...ndata)
    }

    data() {
        let temp = [] 
        this._data.forEach(function(element) {
            if(this._currentPlace == element.place() || this._currentPlace == "") {
                if(this._currentPeriod == "" || this._currentPeriod.contains(element.time())) {
                    if(this._currentType == element.type() || this._currentType == "") {
                        temp.push(element)
                    }
                }
            }
        }, this)
        console.log("Returning " + temp.length + " items")
        return temp
    }
}




