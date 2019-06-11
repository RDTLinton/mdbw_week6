exports = async function(docId){
  try {
    let url = 'https://api.darksky.net/forecast/'
    const apikey = context.values.get("darkskyAPIKey");
    const params = apikey+'/42.3601,-71.0589?exclude=minutely,hourly,flags';
    
    url += params;
    
    const response = await context.http.get({
      url: url,
      headers: { //header values are defined as arrays
        'Content-Type': ['application/json'],
      }
    });
        
    let weatherForecast = EJSON.parse(response.body.text());
    //console.log(weatherForecast);
    
    //Accessing a mongodb service:
    let collection = context.services.get("mongodb-atlas").db("mdbw").collection("week6");
    let doc = await collection.updateOne(
        { '_id': docId },
        {
          '$set':
          {
            'weather': {
                'city': weatherForecast.timezone,
                'week-summary':weatherForecast.daily.summary,
                'forecasted-week': weatherForecast.daily.data
            }
          }
        });
    

    //To call other named functions:
    await context.functions.execute("getDirections", docId);
    return  null;
    
  } catch (err) {
    console.log('ERROR: - getWeather - ' + err);
  }
};