/**
 * Created by libo on 2017/11/9.
 */
 var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var defaults = {
    lines: 12,
    length: 7,
    width: 5,
    radius: 10,
    scale: 1.0,
    corners: 1,
    color: '#000',
    fadeColor: 'transparent',
    animation: 'spinner-line-fade-default',
    rotate: 0,
    direction: 1,
    speed: 1,
    zIndex: 2e9,
    className: 'spinner',
    top: '50%',
    left: '50%',
    shadow: '0 0 1px transparent',
    position: 'absolute',
};
var Spinner = /** @class */ (function () {
    function Spinner(opts) {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign(__assign({}, defaults), opts);
    }
    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target by calling
     * stop() internally.
     */
    Spinner.prototype.spin = function (target) {
        this.stop();
        this.el = document.createElement('div');
        this.el.className = this.opts.className;
        this.el.setAttribute('role', 'progressbar');
        css(this.el, {
            position: this.opts.position,
            width: 0,
            zIndex: this.opts.zIndex,
            left: this.opts.left,
            top: this.opts.top,
            transform: "scale(" + this.opts.scale + ")",
        });
        if (target) {
            target.insertBefore(this.el, target.firstChild || null);
        }
        drawLines(this.el, this.opts);
        return this;
    };
    /**
     * Stops and removes the Spinner.
     * Stopped spinners may be reused by calling spin() again.
     */
    Spinner.prototype.stop = function () {
        if (this.el) {
            if (typeof requestAnimationFrame !== 'undefined') {
                cancelAnimationFrame(this.animateId);
            }
            else {
                clearTimeout(this.animateId);
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
            this.el = undefined;
        }
        return this;
    };
    return Spinner;
}());
// export { Spinner };
/**
 * Sets multiple style properties at once.
 */
function css(el, props) {
    for (var prop in props) {
        el.style[prop] = props[prop];
    }
    return el;
}
/**
 * Returns the line color from the given string or array.
 */
function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length];
}
/**
 * Internal method that draws the individual lines.
 */
function drawLines(el, opts) {
    var borderRadius = (Math.round(opts.corners * opts.width * 500) / 1000) + 'px';
    var shadow = 'none';
    if (opts.shadow === true) {
        shadow = '0 2px 4px #000'; // default shadow
    }
    else if (typeof opts.shadow === 'string') {
        shadow = opts.shadow;
    }
    var shadows = parseBoxShadow(shadow);
    for (var i = 0; i < opts.lines; i++) {
        var degrees = ~~(360 / opts.lines * i + opts.rotate);
        var backgroundLine = css(document.createElement('div'), {
            position: 'absolute',
            top: -opts.width / 2 + "px",
            width: (opts.length + opts.width) + 'px',
            height: opts.width + 'px',
            background: getColor(opts.fadeColor, i),
            borderRadius: borderRadius,
            transformOrigin: 'left',
            transform: "rotate(" + degrees + "deg) translateX(" + opts.radius + "px)",
        });
        var delay = i * opts.direction / opts.lines / opts.speed;
        delay -= 1 / opts.speed; // so initial animation state will include trail
        var line = css(document.createElement('div'), {
            width: '100%',
            height: '100%',
            background: getColor(opts.color, i),
            borderRadius: borderRadius,
            boxShadow: normalizeShadow(shadows, degrees),
            animation: 1 / opts.speed + "s linear " + delay + "s infinite " + opts.animation,
        });
        backgroundLine.appendChild(line);
        el.appendChild(backgroundLine);
    }
}
function parseBoxShadow(boxShadow) {
    var regex = /^\s*([a-zA-Z]+\s+)?(-?\d+(\.\d+)?)([a-zA-Z]*)\s+(-?\d+(\.\d+)?)([a-zA-Z]*)(.*)$/;
    var shadows = [];
    for (var _i = 0, _a = boxShadow.split(','); _i < _a.length; _i++) {
        var shadow = _a[_i];
        var matches = shadow.match(regex);
        if (matches === null) {
            continue; // invalid syntax
        }
        var x = +matches[2];
        var y = +matches[5];
        var xUnits = matches[4];
        var yUnits = matches[7];
        if (x === 0 && !xUnits) {
            xUnits = yUnits;
        }
        if (y === 0 && !yUnits) {
            yUnits = xUnits;
        }
        if (xUnits !== yUnits) {
            continue; // units must match to use as coordinates
        }
        shadows.push({
            prefix: matches[1] || '',
            x: x,
            y: y,
            xUnits: xUnits,
            yUnits: yUnits,
            end: matches[8],
        });
    }
    return shadows;
}
/**
 * Modify box-shadow x/y offsets to counteract rotation
 */
