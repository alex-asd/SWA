const model = (previousData, futureData) => {

    const forPeriod = (_from, _to) => {
        if(_from && _to) {
            return model ( previousData.filter(x => x.time >= _from && x.time <= _to),
                futureData.filter(x => x.time >= _from && x.time <= _to)
            )
        }
    }

    const prevData = () => previousData

    const futData = () => futureData

    const addData = d => {
        return model(previousData.concat(d), futureData) 
    }
    return { forPeriod, prevData, futData, addData }
}

export default model
