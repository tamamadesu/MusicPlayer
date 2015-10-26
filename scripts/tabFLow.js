function tabFlow() {
    var e = 0;
    var f = 0;
    var b = 0;
    var c = 0;
    var a = $(".lis_tab_body .song_item").length;
    var d = $(".lis_tab_body").width();
    $(".head_alink a").hammer().on("tap", function() {
        var g = $(this).index();
        if (g !== 2) {
            e = -50 * g + "%";
            f = $(this).position().left;
            Translate($(this).parents(".lis_tab").find(".lis_tab_body"), e);
            Translate($(".head_line"), f + "px");
            $(this).addClass("hot").siblings("a").removeClass("hot")
        }
    });
    // 左右滑动效果
    // $(".lis_tab_body").hammer().bind("panleft",function(g) {
    //     $(this).css({
    //         webkitTransitionDuration: "0s",
    //         transitionDuration: "0s"
    //     });
    //     Translate($(this), c + g.gesture.deltaX + "px")
    // });
    // $(".lis_tab_body").hammer().bind("panright",function(g) {
    //     $(this).css({
    //         webkitTransitionDuration: "0s",
    //         transitionDuration: "0s"
    //     });
    //     Translate($(this), c + g.gesture.deltaX + "px")
    // });
    // $(".lis_tab_body").hammer().bind("panend",function(h) {
    //     $(this).css({
    //         webkitTransitionDuration: "0.3s",
    //         transitionDuration: "0.3s"
    //     });
    //     if (h.gesture.deltaX > 0 && h.gesture.deltaX > d / a / 4) {
    //         b--;
    //         if (b < 0) {
    //             b = 0
    //         }
    //     }
    //     if (h.gesture.deltaX < 0 && h.gesture.deltaX < -d / a / 4) {
    //         b++;
    //         if (b > a - 1) {
    //             b = a - 1
    //         }
    //     }
    //     c = d * -b / a;
    //     Translate($(this), c + "px");
    //     var g = $(".head_alink a").eq(b);
    //     g.addClass("hot").siblings().removeClass("hot");
    //     Translate($(".head_line"), g.position().left + "px");
    // })
};