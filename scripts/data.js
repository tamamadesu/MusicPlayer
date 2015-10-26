$(function() {

	// 初始化变量
    var a = 0;
    var e = $(".content").length;
    var c = $(".content").width();
    var b = 15;
    var d = "<audio id='audioPlayer'></audio>";
    $(".play_wrap").append(d);

    // 遍历频道，填充到页面中
    WJ.get(DB_api.channels,function(l) {

    	// 频道列表初始化
        var h = l.data.channels;
        var f = l.data.channels.length;
        var m = "";
        var k = null;
        var j = null;
        // 频道遍历填充
        for (var g = 0; g < f; g++) {
            m += "<li><a href='javascript:void(0);' class='ch_item'><div class='ch_info_front rs_slide_front'><img src='" + h[g].banner + "' alt='" + h[g].name + "'></div><div class='ch_info_back rs_slide_back'><p class='back_word'>" + h[g].intro + "</p></div></a></li>"
        }
        $(".ch_wrapper ul").append(m);

        // 截取每个频道文字介绍
        $(".ch_wrapper li").each(function() {
            var i = $(this).find(".back_word");
            if (i.text().length > b) {
                i.text(i.text().substr(0, 15));
            }
        });

        // 页面加载动画
        $(".ch_wrapper").addClass("rt_flow");
        var k = setTimeout(function() {
            $(".ch_wrapper li:even").find(".ch_item").addClass("hot")
        },700);
        var j = setTimeout(function() {
            $(".ch_wrapper li:odd").find(".ch_item").addClass("hot")
        },1200);
        $(".ch_item").hammer().on("pan", function(i) {
            if ($(this).hasClass("hot")) {
                $(this).removeClass("hot")
            } else {
                $(this).addClass("hot")
            }
        });

        // 点击每个频道进入相应的歌曲列表
        $(".ch_wrapper li .ch_item").hammer().on("tap",function() {
            $(".banner_bg,.rmg_block,.song_list,.info_mark_wrap,.info_tit,.info_con").html("");
            var q = $(this);
            var p = $(this).parent().index();
            var i = [];
            var o = q.find(".ch_info_front img").clone(true);
            var n = h[p].name;
            var r = h[p].intro;
            WJ.get(DB_api.song_list + "&channel=" + p,function(v) {
                var t = v.song;
                var s = v.song.length;
                var w = "";
                for (var u = 0; u < s; u++) {
                    w += "<li><a href='javascript:void(0);'><span class='song_name'>" + t[u].title + "<br><i class='people_name'>" + t[u].artist + "</i></a></li>";
                    i.push(t[u].url)
                }
                $(".banner_bg,.rmg_block").append(o);
                $(".song_list").append(w);
                $(".info_mark_wrap").append("<span class='mark_bg'>" + n + "</span>");
                $(".info_tit").append(r);
                $(".info_con").append(r);
                a++;
                container_flow(q.parents(".container"), -c * a);
                tabFlow();

                // 点击歌曲进行播放
                $(".song_list li,.play_random").hammer().on("tap",function() {

                    var x = $(this).index();
                    play_control("audioPlayer", i, t, x, s);

                    // 点击播放暂停
                    $(".broadcast_btn").hammer().on("tap",function() {
                        var y = 0;
                        var z = 0;
                        if ($(this).hasClass("play")) {
                            $(this).removeClass("play").addClass("stop");
                            Audio.pause();
                            y = 0;
                            z = Audio.current_t / 20 * 360;
                            song_pic_rotate($(".play_pic img"), y, z);
                            console.log(1);
                        } else {
                            $(this).removeClass("stop").addClass("play");
                            Audio.play();
                            y = Audio.duration_t - Audio.current_t;
                            z = (Audio.duration_t - Audio.current_t) / 20 * 360;
                            song_pic_rotate($(".play_pic img"), y, z);
                        }
                    });

                    // 播放上一首
                    $(".pre_btn").hammer().on("tap",function() {
                        $(".play_pic").addClass("fmg_slideX");
                        setTimeout(function() {
                            $(".play_pic").removeClass("fmg_slideX");
                            x--;
                            if (x < 0) {
                                x = s - 1
                            }
                            play_control("audioPlayer", i, t, x, s)
                        },
                        700)
                    });

                    // 播放下一首
                    $(".next_btn").hammer().on("tap",function() {
                        $(".play_pic").addClass("zmg_slideX");
                        setTimeout(function() {
                            $(".play_pic").removeClass("zmg_slideX");
                            x++;
                            if (x > s - 1) {
                                x = 0
                            }
                            play_control("audioPlayer", i, t, x, s)
                        },
                        700)
                    });

                    // 顺序播放
                    $(".play_random").hammer().on("tap",function() {
                        play_control("audioPlayer", i, t, 0, s)
                    });

                    // 页面整体滑动动画
                    a++;
                    container_flow(q.parents(".container"), -c * a);
                    $(".container").hammer().bind("panend",function(y) {
                        if (y.gesture.deltaX > 0) {
                            a--;
                            if (a < 0) {
                                a = 0
                            }
                        }
                        if (y.gesture.deltaX < 0) {
                            a++;
                            if (a > e - 1) {
                                a = e - 1
                            }
                        }
                        container_flow($(".container"), -c * a);
                    })
                })
            })
        })
    })
});

function play_control(c, f, g, h, i) {
    var d = 0;
    var a = 0;
    clearTimeout(e);
    clearInterval(b);
    $(".play_pic").html("");
    Audio.init(c, f[h]);
    Audio.play(f[h]);
    $(".play_pic").append("<img>");
    $(".play_pic img").attr({
        src: g[h].picture,
        alt: g[h].title
    });

    var e = setTimeout(function() {
        a = Audio.duration_t;
        d = Audio.duration_t / 20 * 360;
        song_pic_rotate($(".play_pic img"), a, d);
        $(".duration_t").text(addZero(parseInt(a / 60)) + ":" + addZero(parseInt(a % 60)))
    },1000);

    var b = setInterval(function() {
        var k = Audio.current_t;
        if (k === Audio.duration_t) {
            h = h + 1;
            if (h > i - 1) {
                h = 0
            }
            play_control(c, f, g, h, i)
        }
        var j = k / a * $(".time_line").width();
        $(".current_t").text(addZero(parseInt(k / 60)) + ":" + addZero(parseInt(k % 60)));
        $(".time_hot_line").css("width", j + "px");
        $(".drag_ico").css("left", j + "px")
    },1000);
}

function song_pic_rotate(b, c, a) {
    b.css({
        webkitTransitionDuration: c + "s",
        TransitionDuration: c + "s",
        webkitTransform: "rotate(" + a + "deg)",
        transform: "rotate(" + a + "deg)"
    })
}

function container_flow(c, b) {
    Translate(c, b + "px");
}

function addZero(a) {
    if (a >= 0 && a <= 9) {
        return a = "0" + a
    } else {
        return a
    }
}

function Translate(b, a) {
    b.css({
        "-webkit-transform": "perspective(800px) translate(" + a + ")",
        "-moz-transform": "perspective(800px) translate(" + a + ")",
        transform: "perspective(800px) translate(" + a + ")"
    })
}

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
}