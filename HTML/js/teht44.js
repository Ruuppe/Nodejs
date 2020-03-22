$(function () {
    var dialog, form, virhe = $("#virhe"), txtnimi = $("#nimi"), txtosoite = $("#osoite"), asty = $("#asty"),
        asnimi = $("#asnimi"), asosoite = $("#asosoite"), aspostinro = $("#aspostinro"), aspostitmp = $("#aspostitmp"), asasty = $("#asasty"),
        kaikkiKentat = $([]).add(asnimi).add(asosoite).add(aspostinro).add(aspostitmp);

    $.get("http://127.0.0.1:3002/types", function (data) {
        asty.append("<option value=>Ei valintaa</option>");
        $.each(data, function (i, val) {
            asty.append("<option value=" + val.avain + ">" + val.selite + "</option>");
            asasty.append("<option value=" + val.avain + ">" + val.selite + "</option>");
        });
    }, "json").fail(function (data) {
        console.log(data.statusText);
    });

    function fetch() {
        $(".tablerow").remove();
        $.get("http://127.0.0.1:3002/asiakas?nimi=" + txtnimi.val() + "&osoite=" + txtosoite.val() + "&asty_avain=" + asty.val(), function (data) {
            $.each(data, function (i, val) {
                $("#taulu").append("<tr class='tablerow'><td>" + val.avain + "</td><td>" + val.nimi + "</td><td>" + val.osoite +
                    "</td><td>" + val.postinro + "</td><td>" + val.postitmp + "</td><td>" + val.luontipvm + "</td><td>" + val.asty_avain +
                    "</td><td><button id='poista' value=" + val.avain + ">Poista</button></td></tr>");
            });
        }, "json").fail(function (data) {
            console.log(data.statusText);
        });
    }

    $("#hae").click(function () {
        fetch();
    });

    $(document).on("click", "#poista", function () {
        $.ajax({
            type: "DELETE",
            url: "http://127.0.0.1:3002/asiakas/" + $(this).val(),
            success: function () {
                fetch();
            }
        });
    });

    function lisaa() {
        var valid = true;
        kaikkiKentat.removeClass("ui-state-error");
        virhe.text("");

        if (asnimi.val().length < 1) {
            asnimi.addClass("ui-state-error");
            virhe.text("Ei voi olla tyhjä");
            valid = false;
        }
        if (asosoite.val().length < 1) {
            asosoite.addClass("ui-state-error");
            virhe.text("Ei voi olla tyhjä");
            valid = false;
        }
        if (aspostinro.val().length < 1) {
            aspostinro.addClass("ui-state-error");
            virhe.text("Ei voi olla tyhjä");
            valid = false;
        }
        if (aspostitmp.val().length < 1) {
            aspostitmp.addClass("ui-state-error");
            virhe.text("Ei voi olla tyhjä");
            valid = false;
        }
        if (valid) {
            $.post("http://127.0.0.1:3002/asiakas", {
                nimi: asnimi.val(),
                osoite: asosoite.val(),
                postinro: aspostinro.val(),
                postitmp: aspostitmp.val(),
                asty_avain: asasty.val()
            }).done(function () {
                dialog.dialog("close");
                fetch();
            }).fail(function (data) {
                virhe.text(data.statusText);
            });
        }
        return valid;
    }

    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 540,
        width: 350,
        modal: true,
        buttons: {
            "Lisää": lisaa,
            "Peruuta": function () {
                dialog.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
            kaikkiKentat.removeClass("ui-state-error");
            virhe.text("");
        }
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        lisaa();
    });

    $("#lisaa").button().on("click", function () {
        dialog.dialog("open");
    });
});