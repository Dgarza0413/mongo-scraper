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

    $(document).on("click", ".check-note", function () {
        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the p tag
        var thisId = $(this).attr("data-id");

        // Now make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
            // With that done, add the note information to the page
            .then(function (data) {
                console.log(data);
                // The title of the article
                $("#notes").append("<h2>" + data.title + "</h2>");
                // An input to enter a new title
                $("#notes").append("<input id='titleinput' name='title' >");
                // A textarea to add a new note body
                $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
                // A button to submit a new note, with the id of the article saved to it
                $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

                // If there's a note in the article
                if (data.note) {
                    // Place the title of the note in the title input
                    $("#title-input").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#body-input").val(data.note.body);
                }
            });
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