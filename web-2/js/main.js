$(document).ready(function(){
    initTableData();
    $(".filter-row .filter-item").click(filterRows);
});

// var publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/1o5rqwDvo2Q3-68HTWGC-RMFOx84YRQEBJbvZp-PXRnQ/edit#gid=0";
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
    showTableDataByFilter(defaultCity);
}

function filterRows(){
    var filter = $(this);
    if (filter.hasClass("selected")){
        return;
    }

    $(".selected").removeClass("selected");
    filter.addClass("selected");
    var filterText = filter.text().trim();
    showTableDataByFilter(filterText);
}

function showTableDataByFilter(city){
    var filterdData = _.filter(tableData, function(item){ return item.city.toUpperCase() == city.toUpperCase(); });
    var handleBarData = {items: filterdData};
    var source   = document.getElementById("za-row").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(handleBarData);
    $(".table tbody").html(html);
}
