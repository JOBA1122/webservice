(function () {
'use strict';
//SE DEFINE EL MODULO, CONTROLADOR Y SERVICIO A CREAR
angular.module('CountryApp', [])
.controller('CountryAppController', CountryAppController)
.service('CountryAppService', CountryAppService)
.constant('ApiBasePath', "http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso/");

// CONTROLADOR
CountryAppController.$inject = ['CountryAppService'];// SE INYECTA EL SERVICIO QUE CONTIENE LOS METODOS A USAR
function CountryAppController(CountryAppService) {
  var country = this;
  var list = [];
  var promiseAllCountries = CountryAppService.getAllInfoCountries();
  
  //PROMISE DEL METODO QUE RECOLECTA TODOS LOS PAISES
  promiseAllCountries.then(function (response) {// se obtienen toda la informacion referente a los paises
    country.info = response.data;
  })
  .catch(function (error) {
    console.log("Error countries");
  })
  //METODO QUE DESPLIEGA LA INFORMACION SEGUN SEA LA ELECCION EN LA VISTA
  country.selected = function(selected){
    
    var promiseCapitalCity = CountryAppService.getCapitalCity(selected);
    var promiseFlag = CountryAppService.getFlag(selected);
    var promiseTelephoneCode = CountryAppService.getTelephoneCode(selected);
    var promiseLanguage = CountryAppService.getLanguage(selected);
    var promiseSingleCurrency = CountryAppService.getSingleCurrency(selected);
     
      promiseSingleCurrency.then(function (response) {// se obtienen moneda del pais
       country.currency = response.data;
      })
      .catch(function (error) {
        console.log("Error currency");
      })
  
      promiseCapitalCity.then(function (response) {// se obtienen capital 
        country.capitalCity = response.data;
       })
      .catch(function (error) {
        console.log("Error capital city");
      })
  
      promiseFlag.then(function (response) {// se obtienen  bandera
        country.flag = response.data;
       })
      .catch(function (error) {
        console.log("Error flag");
      })
  
      promiseTelephoneCode.then(function (response) {// se obtienen  codigo telefonico
        country.phoneCode = response.data;
       })
      .catch(function (error) {
        console.log("Error phoneCode");
      })
  
      promiseLanguage.then(function (response) {// se obtienen  lenguaje
        console.log(response.data);
        country.language = response.data;
       })
      .catch(function (error) {
        console.log("Error Language");
      })
  }    
}

CountryAppService.$inject = ['$http', 'ApiBasePath'];
function CountryAppService($http, ApiBasePath) {
  var service = this;

  service.getAllInfoCountries = function () {//listar paises
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "FullCountryInfoAllCountries/JSON")
   
    });

    return response;
  };
  service.getCapitalCity = function (property) {// Obtener la capital
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "CapitalCity/JSON"),
      params:{
        sCountryISOCode : property.sISOCode
      }
    });

    return response;
  };
  service.getSingleCurrency = function (property) {// obentener la moneda oficial
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "CurrencyName/JSON"),
      params:{
        sCurrencyISOCode: property.sCurrencyISOCode
      }
    });

    return response;
  };

  service.getFlag = function (property) {// Obtener la bandera
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "CountryFlag/JSON"),
      params:{
        sCountryISOCode : property.sISOCode
      }
    });
    
    return response;
  };
  service.getTelephoneCode = function (property) {// Obtener el codigo telefónico
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "CountryIntPhoneCode/JSON"),
      params:{
        sCountryISOCode : property.sISOCode
      }
    });
    
    return response;
  };
  
  service.getLanguage = function (property) {// Obtener el idioma oficial
  if(property.Languages.length != 0){
          var response = $http({
          method: "GET",
          url: (ApiBasePath + "LanguageName/JSON"),
          params:{
            sISOCode : property.Languages[0].sISOCode
          }
        });
        return response;
  }
  else{// Dado existen vacios en la informacion de la API con respecto 
      var response = $http({//con respecto al idioma oficial, aca se muestra en la vista , el error
        method: "GET",
        url: (ApiBasePath + "LanguageName/JSON"),
        params:{
          sISOCode : "as"
        }
      });
      return response;
      }
    
  };
  
}

})();
