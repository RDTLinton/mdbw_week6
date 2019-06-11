exports = async function() {
  /*
    A Scheduled Trigger will always call a function without arguments.
    Documentation on Triggers: https://docs.mongodb.com/stitch/triggers/overview/

    Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.
  */

    //Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("mdbw").collection("week6");
    //var doc = collection.findOne({ name: "mongodb" });
    
    var doc = {
      name: "Tajay Linton",
      employer: "RealDecoy",
      position: "Consultant",
      certifications: [
        "MongoDB", "Java"
      ]
    };
    
    var inserted = await collection.insertOne(doc);

    //To call other named functions:
    //var result = context.functions.execute("function_name", arg1, arg2);
  
};
