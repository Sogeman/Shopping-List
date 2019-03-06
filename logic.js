$(document).ready(function () {
    Queries.LoadShoppingList();
    $("#title").text("Einkaufsliste vom "+ objDate.getDate() +". "+ month); 
});

var objDate = new Date(),
    locale = "de-de",
    month = objDate.toLocaleString(locale, { month: "long" });

var products = {}; // global object as fake database in combination with local storage

var ShoppingList = {
    DrawShoppingList: function () {
        $("#product-table").empty();
        var storage = localStorage.getItem("shoppinglist");
        var list = JSON.parse(storage);
        if (list != null) {
            products = list;
        }

        $.each(list, function (key, value) {
            var row = '<tr class="list-item ' + value.status + '"><td scope="row">' + key + '</td>';
            row += '<td class="text-right">' + value.count + '</td>';
            row += '<td><button type="button" class="btn btn-link delete-button" data-id="' + key + '"><img src="delete-button.png"></button></td>';
            row += '</tr>';
            $("#product-table").append(row);
        });

        Events.Initialize(); // add events back
    }
}

var Events = {

    Initialize: function () {


        Events.SaveButton();
        Events.SubmitWithEnter();
        Events.DeleteButton();
        Events.CleanUpButton();
        Events.DeleteListButton();
        Events.MarkedEntry();
        Events.IncreaseButton();
        Events.DecreaseButton();

        $("#product-entry").val("");
        $("#count-entry").val("1");
    }

    , SubmitWithEnter: function () {
        $("body").off().on("keyup", function (event) {
            event.stopPropagation();
            if (event.which == 13) {
                $("body").off();
                if ($("#product-entry").val() != "") {
                    $("#product-entry").css("border", "");
                    Queries.SaveEntry();
                } else {
                    $("#product-entry").css("border", "3px solid red");
                    Events.SubmitWithEnter();
                }
            }
        });
    }

    , SaveButton: function () {
        $("#save-button").off().on("click", function (event) {
            event.stopPropagation();
            $("#save-button").off();
            if ($("#product-entry").val() != "") { // if entry isn't empty on submit, remove red border
                $("#product-entry").css("border", "");
                Queries.SaveEntry();
            } else { // if input is empty on submit, add red border and do nothing
                $("#product-entry").css("border", "3px solid red");
                Events.SaveButton();
            }
        });
    }

    , DeleteButton: function () {
        $(".delete-button").off().on("click", function (event) {
            event.stopPropagation();
            var product = $(this).data('id'); // reads data-id attribute from the delete button
            Queries.DeleteEntry(product);
            $(this).closest("tr").remove();
        });
    }

    , DeleteListButton: function () {
        $("#delete-list-button").off().on("click", function (event) {
            event.stopPropagation();
            localStorage.clear();
            products = {};
            Queries.LoadShoppingList();
        })
    }
    
    , CleanUpButton: function () {
        $("#cleanup-button").off().on("click", function (event) {
            event.stopPropagation();
            $(".marked").remove();
            products = {};
            var items = $(".list-item");
            items.each( function( index, listitem){
   		 var item = $(listitem).children().eq(0).html();
   		 var count = Number($(listitem).children().eq(1).html());
   		 
   		 if (!products.hasOwnProperty(item)) {
            		products[item] = {count: count};
       		 } else {
           		products[item].count += count;
        	 }
	    });
	    
        Queries.SaveToLocalStorage();
        Queries.LoadShoppingList();
        })
    }

    , MarkedEntry: function () {
        $("tbody tr").off().on("click", function (event) {
            event.stopPropagation();
            $(this).toggleClass("marked");
            let product = $(this).children(":first").text();
            if (products[product].status !== 'marked') {
                products[product].status = 'marked';
            } else {
                products[product].status = '';
            }
            Queries.SaveToLocalStorage();
        })
    }
    
    , IncreaseButton: function () {
        $("#increase-button").off().on("click", function (event) {
            event.stopPropagation();
            var value = $("#count-entry").val();
            if(value < 99) {
            	value++;
            } else {
            	value = value;
            }
            $("#count-entry").val(value);
        })
    }
    
    , DecreaseButton: function () {
        $("#decrease-button").off().on("click", function (event) {
            event.stopPropagation();
            var value = $("#count-entry").val();
            if(value > 1) {
            	value--;
            } else {
            	value = value;
            }
            $("#count-entry").val(value);
        })
    }
}


var Queries = {

    LoadShoppingList: function () {
        ShoppingList.DrawShoppingList();
    }

    , DeleteEntry: function (product) {

        delete products[product]; // deletes property with the same name as the clicked data-id on delete button

        var list = JSON.stringify(products);
        localStorage.setItem("shoppinglist", list)
    }

    , SaveEntry: function () {

        var product = String($("#product-entry").val().trim());
        product = product.replace(/[^a-zA-Z0-9-+. äüöÄÖÜ]/g,"");
        
        var count = Number($("#count-entry").val() || 1);
        if (count > 99) { 
           count = 99;
        };

        if (!products.hasOwnProperty(product)) {
            products[product] = {count: count};
        } else {
            products[product].count += count;
        }

        Queries.SaveToLocalStorage();
        Queries.LoadShoppingList();
    }

    , SaveToLocalStorage: function () {
        var list = JSON.stringify(products); // makes a string out of products object for local storage
        localStorage.setItem("shoppinglist", list); // stores list in local storage to keep after reload
    }
}
