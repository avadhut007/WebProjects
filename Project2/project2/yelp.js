function initialize () {
}

function findRestaurants () {
   var xhr = new XMLHttpRequest();
   searchTerm =  document.getElementById('searchTerm').value
   cityName =  document.getElementById('city').value
   numOfSearches = document.getElementById('level').value
   //console.log("proxy.php?term="+searchTerm+"&location="+cityName+"&limit="+numOfSearches)
   xhr.open("GET", "proxy.php?term="+searchTerm+"&location="+cityName+"&limit="+numOfSearches);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {

         var json = JSON.parse(this.responseText);
         var str = JSON.stringify(json,undefined,2);
         var result= convertDataIntoHTML(json)
         
         document.getElementById("output").innerHTML = "<pre>" + result + "</pre>";
       }
   };
   xhr.send(null);
}

function  convertDataIntoHTML(json) {

   var businessNames = json.businesses
   var result = '<ol>'
         for (var i in businessNames){
            //console.log(businessNames[i])
            var bizCategories = ''
            
            for(var j=0;j < businessNames[i].categories.length ; j++ ) {
              bizCategories += businessNames[i].categories[j].title
              if (j < businessNames[i].categories.length-1){
               bizCategories += ', '}
           }
            result +=
            '<div class ="biz" > <li>  ' +

            '<a href="' + businessNames[i].url + '" target="_blank">'+businessNames[i].name + '</a> <br>' +'<br>'  +
            '<ul>' +
            '<b> Catergories: </b>' + bizCategories +  '<br>'  +
            '<b> Price: </b>' + businessNames[i].price +    '<br>'  + 
            '<b> Ratings: </b>' + businessNames[i].rating +   '<br>'  +
            '<b> Postal Address: </b>' + businessNames[i].location.display_address +  '<br>'  +
            '<b> Phone: </b>' + businessNames[i].display_phone + '<br>'  +

            '</ul>' +
            '<img src= "' + businessNames[i].image_url + '" height="150px" width="150px"></img>' +
            ' </li> </div> <br>'
         }

   result+='</ol>'
   return result
}
