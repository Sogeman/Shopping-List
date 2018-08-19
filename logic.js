$(document).ready(function () {
    Queries.LoadShoppingList();
});

var products = {}; // global object as fake database in combination with local storage

var ShoppingList = {
    DrawShoppingList: function () {
        $("#product-table").empty();
        var storage = localStorage.getItem("shoppinglist");
        var list = JSON.parse(storage);
        // console.log(list);
        if (list != null) {
            products = list;
        }

        $.each(list, function (key, value) {
            var row = '<tr><td scope="row">' + key + '</td>';
            row += '<td class="text-right">' + value + '</td>';
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
        Events.ClearButton();

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
        });
    }

    , ClearButton: function () {
        $("#clear-button").off().on("click", function (event) {
            event.stopPropagation();
            localStorage.removeItem("shoppinglist");
            Queries.LoadShoppingList();
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
        Queries.LoadShoppingList();
    }

    , SaveEntry: function () {

        var product = String($("#product-entry").val());
        var count = Number($("#count-entry").val() || 1);

        if (!products.hasOwnProperty(product)) {
            products[product] = count
        } else {
            products[product] += count;
        }

        var list = JSON.stringify(products); // makes a string out of products object for local storage
        localStorage.setItem("shoppinglist", list); // stores list in local storage to keep after reload

        Queries.LoadShoppingList();
    }
}