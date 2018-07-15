$(document).ready(function(){
    initTableData();
    var dateOffset = (24*60*60*1000) * 2;
    var myDate = new Date();
    myDate.setTime(myDate.getTime() - dateOffset);
    var dateString = (myDate.getMonth() + 1) + '/' + myDate.getDate() + '/' +  myDate.getFullYear();
    $(".updated-text").text(dateString);
});

$(window).resize(function() {
    handleOverflow();
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
    setLinks();
    $(".loader-container").hide();
    $(".hidden-on-load").show();
    $(".table thead tr th").click(handleFilterClick);
    handleOverflow();
    $("td.zaisliferecom a").click(showMore);
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

function handleFilterClick() {
    if ($(this).hasClass("no-sort")){
        return;
    }

    if ($(this).hasClass("filteredColumn") || $(this).hasClass("justRemoved")){ 
        $(this).removeClass("justRemoved")
        return;
    }
    $(".filteredColumn").removeClass("filteredColumn");
    $(this).addClass("filteredColumn");

}

function filterRows(){
    var filter = $(this);
    if (filter.hasClass("selected")){
        return;
    }

    $(".filteredColumn").data("numberOfClicks", 0);
    $(".filteredColumn").removeClass("filteredColumn");
    $(".selected").removeClass("selected");
    filterByItem(filter);
    showColumns();
    setLinks();
    $(".table").tablesort();
    handleOverflow();
    $("td.zaisliferecom a").click(showMore);
}

function filterByItem(filterRow){
    filterRow.addClass("selected");
    var filterText = filterRow.text().trim();
    showTableDataByFilter(filterText);
};

var HIGH_TIER = 8;
var MIDDLE_TIER = 7;
var LOW_TIER = 6;

var HIGH_TIER_COLOR = "high-tier";
var MIDDLE_TIER_COLOR = "middle-tier";
var LOW_TIER_COLOR = "low-tier";

function showTableDataByFilter(city){
    var filterdData = _.filter(tableData, function(item){ return item.city.toUpperCase() == city.toUpperCase(); });
    
    for (var index = 0; index < filterdData.length; index++){
        if (filterdData[index].avg && !isNaN(filterdData[index].avg)){
            filterdData[index].avgCalculated = round(filterdData[index].avg, 1);
            if (filterdData[index].avgCalculated >= HIGH_TIER){
                filterdData[index].avgStyle = HIGH_TIER_COLOR;
            }
            else if (filterdData[index].avgCalculated < HIGH_TIER && filterdData[index].avgCalculated >= MIDDLE_TIER){
                filterdData[index].avgStyle = MIDDLE_TIER_COLOR;
            }
            else if (filterdData[index].avgCalculated < MIDDLE_TIER && filterdData[index].avgCalculated >= LOW_TIER){
                filterdData[index].avgStyle = LOW_TIER_COLOR;
            }
        }
        else{
            filterdData[index].avgCalculated = filterdData[index].avg;
            filterdData[index].avgStyle = "";
        }
    }
    
    var handleBarData = {items: filterdData};
    var source   = document.getElementById("za-row").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(handleBarData);
    $(".table tbody").html(html);
    $(".table tbody td.expand").click(expandRow);
    $(".table").tablesort().data('tablesort').sort($("th.avg"), "desc", true);
}

var NEW_YORK = "NEW YORK";
var BROOKLYN = "BROOKLYN";
var CHICAGO = "CHICAGO";
var DETROIT = "DETROIT";

var chicago_url = "https://drive.google.com/open?id=10nPscHlwyz5rTkc9lNgzzyhyfcrUtbRl&usp=sharing"
var nyc_url = "https://drive.google.com/open?id=1thw_xwU_gzCTroVLbOqwmS_-U-PiJ2p7&usp=sharing"
var detroit_url = "https://drive.google.com/open?id=13ekySVR0be3H2rdDda7OCAv1tk_eqze5&usp=sharing"

function showColumns(){
    var filterText = $(".selected").text().trim().toUpperCase();

    if (filterText == DETROIT) {
        $(".infatuation").attr("style", "display: none !important;");
        $(".barstool").attr("style", "display: none !important;");
        $(".yelp").show();
    }
    else if (filterText == CHICAGO) {
        $(".infatuation").show();
        $(".barstool").attr("style", "display: none !important;");
        $(".yelp").show();
    }
    else if (filterText == NEW_YORK || filterText == BROOKLYN) {
        $(".infatuation").show();
        $(".barstool").show();
        $(".yelp").show();
    }

}

function setLinks(){
    var filterText = $(".selected").text().trim().toUpperCase();

    if (filterText == DETROIT) {
        $(".map-all").attr("href", detroit_url);
    }
    else if (filterText == CHICAGO) {
        $(".map-all").attr("href", chicago_url);
    }
    else if (filterText == NEW_YORK || filterText == BROOKLYN) {
        $(".map-all").attr("href", nyc_url);
    }

}

function handleOverflow(){
    $("td.zaisliferecom div").each(function() {
        var cell = $(this).parent();
        if (this.scrollWidth > cell.innerWidth()) {
            cell.addClass("overflow-cell");
        }
        else {
            cell.removeClass("overflow-cell");
        }
    });
    
}

function expandRow(){
    var expandButton = $(this);
    if (expandButton.text().toLowerCase().trim() == "+") {
        expandButton.text("-");
        expandButton.parents("tr").find(".mobile-information").slideDown();
    }
    else {
        expandButton.text("+");
        expandButton.parents("tr").find(".mobile-information").slideUp();
    }
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function showMore(){
    var link = $(this);
    var cell = link.parent();
    
    if (link.text().trim() == "More"){
        cell.addClass("show-more");
        // cell.slideDown();
        link.text("Hide");
    }
    else {
        cell.removeClass("show-more");
        // cell.slideUp();
        link.text("More");        
    }
}