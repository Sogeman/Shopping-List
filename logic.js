$(document).ready(function () {
    
    ShoppingList.DrawShoppingList();
    detachedButton = $('#confirm-sorting-button').detach();
    $("#title").text("Einkaufsliste vom " + objDate.getDate() + ". " + month);
});

var objDate = new Date(),
    locale = "de-de",
    month = objDate.toLocaleString(locale, { month: "long" });

var products = []; // global array as fake database in combination with local storage
var detachedButton;

var ShoppingList = {
    DrawShoppingList: function (sorting) {
        $("#product-table").empty();
        var list;
        
        if (products.length > 0) {
            list = products;
        } else {
            list = Queries.FetchProducts();
        }
        
        if (list.length > 0) {
            $("#list-buttons").css('display', 'flex');
        } else {
            $("#list-buttons").hide();
        }

        $.each(list, function (key, value) {
            var row = '<tr class="list-item"><td scope="row" class="markable ' + value.status + '">' + value.name + '</td>';
            row += '<td class="text-right ' + value.status + '">' + value.count + '</td>';
            row += '<td class="actions">'
            if (sorting) { // fucks up if you switch to fullscreen while sorting on mobile view, don't care for my usage
                row += '<button type="button" class="btn btn-link up-button" data-key="' 
                + key + '"><img src="./up-arrow.png"></button><button type="button" class="btn btn-link down-button" data-key="' 
                + key + '"><img src="./down-arrow.png"></button>';
            } else {
                row += '<button type="button" class="btn btn-link delete-button" data-id="' + value.name + '"><img src="./delete-button.png"></button>';
            }
            row += '</td>';
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
        Events.SortButton();
        Events.ConfirmSortButton();
        Events.MoveEntryUpButton();
        Events.MoveEntryDownButton();
        Events.CleanUpButton();
        // Events.DeleteListButton();
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

    // , DeleteListButton: function () {
    //     $("#delete-list-button").off().on("click", function (event) {
    //         event.stopPropagation();
    //         localStorage.clear();
    //         products = [];
    //         ShoppingList.DrawShoppingList();
    //     });
    // }

    , CleanUpButton: function () {
        $("#cleanup-button").off().on("click", function (event) {
            event.stopPropagation();
            $(".marked").parent().remove();
            products = [];
            var items = $(".list-item");

            items.each((index, listitem) => {
                var itemName = $(listitem).children().eq(0).html();
                var count = Number($(listitem).children().eq(1).html());
                Queries.SaveToProducts(itemName, count);

            });

            Queries.SaveToLocalStorage();
            ShoppingList.DrawShoppingList();
        })
    }

    , SortButton: function () {
        $('#sort-button').off().on("click", function (event) {
            $('#button-insert-point').append(detachedButton);
            $('#confirm-sorting-button').show();
            detachedButton = $('#sort-button').detach();
            ShoppingList.DrawShoppingList(true);
        });
    }

    , ConfirmSortButton: function () {
        $('#confirm-sorting-button').off().on("click", function (event) {
            $('#button-insert-point').append(detachedButton);
            detachedButton = $('#confirm-sorting-button').detach();
            Queries.SaveToLocalStorage();
            ShoppingList.DrawShoppingList();
        });
    }

    , MarkedEntry: function () {
        $(".markable").off().on("click", function (event) {
            event.stopPropagation();
            $(this).toggleClass("marked");
            $(this).siblings(':first').toggleClass("marked");
            var product = $(this).text();
            var i = products.findIndex(p => p.name === product);
            if (products[i].status !== 'marked') {
                products[i].status = 'marked';
            } else {
                products[i].status = '';
            }
            Queries.SaveToLocalStorage();
        });
    }

    , IncreaseButton: function () {
        $("#increase-button").off().on("click", function (event) {
            event.stopPropagation();
            var value = $("#count-entry").val();
            if (value < 99) {
                value++;
            } else {
                value = value;
            }
            $("#count-entry").val(value);
        });
    }

    , DecreaseButton: function () {
        $("#decrease-button").off().on("click", function (event) {
            event.stopPropagation();
            var value = $("#count-entry").val();
            if (value > 1) {
                value--;
            } else {
                value = value;
            }
            $("#count-entry").val(value);
        });
    }

    , MoveEntryUpButton: function () {
        $(".up-button").off().on("click", function (event) {
            index = $(this).data('key');
            Queries.MoveEntry(products, index, index-1);
            ShoppingList.DrawShoppingList(true);
        });
    }

    , MoveEntryDownButton: function () {
        $(".down-button").off().on("click", function (event) {
            index = $(this).data('key');
            Queries.MoveEntry(products, index, index+1);
            ShoppingList.DrawShoppingList(true);
        });
    }
}


var Queries = {

    DeleteEntry: function (product) {

        var i = products.findIndex(p => p.name === product);
        products.splice(i, 1);

        var list = JSON.stringify(products);
        localStorage.setItem("shoppinglist", list);
        ShoppingList.DrawShoppingList();
    }

    , SaveEntry: function () {

        var product = String($("#product-entry").val().trim());
        product = product.replace(/[^a-zA-Z0-9-+. äüöÄÖÜ]/g, "");

        var count = Number($("#count-entry").val() || 1);
        if (count > 99) {
            count = 99;
        };

        Queries.SaveToProducts(product, count);
        Queries.SaveToLocalStorage();
        ShoppingList.DrawShoppingList();
    }

    , SaveToLocalStorage: function () {
        var list = JSON.stringify(products); // makes a string out of products object for local storage
        localStorage.setItem("shoppinglist", list); // stores list in local storage to keep after reload
    }

    , SaveToProducts: function (name, count) {
        var updated = false;
        var productObj = {
            name: name,
            count: count,
            status: ''
        };

        products.find((p, index) => {
            if (p.name === name) {
                products[index]['count'] += count;
                updated = true;
            }
        });

        if (updated === false) {
            products = [...products, productObj];
        }
    }

    , MoveEntry: function (array, oldIndex, newIndex) {
        if (newIndex > array.length || newIndex < 0) {
            return;
        }
        var removedElement = array.splice(oldIndex, 1)[0];
        array.splice(newIndex, 0, removedElement);
            
    }

    , FetchProducts: function () {
        var storage = localStorage.getItem("shoppinglist");
        var list = JSON.parse(storage);
        if (list != null) {
            products = list;
        }
        return list;
    }
}
