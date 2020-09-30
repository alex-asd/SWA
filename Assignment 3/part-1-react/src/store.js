export default (init_model, view, renderer) => {
  let model = init_model

  function reducer(action, model) {
    switch(action.type) {
      case 'add_data':
        const { weatherObject } = action

        return model.addData(weatherObject)

      case 'load':
        return action.cityData

      default:
        return model
    }
  }

  return action => {
    model = reducer(action, model)
    renderer(view(model))
  }

}
