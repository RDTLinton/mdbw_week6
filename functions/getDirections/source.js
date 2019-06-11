exports = async function(docId){
  try {
   
    let url = 'https://maps.googleapis.com/maps/api/directions/json?origin=John%20F.Kennedy%20International%20Airport&destination=Queens,%20NY%2011430,%20USA/1335%206th%20Ave%20,New%20York,NY&key=AIzaSyCTo-vHz2G8oqieSVikOK0zmTj8xhjIzSs'
    
    const response = await context.http.get({
      url: url,
      headers: { //header values are defined as arrays
        'Content-Type': ['application/json'],
      }
    });
    
    //console.log(response.status);

    let directions = EJSON.parse(response.body.text());
    //console.log(JSON.stringify(directions));
    
    //Accessing a mongodb service:
    let collection = context.services.get("mongodb-atlas").db("mdbw").collection("week6");
    let doc = await collection.updateOne(
        { '_id': docId },
        {
          '$set':
          {
            'direction': {
                'start': directions.routes[0].legs[0].start_address,
                'end':directions.routes[0].legs[0].end_address
            }
          }
        });
    

    //To call other named functions:
   //let callNextFunction =context.functions.execute("next", docId);
   return  null;
    
  } catch (err) {
    console.log('ERROR: - getDirections - ' + err);
  }
};