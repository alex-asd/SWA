import model from "./model"

async function loadFor (city){
  const previous = await fetch(('http://localhost:8080/data/' + city)).then(res => res.json())
  const future = await fetch(('http://localhost:8080/forecast/' + city)).then(res => res.json())
  return model(previous, future)
}

export default store => async ({type, ...params}) =>  {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
    switch(type) {
      case 'load':
        let cityData = await loadFor(params.city)
        if(params.from && params.to) { 
          cityData = cityData.forPeriod(params.from, params.to)
         }
        store({type, cityData})
        break;

      case 'add_data':
        let unitType = ""
        
        if(params.data_type === 'temperature') unitType = 'C'
        if(params.data_type === 'wind speed') unitType = 'm/s'
        if(params.data_type === 'precipitation') unitType = 'mm'
        if(params.data_type === 'cloud coverage') unitType = '%'
        
        const weatherObject = [{ 
          place: params.place,
          type: params.data_type,
          value: params.value,
          unit: unitType,
          time: params.time
        }]

        await fetch('http://localhost:8080/data',
          { method: 'POST',
            body: JSON.stringify(weatherObject), headers})

          store({type, ...params, weatherObject})
        break;
        
      default:
    }
}

