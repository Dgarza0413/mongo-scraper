console.log("connection made");
$(function () {
    // $("i.save-item").on("click", function () {
    $(".card-icon").on("click", function () {
        console.log($(this).attr("data-id"));
        var mongoId = $(this).attr("data-id");
        var icon = $(this).find("i")

        // $.ajax({
        //     method: "GET",
        //     url: "/articles/" + mongoId
        // })
        // .then(function (data) {
        //     console.log(data)
        // })
        if (icon.attr("data-saved") === "false") {
            console.log("saved value is false")
            icon.attr("data-saved", "true")

            // $(this).removeClass("fas fa-heart")
            // $(this).addClass("far fa-heart")
            $.ajax({
                method: "POST",
                url: "/articles/" + mongoId,
                data: { saved: false }
            }).then(function (data) {
                console.log(data);
            })
        } else if (icon.attr("data-saved") === "true") {
            console.log("saved value is true")
            // $(this).removeClass("far fa-heart")
            // $(this).addClass("fas fa-heart")
            // icon.attr("data-saved", "false")

            console.log("this is the newsave data " + icon.attr("data-saved"))
            var newSave = $(this).data("newSave");

            $.ajax({
                method: "POST",
                url: "/articles/" + mongoId,
                data: { saved: true }
            }).then(function (data) {
                console.log(data);
            })
        }
    })
});

    // $.ajax("/articles/")
