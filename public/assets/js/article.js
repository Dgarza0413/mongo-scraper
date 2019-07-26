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
});