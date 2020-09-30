export default window => {
    const document = window.document
    const table_body = document.getElementById(weather_data)

    const addWeatherData = w => {
        const tr = table_body.appendChild(document.createElement('tr'))
        tr.insertCell().document.createTextNode(w.place)        
    }
}