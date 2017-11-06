(function() {
    function WobbleWindow(object, params) {
        var canvas, ctx;
        var mousePos = { x: 0, y: 0 };
        var isResizing = false;
        var delayId = 0;
        var canvasContent = {};
        var points = {};

        var settings = {};
        settings.name = 'wobblew'; //name
        settings.position = 'relative'; //relative or absolute
        settings.depth = -1; //depth for zIndex
        settings.overflowX = 'visible';
        settings.overflowY = 'visible';
        settings.offsetX = 0; //+ or - value the size of the div
        settings.offsetY = 0; //+ or - value the size of the div
        settings.moveTypeIn = 'move'; //method points follow the mouse
        settings.moveTypeOut = 'wobble'; //method points go back to init position
        settings.wobbleFactor = 0.95; //control the wobble effect
        settings.wobbleSpeed = 0.1; //control the wobble effect
        settings.moveSpeed = 6; //control the move speed
        settings.lineWidth = 1; //lineWidth

        settings.transplantLineColor = false; //true Use Object border-color 
        settings.lineColor = ''; //no value = no line. Use hex/rgba values
        settings.transplantBodyColor = true; //true Use Object background Color
        settings.bodyColor = ''; //no value = no body color. Use hex/rgba values
        settings.radius = 50; //
        settings.pointCountX = 7; //quantity of points horizontal. must be an odd int
        settings.pointCountY = 5; //quantity of points vertical. must be an odd int
        settings.movementLeft = true; //enable/disable movement directions
        settings.movementRight = true; //enable/disable movement directions
        settings.movementTop = true; //enable/disable movement directions
        settings.movementBottom = true; //enable/disable movement directions
        settings.autoResize = true; //if true size will be automatically adjusted
        settings.debug = false; //enable/disable debug mode

        //---
        if (params !== undefined) {
            for (var prop in params) {
                if (params.hasOwnProperty(prop) && settings.hasOwnProperty(prop)) {
                    settings[prop] = params[prop];
                }
            }
        }

        //---
        if (!object) {
            throw Error('\n' + 'No div element found');
        }
        if ((settings.pointCountX % 2) === 0) {
            throw Error('\n' + 'Param pointCountX must be an odd integer');
        }
        if ((settings.pointCountY % 2) === 0) {
            throw Error('\n' + 'Param pointCountY must be an odd integer');
        }
        //---
        HTMLElement.prototype.__defineGetter__("currentStyle", function() {
            return this.ownerDocument.defaultView.getComputedStyle(this, null);
        });
        //---
        function init() {
            canvas = document.createElement('canvas');
            canvas.id = settings.name;
            canvas.style.position = 'absolute';
            canvas.style.zIndex = settings.depth.toString();
            canvas.addEventListener('mousemove', mouseMoveHandler);
            canvas.addEventListener('mouseleave', mouseLeaveHandler);
            ctx = canvas.getContext('2d');

            // element.insertBefore(canvas, element.firstChild);
            object.appendChild(canvas);
            object.style.position = settings.position;
            object.style.zIndex = (settings.depth + 1).toString();
            if (settings.overflowX.length > 0) {
                object.parentElement.style.overflowX = settings.overflowX;
            };
            if (settings.overflowY.length > 0) {
                object.parentElement.style.overflowY = settings.overflowY;
            };
            if (settings.transplantBodyColor) {
                if (object.currentStyle.backgroundColor.length > 0) {
                    settings.bodyColor = object.currentStyle.backgroundColor;
                }
            };
            if (settings.transplantLineColor) {
                if (object.currentStyle.borderColor.length > 0) {
                    settings.lineColor = object.currentStyle.borderColor;
                }
            };
            canvasContent.elementWidth = object.offsetWidth;
            canvasContent.elementHeight = object.offsetHeight;
            //---
            resizeCanvas();
            addWindow();
            animloop();
            //-----------
            if (settings.transplantBodyColor) {
                if (object.currentStyle.backgroundColor.length > 0) {
                    if (object.className.length > 0) {
                        object.className += ' wobbleTransparentBK';
                    } else {
                        object.className = ' wobbleTransparentBK';
                    };
                }
            };
            if (settings.transplantLineColor) {
                if (object.currentStyle.borderColor.length > 0) {
                    if (object.className.length > 0) {
                        object.className += ' wobbleTransparentLine';
                    } else {
                        object.className = ' wobbleTransparentLine';
                    };
                }
            };
        };

        //---
        function resizeCanvas() {
            canvasContent.width = canvasContent.elementWidth + settings.offsetX * 2;
            canvasContent.height = canvasContent.elementHeight + settings.offsetY * 2;

            if (settings.radius > 0) { //round,  ceil
                settings.pointCountX = Math.round(canvasContent.width / settings.radius);
                settings.pointCountY = Math.round(canvasContent.height / settings.radius);
            };
            if (settings.pointCountX % 2 == 0) {
                settings.pointCountX = settings.pointCountX + 1;
            };
            if (settings.pointCountY % 2 == 0) {
                settings.pointCountY = settings.pointCountY + 1;
            };

            points.spaceX = Math.min(canvasContent.elementWidth, canvasContent.width / (settings.pointCountX - 1));
            points.spaceY = Math.min(canvasContent.elementHeight, canvasContent.height / (settings.pointCountY + 1));
            points.radius = Math.ceil(Math.max(points.spaceX, points.spaceY));

            ///--------------new1------------------
            canvasContent.left = 0;
            canvasContent.top = 0;
            settings.canvasWidth = canvasContent.elementWidth;
            if (settings.movementLeft) {
                canvas.style.left = -points.radius + 'px';
                settings.canvasWidth += points.radius;
                canvasContent.left = points.radius - settings.offsetX;
            } else {
                canvas.style.left = -settings.offsetX + 'px';
            };
            if (settings.movementRight)
                settings.canvasWidth += points.radius;

            settings.canvasHeight = canvasContent.elementHeight;
            if (settings.movementTop) {
                canvas.style.top = -points.radius + 'px';
                settings.canvasHeight += points.radius;
                canvasContent.top = points.radius - settings.offsetY;
            } else {
                canvas.style.top = -settings.offsetY + 'px';
            };
            if (settings.movementBottom)
                settings.canvasHeight += points.radius;

            canvas.width = settings.canvasWidth;
            canvas.height = settings.canvasHeight;
        };

        //---
        function addWindow() {
            points.pointHolder = [];
            //---
            var point;
            var flag;
            var i, l;
            //---
            //top
            flag = true;
            for (i = 0, l = settings.pointCountX; i < l; i++) {
                if (settings.movementTop) {
                    if (flag) {
                        point = addPoint(canvasContent.left + i * points.spaceX, canvasContent.top, 0, 0, 0, true, points.spaceX, 'P', settings.debug);
                        flag = false;
                    } else {
                        point = addPoint(canvasContent.left + i * points.spaceX, canvasContent.top, 0, 0, 0, true, points.spaceX, 'C', settings.debug);
                        flag = true;
                    }
                    if (i === 0 || i === l - 1) {
                        point.color = '#00FF00';
                        point.movement = false;
                    }
                    points.pointHolder.push(point);
                } else {
                    if (i === 0 || i === l - 1) {
                        point = addPoint(canvasContent.left + i * points.spaceX, canvasContent.top, 0, 0, 0, false, 0, 'P', settings.debug);
                    }
                    points.pointHolder.push(point);
                }
            }

            //---
            //right
            flag = false;
            for (i = 1, l = settings.pointCountY + 1; i < l; i++) {
                if (settings.movementRight) {
                    if (flag) {
                        point = addPoint(canvasContent.left + canvasContent.width, canvasContent.top + i * points.spaceY, 0, 0, 0, true, points.spaceY, 'P', settings.debug);
                        flag = false;
                    } else {
                        point = addPoint(canvasContent.left + canvasContent.width, canvasContent.top + i * points.spaceY, 0, 0, 0, true, points.spaceY, 'C', settings.debug);
                        flag = true;
                    }
                    points.pointHolder.push(point);
                } else {
                    if (i === 1) {
                        point = addPoint(canvasContent.left + canvasContent.width, canvasContent.top + (i - 1) * points.spaceY, 0, 0, 0, false, 0, 'P', settings.debug);
                    } else if (i === settings.pointCountY) {
                        point = addPoint(canvasContent.left + canvasContent.width, canvasContent.top + (i + 1) * points.spaceY, 0, 0, 0, false, 0, 'P', settings.debug);
                    }
                    points.pointHolder.push(point);
                }
            }

            //---
            //bottom
            flag = true;
            for (i = settings.pointCountX - 1, l = -1; i > l; i--) {
                if (settings.movementBottom) {
                    if (flag) {
                        point = addPoint(canvasContent.left + i * points.spaceX, canvasContent.top + canvasContent.height, 0, 0, 0, true, points.spaceX, 'P', settings.debug);
                        flag = false;
                    } else {
                        point = addPoint(canvasContent.left + i * points.spaceX, canvasContent.top + canvasContent.height, 0, 0, 0, true, points.spaceX, 'C', settings.debug);
                        flag = true;
                    }
                    if (i === 0 || i === settings.pointCountX - 1) {
                        point.color = '#00FF00';
                        point.movement = false;
                    }
                    points.pointHolder.push(point);
                } else {
                    if (i === 0 || i === settings.pointCountX - 1) {
                        point = addPoint(canvasContent.left + i * points.spaceX, canvasContent.top + canvasContent.height, 0, 0, 0, false, 0, 'P', settings.debug);
                    }
                    points.pointHolder.push(point);
                }
            }

            //---
            //left
            flag = false;
            for (i = settings.pointCountY, l = -1; i > l; i--) {
                if (settings.movementLeft) {
                    if (flag) {
                        point = addPoint(canvasContent.left, canvasContent.top + i * points.spaceY, 0, 0, 0, true, points.spaceY, 'P', settings.debug);
                        flag = false;
                    } else {
                        point = addPoint(canvasContent.left, canvasContent.top + i * points.spaceY, 0, 0, 0, true, points.spaceY, 'C', settings.debug);
                        flag = true;
                    }
                    points.pointHolder.push(point);
                } else {
                    if (i === 0) {
                        point = addPoint(canvasContent.left, canvasContent.top + i * points.spaceY, 0, 0, 0, false, 0, 'P', settings.debug);
                    } else if (i === settings.pointCountY) {
                        point = addPoint(canvasContent.left, canvasContent.top + (i + 1) * points.spaceY, 0, 0, 0, false, 0, 'P', settings.debug);
                    }
                    points.pointHolder.push(point);
                }
            }
        }

        //---
        function addPoint(x, y, xp, yp, distance, movement, radius, type, visible) {
            var point = {};
            point.x = x;
            point.y = y;
            point.xp = x;
            point.yp = y;
            point.sx = 0;
            point.sy = 0;
            point.distance = distance;
            point.movement = movement;
            point.radius = radius;
            point.type = type;
            point.visible = visible;
            return point;
        };

        //---
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        function animloop() {
            requestAnimFrame(animloop);
            render();
            if (settings.autoResize) {
                resize();
            }
        };

        //---
        function render() {
            ctx.clearRect(0, 0, settings.canvasWidth, settings.canvasHeight);

            //---
            var windowPoints = points.pointHolder;
            var i, l;

            //---
            ctx.beginPath();
            ctx.moveTo(windowPoints[0].x, windowPoints[0].y);
            for (i = 1, l = windowPoints.length; i < l; i += 2) {
                var point = windowPoints[i];

                //---
                var dx = mousePos.x - point.xp;
                var dy = mousePos.y - point.yp;
                point.distance = Math.sqrt(dx * dx + dy * dy);
                if (point.distance < point.radius) {
                    if (settings.moveTypeIn === 'wobble') {
                        point.sx = point.sx * settings.wobbleFactor + (mousePos.x - point.x) * settings.wobbleSpeed;
                        point.sy = point.sy * settings.wobbleFactor + (mousePos.y - point.y) * settings.wobbleSpeed;
                        point.x = point.x + point.sx;
                        point.y = point.y + point.sy;
                    } else if (settings.moveTypeIn === 'move') {
                        point.x -= (point.x - mousePos.x) / settings.moveSpeed;
                        point.y -= (point.y - mousePos.y) / settings.moveSpeed;
                    }
                } else {
                    if (settings.moveTypeOut === 'wobble') {
                        point.sx = point.sx * settings.wobbleFactor + (point.xp - point.x) * settings.wobbleSpeed;
                        point.sy = point.sy * settings.wobbleFactor + (point.yp - point.y) * settings.wobbleSpeed;
                        point.x = point.x + point.sx;
                        point.y = point.y + point.sy;
                    } else if (settings.moveTypeOut === 'move') {
                        point.x -= (point.x - point.xp) / settings.moveSpeed;
                        point.y -= (point.y - point.yp) / settings.moveSpeed;
                    }
                }

                //---
                var pointBefor = windowPoints[i - 1];
                var pointAfter = windowPoints[i + 1];
                if (i > 2 && i < windowPoints.length - 2) {
                    if (pointBefor.movement) {
                        pointBefor.x = (windowPoints[i - 2].x + point.x) / 2;
                        pointBefor.y = (windowPoints[i - 2].y + point.y) / 2;
                    }
                    if (pointAfter.movement) {
                        pointAfter.x = (windowPoints[i + 2].x + point.x) / 2;
                        pointAfter.y = (windowPoints[i + 2].y + point.y) / 2;
                    }
                }
                ctx.quadraticCurveTo(point.x, point.y, pointAfter.x, pointAfter.y);
            }

            //---
            if (settings.lineColor.length > 0) {
                ctx.lineWidth = settings.lineWidth;
                ctx.strokeStyle = settings.lineColor;
                ctx.stroke();
            }
            if (settings.bodyColor.length > 0) {
                ctx.fillStyle = settings.bodyColor;
                ctx.fill();
            }
            // ctx.globalCompositeOperation = 'source-out';
            // ctx.fillStyle = "rgba(0, 0, 0, 1)";
            // ctx.fill();

            //---
            if (settings.debug) {
                for (i = 0, l = windowPoints.length; i < l; i++) {
                    var point = windowPoints[i];
                    if (point.visible) {
                        if (point.type === 'P') {
                            drawCircle(point.x, point.y, 3, '#FF0000');
                        } else {
                            drawCircle(point.x, point.y, 6, '#FF00FF');
                        }
                        if (point.color) {
                            drawCircle(point.x, point.y, 12, point.color);
                        }
                    }
                }
                ctx.strokeStyle = '#000000';
                ctx.strokeRect(0, 0, settings.canvasWidth, settings.canvasHeight);
            }
        };

        //---
        function delayFlag() {
            resizeCanvas();
            addWindow();
            isResizing = false;
        };

        function resize() {
            if (!isResizing) {
                if (canvasContent.elementWidth !== object.offsetWidth ||
                    canvasContent.elementHeight !== object.offsetHeight) {
                    //-----------
                    isResizing = true;
                    canvasContent.elementWidth = object.offsetWidth;
                    canvasContent.elementHeight = object.offsetHeight;
                    // 防止闪白
                    delayId = window.setTimeout(delayFlag, 10);
                }
            }
        };

        //---
        function drawCircle(x, y, radius, color) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = color;
            ctx.stroke();
        };

        //---
        function mouseMoveHandler(event) {
            mousePos = getMousePos(canvas, event);
        };

        function mouseLeaveHandler(event) {
            mousePos.x = -10000;
            mousePos.y = -10000;
        };

        //---
        function getMousePos(canvas, event) {
            var rect = canvas.getBoundingClientRect();
            return { x: event.clientX - rect.left, y: event.clientY - rect.top };
        };

        //---     
        init();
    };
    window.WobbleWindow = WobbleWindow;
}());
if (typeof jQuery !== 'undefined') {
    (function($) {
        $.fn.wobbleWindow = function(params) {
            var args = arguments;
            return this.each(function() {
                if (!$.data(this, 'plugin_WobbleWindow')) {
                    $.data(this, 'plugin_WobbleWindow', new WobbleWindow(this, params));
                } else {
                    var plugin = $.data(this, 'plugin_WobbleWindow');
                    if (plugin[params]) {
                        plugin[params].apply(this, Array.prototype.slice.call(args, 1));
                    } else {
                        $.error('Method ' + params + ' does not exist on jQuery.wobbleWindow');
                    }
                }
            });
        };
    }(jQuery));
}