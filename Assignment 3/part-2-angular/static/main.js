var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('WeatherController', function WeatherController($scope, $http) {
  $scope.cities = [
    {
      name: 'Horsens'
    }, {
      name: 'Aarhus'
    }, {
      name: 'Copenhagen'
    }
  ];

  $scope.dataTypes = [
    {
      type: 'temperature',
      units: [
        'C','F'
      ]
    }, {
      type: 'precipitation',
      units: [
        'MM', 'Inch'
      ]
    }, {
      type: 'cloud coverage',
      units: [
        '%'
      ]
    }, {
      type: 'wind speed',
      units: [
        'MPH', 'MS'
      ]
    }, 
  ]

  let today = new Date();
  let fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  $scope.fromDate = today;
  $scope.toDate = fiveDaysAgo;

  $scope.refresh = function() {
    $scope.fromDate = today;
    $scope.toDate = fiveDaysAgo;
    $scope.loadDataFor();
    $scope.forecastData = "";
    $scope.forecastPredictions = "";
  }

  $scope.loadDataFor = function() {
    // $scope.data = 'You selected city ' + $scope.selectedItem;
    $http.get('http://localhost:8080/data/' + $scope.selectedItem).then(function successCallback(response) {
      if(isBefore($scope.fromDate, $scope.toDate))
      {
        let rData = response.data;

        let latestTemperature = rData.filter(data => data.type === 'temperature' && new Date(data.time) >= $scope.toDate && new Date(data.time) <= $scope.fromDate).reduce(function(prev, current) {
          return (prev.time > current.time) ? prev : current
        })

        let latestPrecipation = rData.filter(data => data.type === 'precipitation' && new Date(data.time) >= $scope.toDate && new Date(data.time) <= $scope.fromDate).reduce(function(prev, current) {
          return (prev.time > current.time) ? prev : current
        })

        let latestWindSpeed = rData.filter(data => data.type === 'wind speed' && new Date(data.time) >= $scope.toDate && new Date(data.time) <= $scope.fromDate).reduce(function(prev, current) {
            return (prev.time > current.time) ? prev : current
        })

        let latestCloudCoverage = rData.filter(data => data.type === 'cloud coverage' && new Date(data.time) >= $scope.toDate && new Date(data.time) <= $scope.fromDate).reduce(function(prev, current) {
            return (prev.time > current.time) ? prev : current
        })

        let minTemp = rData.filter(data => data.type === 'temperature' && new Date(data.time) >= $scope.toDate && new Date(data.time) <= $scope.fromDate).reduce(function(prev, current) {
          return (prev.value < current.value) ? prev : current
        })

        let maxTemp = rData.filter(data => data.type === 'temperature' && new Date(data.time) >= $scope.toDate && new Date(data.time) <= $scope.fromDate).reduce(function(prev, current) {
          return (prev.value > current.value) ? prev : current
        })

        let precipitationLastFiveDays = rData.filter(data => data.type === 'precipitation' && new Date(data.time) >= $scope.toDate && new Date(data.time) <= $scope.fromDate).reduce(
          function (acc, data) {
            return acc + data.value
          }, 0).toFixed(2)

        let windSpeedDataEntries = rData.filter(data => data.type === 'wind speed' && new Date(data.time) >= $scope.toDate && new Date(data.time) <= $scope.fromDate)
        
        const typeCount = rData => {
          let result = { West: 0, East: 0, North: 0, South: 0, Southwest: 0, Southeast:0, Northwest: 0, Northeast: 0}
          for(let entry of rData) {
              result = { ...result, [entry.direction]: result[entry.direction]+1 }
          }
          return result   
        }

        let cloudCoverageEntries = rData.filter(data => data.type === 'cloud coverage' && new Date(data.time) >= $scope.toDate && new Date(data.time) <= $scope.fromDate)
        let counted = typeCount(windSpeedDataEntries)
        let maxNum = 0;
        let maxNumDirection = ""
        for(var z in counted) {
          if(counted[z] > maxNum) {
            maxNum = counted[z]
            maxNumDirection = z
          }
        }

        // calc days
        var days = calculateDaysBetween($scope.fromDate, $scope.toDate);

        // set the data
        $scope.data = "Data displayed for: " +  $scope.selectedItem
        $scope.latestTemperature = getStringForLatestData(latestTemperature)
        $scope.latestPrecipation = getStringForLatestData(latestPrecipation)
        $scope.latestCloudCoverage = getStringForLatestData(latestCloudCoverage)
        $scope.latestWindSpeed = getStringForLatestData(latestWindSpeed)
        $scope.minTemp = "Minimum temperature from the last " + days + " days: " + minTemp.value
        $scope.maxTemp = "Maximum temperature from the last " + days + " days: " + maxTemp.value
        $scope.precipitationLastFiveDays = "Total precipitation for the last " + days + " days: " + precipitationLastFiveDays
        $scope.windSpeedDataEntries = "Average wind speed for the last " + days + " days: " + average(windSpeedDataEntries)
        $scope.maxNumDirection = "Dominant wind direction for the last " + days + " days: " + maxNumDirection
        $scope.maxNum = " with " + maxNum + " entries"
        $scope.cloudCoverageEntries = "With cloud covarage: " + average(cloudCoverageEntries) + "%"
      }else
      {
        $scope.data = ""
        $scope.latestTemperature = ""
        $scope.latestPrecipation = ""
        $scope.latestCloudCoverage = ""
        $scope.latestWindSpeed = ""
        $scope.minTemp = ""
        $scope.maxTemp = ""
        $scope.precipitationLastFiveDays = ""
        $scope.windSpeedDataEntries = ""
        $scope.maxNumDirection = ""
        $scope.maxNum = ""
        $scope.cloudCoverageEntries = ""
      }

      // get forecast
      $http.get('http://localhost:8080/forecast/' + $scope.selectedItem)
        .then(function successCallbackCast(response){
          forecastData = response.data.filter(forecastData => forecastData.place === $scope.selectedItem && new Date(forecastData.time).getTime() >= $scope.fromDate.getTime() && new Date(forecastData.time).getTime() <= $scope.toDate.getTime())
          if(!isBefore($scope.fromDate, $scope.toDate))
          {
            $scope.forecastData = "The weather predictions in " + $scope.selectedItem + " : "
            $scope.forecastPredictions = getPredictionStringFor24hrs(forecastData)
          }
        })
    },
    function errorCallback(response) {
      $scope.data = response;
    })
  }

  $scope.addData = function(type, value, unit, time) {
    let missedEntries = ""
    if($scope.selectedItem == null) { missedEntries += "City," }
    if($scope.dataType == null) { missedEntries += "Data type," }
    if($scope.valueEntry == null) { missedEntries += "Value," }
    if($scope.dateEntry == null) { missedEntries += "Date," }


    if(missedEntries != "") {
      alert("The following entries were not filled: " + missedEntries.substring(0, missedEntries.length-1))
      return;
    }

    const _unit = ""
    switch($scope.unitEntry) {
      case "temperature":
        _unit = 'C'
        break;
      case 'wind speed':
        _unit = 'm/s'
        break;
      case 'cloud coverage':
        _unit = '%'
        break;
      case 'precipitation':
        _unit = 'mm'
        break;

    }

    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
    $http.post('http://localhost:8080/data', JSON.stringify([{
      place: $scope.selectedItem,
      type: $scope.dataType,
      value: $scope.valueEntry,
      unit: _unit,
      time: $scope.dateEntry
  }])
  , { headers })
  .then (function success(response) {
        console.log('Successful upload')
        alert("Successfuly uploaded the data...")
        $scope.refresh()
    }, function error(response) {
        console.log('Unsucessful upload: ' + response)
        alert("Error ocurred while uploading the data: " + response)
    })
  }

  function getStringForLatestData(data) {
    var str = "Latest " + data.type + " for the given time period is " + data.value + data.unit 
    switch(data.type) {
      case "wind speed":
        str += " with direction " + data.direction + " "
        break;
      case "precipitation":
        str += " with type " + data.precipitation_type + " "
        break;
      default:
        
    }
    return str
  }

  function average(data) {
    let numOfEntries = data.length
    let sum = 0
    for(var x in data) {
      sum = sum + data[x].value
    }
    return (sum/numOfEntries).toFixed(2)
  }

  function getPredictionStringFor24hrs(forecastData) {
    let forecastString = ""
    for(var x in forecastData) {
      let predDate = new Date(forecastData[x].time)
      forecastString += "On " + predDate.getDate() + "." + predDate.getMonth() + " at " 
      + predDate.getHours() + " o'clock the " + forecastData[x].type + 
      " is expected to be between " + forecastData[x].from + " and " + forecastData[x].to + forecastData[x].unit + "\n"
    }
    return forecastString
  }

  function calculateDaysBetween(dt1, dt2) {
    if(isBefore(dt1, dt2))
    {
      var days = (dt1.getTime() - dt2.getTime()) / (1000 * 3600 * 24);
      return Math.round(days);
    }
    else{
      console.log('showing predictions if any match');
    }
  }

  function isBefore(date1, date2)
  {
    return date1.getTime() > date2.getTime();
  }
});