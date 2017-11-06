//----
var g_TrackParam = {
    left: 0,
    top: 0,
    currentX: 0,
    currentY: 0,
    maxLeft: 0,
    maxTop: 0,
    mouseDown: false,
    bindding: false,
    timerhandle: 0
};
//获取相关CSS属性
var getCss = function(o, key) {
    return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
};

//拖拽的实现
var startDrag = function(trackHandle, track, callback) {
    if (getCss(trackHandle, "left") !== "auto") {
        g_TrackParam.left = getCss(trackHandle, "left");
    }
    if (getCss(trackHandle, "top") !== "auto") {
        g_TrackParam.top = getCss(trackHandle, "top");
    }
    if (getCss(track, "width") !== "auto") {
        g_TrackParam.maxLeft = parseInt(getCss(track, "width")) - parseInt(getCss(trackHandle, "width"));
    }

    var doMouseup = function() {
        g_TrackParam.mouseDown = false;
        if (g_TrackParam.bindding) {
            $("#Scrollbar-Track").removeClass("Scrollbar-Trackhover");
            $("#Scrollbar-Handle").removeClass("Scrollbar-Handlehover");
            if (getCss(trackHandle, "left") !== "auto") {
                g_TrackParam.left = getCss(trackHandle, "left");
            }
            if (getCss(trackHandle, "top") !== "auto") {
                g_TrackParam.top = getCss(trackHandle, "top");
            }
            removeEvent(document, 'mouseup', doMouseup);
            removeEvent(document, 'mousemove', doMousemove);
        }
    };

    var doMousemove = function(event) {
        var e = event ? event : window.event;
        if (g_TrackParam.mouseDown) {
            var nowX = e.clientX,
                nowY = e.clientY;
            var disX = nowX - g_TrackParam.currentX,
                disY = nowY - g_TrackParam.currentY;
            var newPosX = parseInt(g_TrackParam.left) + disX;
            trackHandle.style.left = parseInt(newPosX > 0 ? (newPosX < g_TrackParam.maxLeft ? newPosX : g_TrackParam.maxLeft) : 0) + "px";
            // trackHandle.style.top = parseInt(params.top) + disY + "px";
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (typeof callback == "function") {
                callback(parseInt(g_TrackParam.left) + disX, parseInt(g_TrackParam.top) + disY);
            }
            return false;
        }
    }

    trackHandle.onmousedown = function(event) {
        var e = event ? event : window.event;
        g_TrackParam.currentX = e.clientX;
        g_TrackParam.currentY = e.clientY;
        g_TrackParam.left = trackHandle.style.left;
        g_TrackParam.top = trackHandle.style.top;
        g_TrackParam.mouseDown = true;

        $("#Scrollbar-Track").addClass("Scrollbar-Trackhover");
        $("#Scrollbar-Handle").addClass("Scrollbar-Handlehover");

        addEvent(document, 'mouseup', doMouseup);
        addEvent(document, 'mousemove', doMousemove);

        //防止IE文字选中
        trackHandle.onselectstart = function() {
            return false;
        }
    };
};

function ModifyScrollPos(item) {
    if (g_TrackParam.bindding) {
        var offsetTop = 0;
        var targeRect = item.getBoundingClientRect();
        var width_Totle = item.scrollWidth;
        var jTrack = $("#Scrollbar-Track");
        var jHandle = $("#Scrollbar-Handle");
        if (targeRect.width < width_Totle) {
            var browserHeight = document.documentElement.clientHeight || document.body.clientHeight;
            var trackTop = targeRect.bottom < (browserHeight + offsetTop) ? -100 : browserHeight;
            if (trackTop > 0) {
                trackTop = trackTop > targeRect.top ? trackTop : targeRect.top;

                jTrack.width(targeRect.width);
                jTrack.css("left", targeRect.left);
                jTrack.css("top", trackTop - jTrack.height());

                jHandle.width(parseInt(targeRect.width / width_Totle * targeRect.width));
                jHandle.css("left", parseInt(item.scrollLeft / width_Totle * targeRect.width));
            } else {
                jTrack.css("top", -20);
            }
        } else {
            jTrack.css("top", -20);
        }
    };
}

function UnBindScroll() {
    if (!g_TrackParam.mouseDown ){
      $("#Scrollbar-Track").hide();
      g_TrackParam.bindding = false;
    } else {
      g_TrackParam.timerhandle = setTimeout(function () {
        UnBindScroll();
      },1000)
    }
}

function BindScrollTo(item) {
    if (!g_TrackParam.mouseDown) {
      clearTimeout(g_TrackParam.timerhandle);

      g_TrackParam.bindding = true;

        if ($("#Scrollbar-Track").length == 0)
            $(item).append('<div id="Scrollbar-Track" class="Scrollbar-Track"><div id="Scrollbar-Handle" class="Scrollbar-Handle"></div> </div>')
            //$("body").append('<div id="Scrollbar-Track" class="Scrollbar-Track"><div id="Scrollbar-Handle" class="Scrollbar-Handle"></div> </div>');
        else
          $(item).append($("#Scrollbar-Track"));

        $("#Scrollbar-Track").show();

        window.onscroll = function() {
            ModifyScrollPos(item);
        }
        window.onresize = function() {
            ModifyScrollPos(item);
        }

        $(item).resize(function() {
            ModifyScrollPos(item);
        });

        $(item).scroll(function() {
            ModifyScrollPos(item);
        });

        addEvent(item, 'mousemove', function (e) {
            if (!g_TrackParam.bindding){
              BindScrollTo(item);
            }
        });

      addEvent(item, 'mouseup', function (e) {
        if (!g_TrackParam.bindding){
          BindScrollTo(item);
        }
      });

        ModifyScrollPos(item);

        startDrag($("#Scrollbar-Handle")[0], $("#Scrollbar-Track")[0], function(x, y) {
            var targeRect = item.getBoundingClientRect();
            var width_Totle = item.scrollWidth;
            item.scrollLeft = parseInt(x / targeRect.width * width_Totle);
        });
    }
}
