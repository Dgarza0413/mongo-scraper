console.log("connection made");
$(function () {
    $(document).on("click", ".card-icon", function () {
        var mongoId = $(this).attr("data-id");
        var saved = $(this).attr("data-saved")

        if (saved === "false") {
            $.ajax({
                method: "PUT",
                url: "/articles/saved/" + mongoId,
            }).then((data) => {
                console.log(data);
            })
        }
        if (saved === "true") {
            $.ajax({
                method: "PUT",
                url: "/articles/unsaved/" + mongoId,
            }).then((data) => {
                console.log(data);
            })
        }
    })
    $(document).on("click", ".bookmark", function () {
        var id = $(this).attr("data-id")
        console.log(id);
        $("#note-modal").show();
        $("#submit-button").attr("data-id", id)
    });

    $(document).on("click", "span.close", function () {
        $("#note-modal").hide();
    });

    $(document).on("click", "#submit-button", function () {
        var mongoId = $("#submit-button").attr("data-id")
        console.log(this)
        debugger;
        $.ajax({
            method: "POST",
            url: "/articles/" + mongoId,
            data: {
                title: $("#title-input").val(),
                body: $("#body-input").val()
            }
        }).then(function (data) {
            console.log(data);
            window.location.replace("/");
        });

        $("#title-input").val("");
        $("#body-input").val("");
    });

});