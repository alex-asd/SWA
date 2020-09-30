import React from 'react'
import store from './store'

const getCity = () => {
    let selected = document.getElementById('selectedCity')
    return selected.value
}
const getFrom = () => {
    let selected = document.getElementById('from')
    return selected.value
}
const getTo = () => {
    let selected = document.getElementById('to')
    return selected.value
}

const getType = () => {
    let selected = document.getElementById('selectedData')
    return selected.value
}

const getValue = () => {
    let val = document.getElementById('value')
    return val.value
}

const getTime = () => {
    let time = document.getElementById('time')
    return time.value
}

const WeatherData = (d) => [
    <td key = 'place'> {d.place}</td>,
    <td key = 'type'> {d.type}</td>,
    <td key = 'value'> {d.value}</td>,
    <td key = 'unit'> {d.unit}</td>,
    <td key = 'time'> {d.time}</td>
]

const ForecastData = (pd) => [
    <td key = 'time'> {pd.time}</td>,
    <td key = 'type'> {pd.type}</td>,
    <td key = 'from'> {pd.from}</td>,
    <td key = 'to'> {pd.to}</td>,
    <td key = 'unit'> {pd.unit}</td>,
    <td key = 'place'> {pd.place}</td>
]

const WeatherDataRow = (props) => (
    <tr>
        <WeatherData {...props}/>
    </tr>
)

const ForecastDataRow = (props) => (
    <tr>
        <ForecastData {...props}/>
    </tr>
)

const WeatherDataBody = ({model}) => (
    <tbody>
        {
            model.prevData().map(function(rowData, i) {return <WeatherDataRow key={i} {...rowData}/> })
        }
    </tbody>
)

const ForecastDataBody = ({model}) => (
    <tbody>
        {
            model.futData().map(function(rowData, i) {return <ForecastDataRow key={i} {...rowData}/> })
        }
    </tbody>
)

export default dispatcher => (model) => (
    <div id='base'>
        
        <select id='selectedCity'>
            <option value = "Horsens"> Horsens </option>
            <option value = "Aarhus"> Aarhus </option>
            <option value = "Copenhagen"> Copenhagen </option>
        </select>
        
        
        <label htmlFor="from">From:</label>
        <input id="from" type="datetime-local"/>

        <label htmlFor="to">To:</label>
        <input id="to" type="datetime-local"/>
        <button onClick = {() => dispatcher()({type:'load', city:getCity(), from:getFrom(), to:getTo()})}>Load Data</button> <br></br> 

        <select id ="selectedData">
            <option value = "temperature">Temperature</option>
            <option value = "precipitation">Precipitation</option>
            <option value = "wind speed">Wind speed</option>
            <option value = "cloud coverage">Cloud coverage</option>
        </select>
        
        <input placeholder='value' id='value'/>
        <input id='time' type="datetime-local"/>

        <button onClick = {() => dispatcher()({type:'add_data', place:getCity(),
             data_type:getType(), value:getValue(), time:getTime()})}>Insert Data</button>

        <div>
            <h1>Historical data</h1>
            <table id='weatherdata' style={{border:"1px solid black"}}>
                <thead><tr><td>Place</td><td>Data type</td><td>Value</td><td>Unit</td><td>Time</td></tr></thead>
                <WeatherDataBody {...{model}}/>
            </table> <br></br> <br></br> <hr></hr> <hr></hr>
        </div>

        <div>
            <h1>Forecast data</h1>
            <table id='forecastData' style={{border:"1px solid black"}}>
                <thead><tr>   
                    <td>Time</td><td>Data type</td><td>From</td><td>To</td><td>Unit</td><td>Place</td>    
                </tr></thead>
                <ForecastDataBody {...{model}}/>
            </table>
        </div>        
        
    </div>
    
)
