$(document).ready(function(){
    initTableData();
});

var key = "1o5rqwDvo2Q3-68HTWGC-RMFOx84YRQEBJbvZp-PXRnQ";
var defaultCity = "Chicago"
var tableData; 

function initTableData(){

    Tabletop.init( { 
        key: key,
        callback: showInfo 
    });

};

function showInfo(data, tabletop) {
    // console.log(data);
    tableData = data.MASTER.elements;
    setFilters();
    showColumns();
    $(".loader-container").hide();
    $(".hidden-on-load").show();
    $(".table").tablesort();    
}

function setFilters(){
    var cities = _.pluck(tableData, 'city');
    cities = _.uniq(cities);
    cities = _.filter(cities, function(city){ return city && city != ""; });
    var handleBarData = {items: cities};
    var source   = document.getElementById("city-row").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(handleBarData);
    $(".city-container").html(html);
    var first = $(".filter-item").first();
    filterByItem(first);
    $(".filter-row .filter-item").click(filterRows);    
}

function filterRows(){
    var filter = $(this);
    if (filter.hasClass("selected")){
        return;
    }

    $(".selected").removeClass("selected");
    filterByItem(filter);
    showColumns();
    $(".table").tablesort();    
}

function filterByItem(filterRow){
    filterRow.addClass("selected");
    var filterText = filterRow.text().trim();
    showTableDataByFilter(filterText);
};

function showTableDataByFilter(city){
    var filterdData = _.filter(tableData, function(item){ return item.city.toUpperCase() == city.toUpperCase(); });
    var handleBarData = {items: filterdData};
    var source   = document.getElementById("za-row").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(handleBarData);
    $(".table tbody").html(html);
}

var NEW_YORK = "NEW YORK";
var BROOKLYN = "BROOKLYN";
var CHICAGO = "CHICAGO";
var DETROIT = "DETROIT";

function showColumns(){
    var filterText = $(".selected").text().trim().toUpperCase();

    if (filterText == DETROIT) {
        $(".infatuation").hide();
        $(".barstool").hide();
        $(".yelp").show();
    }
    else if (filterText == CHICAGO) {
        $(".infatuation").show();
        $(".barstool").hide();
        $(".yelp").show();
    }
    else if (filterText == NEW_YORK || filterText == BROOKLYN) {
        $(".infatuation").show();
        $(".barstool").show();
        $(".yelp").show();
    }

}