function normalizeShadow(shadows, degrees) {
    var normalized = [];
    for (var _i = 0, shadows_1 = shadows; _i < shadows_1.length; _i++) {
        var shadow = shadows_1[_i];
        var xy = convertOffset(shadow.x, shadow.y, degrees);
        normalized.push(shadow.prefix + xy[0] + shadow.xUnits + ' ' + xy[1] + shadow.yUnits + shadow.end);
    }
    return normalized.join(', ');
}
function convertOffset(x, y, degrees) {
    var radians = degrees * Math.PI / 180;
    var sin = Math.sin(radians);
    var cos = Math.cos(radians);
    return [
        Math.round((x * cos + y * sin) * 1000) / 1000,
        Math.round((-x * sin + y * cos) * 1000) / 1000,
    ];
}




 window.onload = function(){
    /*
     * 1.????????????  ?????????  ????????????  ????????????????????????
     * 2.????????????????????????????????????????????????  ??????????????????  ?????????????????????
     * 3.???????????????????????????????????????   touch??????  ???????????????????????? ?????????????????????????????????css3???
     * 4.???????????????????????????????????????????????????  ??????????????????  ?????????????????????
     * 5.?????????????????????????????????  ?????? ?????? ????????????????????????  ????????????????????? ??????????????????????????????????????????
     * */
    
    var imageList = ["","",""];
    var test = window.location.href;
    var str_after = test.split("=")[1];
    console.log(str_after);
    var opts = {
        lines: 13, // ????????????
         length: 15, // ????????????
         width: 5, // ????????????
         radius: 14, // ?????????????????????
         scale: 1,
        corners: 1, // ??????????????? (0-1)
         color: '#000', // ????????????
         opacity: 0.25,
        rotate: 0, // ??????????????????
         direction: 1, // ?????????????????? 1: ?????????, -1: ?????????
         speed: 1, // ??????????????????
         trail: 60, // ????????????????????????(?????????)
         zIndex: 2e9, // spinner???z??? (?????????2000000000)
         className: 'spinner', // spinner css ????????????
         top: '375px', // spinner ???????????????Top?????? ?????? px
         left: '50%', // spinner ???????????????Left?????? ?????? px
         shadow: false, // ????????????????????????
         hwaccel: false, //spinner ??????????????????????????????????????? 
         position: 'absolute'
        };
    var target = document.getElementById('loading');
    console.log(target)
    
    var spinner = new Spinner(opts).spin(target);

    $.ajax({
            type:"post",
            url:"https://z9alk1vin0.execute-api.ap-northeast-1.amazonaws.com/get/",
            data:JSON.stringify({productNo:str_after}),
            dataType: "json",
            contentType: "application/json",
            async:true,
            success:function(data){
                console.log(data)
                spinner.spin();
                document.getElementById("goodname_en").innerHTML = data["Items"][0]["productEnName"];
                document.getElementById("goodname").innerHTML = data["Items"][0]["productChName"];
                document.getElementById("goodnum").innerHTML = "("+data["Items"][0]["productNo"]+")";
                imageList = eval(data["Items"][0]["image"]);
                for (var i = 0; i < imageList.length; i++) {
                    $('#sdimage').append('<li><a ><img  src= '+"https://2021reactapp0818a8cb7d7dcbdf4d99a2f6e7e64270337152331-dev.s3.ap-northeast-1.amazonaws.com/public/"+imageList[i]+' id = '+"tuu" + i+'></a></li>');
                    if (i > 0) {
                        $('#dot').append('<li></li>');  
                    }
                }
                document.getElementById("authimage").src = "image/na_btn.png";
                document.getElementById("auth").innerHTML = "??????";
                //??????????????????
                var banner = document.querySelector('.banner');
                //???????????????
                var width = banner.offsetWidth;
                //????????????
                var imageBox = banner.querySelector('ul:first-child');
                //?????????
    
                var pointBox = banner.querySelector('ul:last-child');

                //???????????????

                var images = imageBox.querySelectorAll('li');
                //????????????

                var points = pointBox.querySelectorAll('li');
                var imageCount = images.length; //?????????????????????????????????5????????????
                //????????????
                //?????????
                var addTransition = function(){
                    imageBox.style.transition = "all 0.3s";
                    imageBox.style.webkitTransition = "all 0.3s";/*?????????*/
                };
                //????????????
                var removeTransition = function(){
                    imageBox.style.transition = "none";
                    imageBox.style.webkitTransition = "none";
                }
                //??????
                var setTranslateX = function(translateX){
                    imageBox.style.transform = "translateX("+translateX+"px)";
                    imageBox.style.webkitTransform = "translateX("+translateX+"px)";
                }

                //????????????
                //????????????  ?????????  ????????????  ????????????????????????
                var index = 0;
                var timer = setInterval(function(){
                    
                    //????????????  ????????????????????????  transition transform translate
                    addTransition();    //???????????????
                    setTranslateX(-index * width);  //??????
                    index++;   //????????????????????????
                },2000);

                //???????????????????????????????????????
                my.transitionEnd(imageBox, function(){
                //????????????????????????????????????
                if(index > imageCount-1){
                    index = 0;
                }else if(index <= 0){
                    index = imageCount - 1;
                }
                removeTransition(); //????????????
                setTranslateX(-index * width);  //??????
                setPoint(); //?????????????????????????????????????????????
            });

            //??????????????????  ?????????????????????
            var setPoint = function(){
                //??????????????????now
                for(var i = 0 ; i < points.length ; i++){
                    points[i].className = " ";
                }
                //?????????????????????????????????
                    points[index].className = "now";
        
            }

            /*
            ???????????????????????????????????????   touch??????  ???????????????????????? ?????????????????????????????????css3???
            ???????????????????????????????????????????????????  ??????????????????  ?????????????????????
            ?????????????????????????????????  ?????? ?????? ????????????????????????  ????????????????????? ??????????????????????????????????????????
            */
            //touch??????
            var startX = 0; //????????????  ??????????????????????????? x?????????
            var moveX = 0;  //???????????????x?????????
            var distanceX = 0;  //???????????????
            var isMove = false; //???????????????

            imageBox.addEventListener('touchstart', function(e){
                clearInterval(timer);   //???????????????
                startX = e.touches[0].clientX;  //????????????X
            });

            imageBox.addEventListener('touchmove',function(e){
                moveX = e.touches[0].clientX;   //???????????????X
                distanceX = moveX - startX; //?????????????????????
                //??????????????????  -index*width+distanceX
                removeTransition(); //????????????
                setTranslateX(-index * width + distanceX);  //???????????????
                isMove = true;  //???????????????
            });

            //?????????????????????????????????????????? ???????????????  ??????????????????????????????window
            imageBox.addEventListener('touchend', function(e){
                // ???????????? 1/3 ?????????????????????????????????????????????????????????
                if(isMove && Math.abs(distanceX) > width/3){
                    //5.?????????????????????????????????  ?????? ?????? ????????????????????????  ?????????????????????*/
                    if(distanceX > 0){  //?????????
                        index --;
                    }
                    else{   //?????????
                        index ++;
                    }
                }
                addTransition();    //???????????????
                setTranslateX(-index * width);    //??????
                if(index > imageCount ){
                    index = 0;
                }else if(index <= 0){
                    index = imageCount-1;
                }
                setPoint();
                //????????????
                startX = 0;
                moveX = 0;
                distanceX = 0;
                isMove = false;
                //????????????
                clearInterval(timer);   //?????? ????????????????????????
                timer= setInterval(function(){
                    index++ ;  //????????????????????????
                    addTransition();    //???????????????
                    setTranslateX(-index * width);    //??????
                },3000);
            });


            },error:function(data){
               
            }
        });
    
};