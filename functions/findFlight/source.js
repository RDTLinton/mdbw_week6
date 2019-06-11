exports = async function(docId){
  
  try {

    //Accessing a mongodb service:
    const collection = context.services.get("mongodb-atlas").db("mdbw").collection("week6");
    const doc = await collection.findOne({'_id': docId}, {'airport': 1, '_id': 0});
    
    const airport = doc.airport;
    
    let url = 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/';
    const path = Object.keys(airport).map(key => airport[key]).join('/');
    
    url += path;
    
    const response = await context.http.get({
      url: url,
      headers: { //header values are defined as arrays
        'Content-Type': ['application/json'],
        'X-RapidAPI-Host': ['skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'],
        'X-RapidAPI-Key': [context.values.get("rapidAPIKey")]
      }
    });
    
    let flightData = EJSON.parse(response.body.text());
    
    let update = await collection.updateOne(
      { '_id': docId },
      {
        '$set':
        {
          'flightData': {
              'cost': flightData.Quotes[0].MinPrice,
              'currency': flightData.Currencies[0].Code,
              'from': flightData.Places[1].Name,
              'to': flightData.Places[0].Name,
              'airline': flightData.Carriers[0].Name
          }
        }
    });
    //To call other named functions:
    context.functions.execute("getWeather", docId);

  } catch (err) {
    console.log('ERROR: - findFlight ' + err);
  }
};