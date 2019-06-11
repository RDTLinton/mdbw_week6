exports = async function (changeEvent) {

    //Access the _id of the changed document:

    var docId = changeEvent.documentKey._id;

    const fullDocument = changeEvent.fullDocument;

    try {
        const host = 'https://cometari-airportsfinder-v1.p.rapidapi.com/api/airports/nearest';
        const queryString = '?lat=' + fullDocument.location.lat + '&lng=' + fullDocument.location.lng;
        const url = host + queryString;
        
        const response = await context.http.get({
            url: url,
            headers: { //header values are defined as arrays
                'Content-Type': ['application/json'],
                'X-RapidAPI-Host': ['cometari-airportsfinder-v1.p.rapidapi.com'],
                'X-RapidAPI-Key': [context.values.get("rapidAPIKey")]
            }
        });

        const airport = await EJSON.parse(response.body.text()); //extract JSON from the http response

        //Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.
        //Accessing a mongodb service:
        let collection = context.services.get("mongodb-atlas").db("mdbw").collection("week6");
        let doc = await collection.updateOne(
            { '_id': docId },
            {
              '$set':
              {
                'airport': {
                    'country': 'US',
                    'currency': 'USD',
                    'locale': 'en-US',
                    'originplace': airport.code + '-sky',
                    'destinationplace': 'JFK-sky',
                    'outboundpartialdate': '2019-06-15'
                }
              }
            });
        context.functions.execute("findFlight", docId);
    }

    catch (err) {
        console.log('ERROR: - findAirport - ' + err);
    }
};