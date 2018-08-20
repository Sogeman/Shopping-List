<!doctype html>
<html lang="en">

<head>
    <title>Einkaufsliste</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/js/bootstrap.min.js"></script>
    <script src="logic.js"></script>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="mystyles.css">
</head>

<body>
    <div class="container">

        <div class="row my-3">
            <h5 class="mx-auto">Einkaufsliste vom 
                <?php setlocale(LC_TIME, "de_DE.utf8"); echo date('d. F'); ?> <!-- echo strftime(" %B"); --> <!-- maybe works without strftime, wont know until October-->
            </h5>
        </div>

        <div class="row mt-2">
            <div class="input-group input-group-lg col-9 col-lg 8">
                <input type="text" class="form-control" id="product-entry" placeholder="Produkt eingeben" aria-label="produkt" aria-describedby="basic-addon1">
            </div>
            <div class="input-group input-group-lg col-3 col-lg-2">
                <input type="number" class="form-control" id="count-entry" placeholder="1" min="1" max="99">

            </div>
            <div class="col-12 mt-3 text-center col-lg-2 mt-lg-0 mx-lg-0">
                <button type="button" class="btn btn-success btn-lg" id="save-button"><strong>Speichern</strong></button>
            </div>
        </div>

        <div class="row mt-4 mt-lg-5" id="list-row">

            <table class="table table-dark">
                <thead>
                    <tr>
                        <th class="col-10">Produkt</th>
                        <th>Anzahl</th>
                        <th>Löschen</th>
                    </tr>
                </thead>
                <tbody id="product-table">
                    <!-- Insert point for shopping list item -->
                </tbody>
            </table>
        </div>

        <div class="row mt-3">
            <div class="col-12 mx-auto text-center">
                <button type="button" class="btn btn-danger btn-lg" id="clear-button"><strong>Liste löschen</strong></button>
            </div>
        </div>

    </div>
    <!--Icon made by Juliia Osadcha: https://www.iconfinder.com/icons/1891023/cancel_cercle_close_delete_dismiss_remove_icon -->
</body>

</html>