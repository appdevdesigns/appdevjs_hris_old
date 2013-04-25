
/**
 * @class hris.server.models.Passport
 * @parent hris.server.models
 *
 *  This is an object to manage the interaction with the hris.Passports service.
 */


(function () {
      var onServer = false;
      if (typeof exports !== 'undefined') {
      // exports are defined on the server side node modules
          onServer = true;
      }


      if (!onServer) {

          var attr = {
              // Client Definitions
                _adModule:'hris',
                _adResource:'passport',    // singular
//                _adModel: [ModelName]   // <-- if the data returned is associated with a diff Model obj, provide it's name here:  _adModel:site.Label,
                //labelKey:'passport_surname',
                id:'passport_id'  // the field that is the id of the data
          };

            AD.Service.extend("hris.Passport",
              attr,
              {
              // define instance methods here.
              });
      }
})()
