var allGameCanvas = [];
var allComponents = [];
var compsInCanvases = [];
var frameRate = 60;
var defaultImages = {
  brokenImage: {
    src: image("brokenImage.png"),
    width: 50,
    height: 50,
  },
  brokenText: {
    src: image("brokenText.png"),
    width: 50,
    height: 50,
  },
};

function setUpNewCanvas() {
  let allCanvases = document.getElementsByTagName("game-canvas");
  var i;
  for (i = 0; i < allCanvases.length; i++) {
    let options = JSON.parse(allCanvases[i].getAttribute("options"));
    window[options.id] = document.createElement("canvas");
    window[options.id].setAttribute("id", options.id);
    window[options.id + "Context"] = window[options.id].getContext("2d");
    allGameCanvas.push(options.id);
    compsInCanvases.push([]);

    let canvas = window[options.id];
    let canvasContext = window[options.id + "Context"];

    canvas.width = options.width;
    canvas.height = options.height;
    canvas.setAttribute("class", options.class || "");
    canvas.style["background-color"] = options.backgroundColor || "#f1f1f1";
    canvas.style["border"] = options.borderColor || "1px #d3d3d3 solid";
    canvas.pointerPos = [0, 0];
    canvas.selectedShape = undefined;
    canvas.addEventListener(
      "mousemove",
      function (event) {
        var scrollLeft =
          window.pageXOffset !== undefined
            ? window.pageXOffset
            : (
                document.documentElement ||
                document.body.parentNode ||
                document.body
              ).scrollLeft;
        var scrollTop =
          window.pageYOffset !== undefined
            ? window.pageYOffset
            : (
                document.documentElement ||
                document.body.parentNode ||
                document.body
              ).scrollTop;

        let x = event.clientX - gameCanvas.offsetLeft + scrollLeft;
        let y = event.clientY - gameCanvas.offsetTop + scrollTop;
        if (x > gameCanvas.width) {
          x = gameCanvas.width;
        }
        if (y > gameCanvas.height) {
          y = gameCanvas.height;
        }
        canvas.pointerPos = [x, y];
        var cursor = "";
        var cursorOn = null;
        var i;
        for (i = 0; i < allComponents.length; i++) {
          if (
            (allComponents[i].options.isAlwaysUseable ||
              allComponents[i].isShowing()) &&
            allComponents[i].mouseOn(canvas.pointerPos[0], canvas.pointerPos[1])
          ) {
            if (allComponents[i].options.clickable) {
              cursor = "pointer";
            }
            if (i != canvas.cursorOn) {
              var j;
              let tempKeys;
              let tempVals;
              if (allComponents[i].tempOnHover) {
                tempKeys = Object.keys(allComponents[i].tempOnHover);
                tempVals = Object.values(allComponents[i].tempOnHover);
                for (j = 0; j < tempKeys.length; j++) {
                  if (allComponents[i][tempKeys[j]] != undefined) {
                    allComponents[i].original[tempKeys[j]] =
                      allComponents[i][tempKeys[j]];
                    allComponents[i][tempKeys[j]] = tempVals[j];
                  } else if (
                    allComponents[i].options[tempKeys[j]] != undefined
                  ) {
                    allComponents[i].original[tempKeys[j]] =
                      allComponents[i].options[tempKeys[j]];
                    allComponents[i].options[tempKeys[j]] = tempVals[j];
                  } else {
                    throw new Error(
                      "The value '" +
                        tempKeys[j] +
                        "' does not exist in Component or Component.options."
                    );
                  }
                }
              }
            }
            cursorOn = i;
          }
        }
        if (cursorOn != canvas.cursorOn) {
          if (canvas.cursorOn != null) {
            let ogKeys = Object.keys(allComponents[canvas.cursorOn].original);
            let ogVals = Object.values(allComponents[canvas.cursorOn].original);

            var i;
            for (i = 0; i < ogKeys.length; i++) {
              if (allComponents[canvas.cursorOn][ogKeys[i]] != undefined) {
                allComponents[canvas.cursorOn][ogKeys[i]] = ogVals[i];
              } else if (
                allComponents[canvas.cursorOn].options[ogKeys[i]] != undefined
              ) {
                allComponents[canvas.cursorOn].options[ogKeys[i]] = ogVals[i];
              }
            }
          }
          if (canvas.cursorOn != cursorOn && cursorOn != null) {
            allComponents[cursorOn].onhover();
          }
        }
        canvas.style.cursor = cursor;
        canvas.cursorOn = cursorOn;
      },
      event
    );
    canvas.addEventListener(
      "mousedown",
      function (event) {
        if (canvas.cursorOn != null) {
          let cursorOn = canvas.cursorOn;
          canvas.cursorDownOn = cursorOn;
          allComponents[cursorOn].ondown();
        } else {
          canvas.cursorDownOn = null;
        }
      },
      event
    );
    canvas.addEventListener(
      "mouseup",
      function (event) {
        if (canvas.cursorOn != null) {
          let cursorOn = canvas.cursorOn;
          if (cursorOn == canvas.cursorDownOn) {
            allComponents[cursorOn].onclick();
          }
        }
      },
      event
    );

    allCanvases[i].appendChild(window[options.id]);
  }
}
function distance(pointOne, pointTwo) {
  var diff = [];
  diff[0] = Math.abs(pointOne[0] - pointTwo[0]);
  diff[1] = Math.abs(pointOne[1] - pointTwo[1]);
  return Math.sqrt(Math.pow(diff[0], 2) + Math.pow(diff[1], 2));
}
function Component(x, y, width, height, options) {
  this.x = x;
  this.y = y;
  this.original = {};
  this.width = width;
  this.height = height;
  this.type = options.type || "rectangle";
  this.options = options || {};
  this.showing = true;
  this.group = options.group || "";
  this.canvas =
    window[options.canvas + "Context"] || window[allGameCanvas[0] + "Context"];
  this.onhover = this.options.onhover || function () {};
  this.tempOnHover = this.options.tempOnHover || "";
  this.ondown = this.options.ondown || function () {};
  this.onclick = this.options.onclick || function () {};
  this.opacity = options.opacity || 1;
  this.options.isAlwaysUseable = this.options.isAlwaysUseable || false;
  this.animationOG = {};

  this.getX = function () {
    if (this.group) {
      return window[this.group].getX() + this.x;
    } else {
      return this.x;
    }
  };
  this.getY = function () {
    if (this.group) {
      return window[this.group].getY() + this.y;
    } else {
      return this.y;
    }
  };
  this.getWidth = function () {
    if (this.group) {
      return window[this.group].getWidth() * this.width;
    }
    return this.width;
  };
  this.getHeight = function () {
    if (this.group) {
      return window[this.group].getHeight() * this.height;
    }
    return this.height;
  };
  this.getScaleX = function () {
    if (this.group) {
      return window[this.group].getWidth();
    }
    return 1;
  };
  this.getScaleY = function () {
    if (this.group) {
      return window[this.group].getHeight();
    }
    return 1;
  };

  this.addToGroup = function (group) {
    this.group = group;
  };
  this.resetAnimation = function () {
    var i;
    var entries = Object.entries(this.animationOG);
    for (i = 0; i < entries.length; i++) {
      if (this[entries[i][0]]) {
        this[entries[i][0]] = entries[i][1];
      } else if (this.options[entries[i][0]]) {
        this.options[entries[i][0]] = entries[i][1];
      }
    }
  };
  this.setPoints = function () {
    this.animationOG = {};
  };
  this.addAnimation = function (name, time, properties, runAfter) {
    runAfter = runAfter || function () {};
    this[name] = (otherRunAfter) => {
      otherRunAfter = otherRunAfter || function () {};
      var i;
      var entries = Object.entries(properties);
      //this.resetAnimation()
      this.animationOG = {};
      for (i = 0; i < entries.length; i++) {
        if (this[entries[i][0]] != undefined) {
          this.animationOG[entries[i][0]] = this[entries[i][0]];
        } else if (this.options[entries[i][0]]) {
          this.animationOG[entries[i][0]] = this.options[entries[i][0]];
        } else {
          return;
        }
      }
      var runTimes = Math.floor((time / 1000) * frameRate);
      for (let i = 0; i < runTimes; i++) {
        setTimeout(() => {
          var j;
          for (j = 0; j < entries.length; j++) {
            if (this[entries[j][0]] != undefined) {
              this[entries[j][0]] -=
                (this.animationOG[entries[j][0]] - entries[j][1]) / runTimes;
              if (i == runTimes - 1) {
                this[entries[j][0]] = entries[j][1];
              }
            } else if (this.options[entries[j][0]]) {
              this.options[entries[j][0]] -=
                (this.animationOG[entries[j][0]] - entries[j][1]) / runTimes;
              if (i == runTimes - 1) {
                this.options[entries[j][0]] = entries[j][1];
              }
            }
          }
          if (i == runTimes - 1) {
            runAfter();
            otherRunAfter();
          }
        }, (1000 / frameRate) * (i + 1));
      }
    };
  };

  this.show = function () {
    this.showing = true;
  };
  this.hide = function () {
    this.showing = false;
  };
  this.toggleShowing = function () {
    if (this.showing) {
      this.hide();
    } else {
      this.show();
    }
  };

  this.isShowing = function () {
    if (this.group) {
      return window[this.group].isShowing() && this.showing;
    }
    return this.showing;
  };

  switch (this.type) {
    case "rectangle":
      this.update = function () {
        if (this.isShowing()) {
          this.canvas.globalAlpha = this.opacity;
          if (this.options.filled == undefined || this.options.filled) {
            this.canvas.fillStyle = this.options.color || "black";
            this.canvas.fillRect(
              this.getX(),
              this.getY(),
              this.getWidth(),
              this.getHeight()
            );
          }
          if (this.options.outline) {
            if (this.options.outlineProperties) {
              this.canvas.strokeStyle =
                this.options.outlineProperties.color || "black";
              this.canvas.lineWidth = this.options.outlineProperties.width || 1;
            }
            this.canvas.strokeRect(
              this.getX(),
              this.getY(),
              this.getWidth(),
              this.getHeight()
            );
          }
        }
      };
      break;

    case "ellipse":
      this.update = function () {
        if (this.isShowing()) {
          this.canvas.globalAlpha = this.opacity;
          if (this.options.outlineProperties) {
            this.canvas.strokeStyle =
              this.options.outlineProperties.color || "black";
            this.canvas.lineWidth = this.options.outlineProperties.width || 1;
          }
          this.canvas.fillStyle = this.options.color || "black";

          this.canvas.beginPath();
          this.canvas.ellipse(
            this.getX(),
            this.getY(),
            this.getWidth() / 2,
            this.getHeight() / 2,
            0,
            0,
            2 * Math.PI
          );

          if (this.options.filled == undefined || this.options.filled) {
            this.canvas.fill();
          }
          if (this.options.outline) {
            this.canvas.stroke();
          }
        }
      };
      break;

    case "text":
      this.update = function () {
        if (this.isShowing()) {
          this.canvas.globalAlpha = this.opacity;
          if (this.options.filled == undefined || this.options.filled) {
          }
          if (this.options.outline) {
            if (this.options.outlineProperties) {
              this.canvas.strokeStyle =
                this.options.outlineProperties.color || "black";
            }
          }
          if (this.options.text) {
            if (Array.isArray(this.options.text)) {
              this.canvas.textAlign = "center";
              var i;
              for (i = 0; i < this.options.text.length; i++) {
                if (this.options.filled || this.options.filled == undefined) {
                  this.canvas.fillStyle = this.options.color || "black";
                  let font = this.options.font || "arial";
                  let modifiers = this.options.fontModifiers || "";
                  let fontSize = (this.options.fontSize || "12") + "px";

                  this.canvas.font = [modifiers, fontSize, font].join(" ");
                  this.canvas.fillText(
                    this.options.text[i],
                    this.getX(),
                    this.getY() + (this.options.fontSize || 12) * i
                  );
                }
              }
            } else {
              this.canvas.textAlign = "center";
              if (this.options.filled || this.options.filled == undefined) {
                this.canvas.fillStyle = this.options.color || "black";
                let font = this.options.font || "arial";
                let modifiers = this.options.fontModifiers || "";
                let fontSize = (this.options.fontSize || "12") + "px";

                this.canvas.font = [modifiers, fontSize, font].join(" ");
                this.canvas.fillText(
                  this.options.text,
                  this.getX(),
                  this.getY()
                );
              }
            }
          } else {
            this.drawBroken();
          }
        }
      };
      this.drawBroken = function () {
        this.canvas.imageSmoothingEnabled = false;
        this.canvas.drawImage(
          defaultImages.brokenText.src,
          this.getX(),
          this.getY(),
          this.getWidth(),
          this.getWidth()
        );
      };
      break;

    case "image":
      this.update = function () {
        if (this.isShowing()) {
          this.canvas.globalAlpha = this.opacity;
          this.canvas.imageSmoothingEnabled = false;
          if (this.options.imageProperties) {
            if (this.options.imageProperties.src) {
              this.canvas.drawImage(
                this.options.imageProperties.src,
                this.options.imageProperties.cropX || 0,
                this.options.imageProperties.cropY || 0,
                this.options.imageProperties.cropWidth ||
                  this.options.imageProperties.src.naturalWidth,
                this.options.imageProperties.cropHeight ||
                  this.options.imageProperties.src.naturalHeight,
                this.getX(),
                this.getY(),
                this.getWidth(),
                this.getHeight()
              );
              //this.canvas.drawImage(this.options.imageProperties.src, this.getX(), this.getY(), this.getWidth(), this.getHeight());
            } else {
              this.canvas.drawImage(
                this.options.imageProperties.src || defaultImages.brokenImage,
                this.getX(),
                this.getY(),
                this.getWidth(),
                this.getHeight()
              );
            }
          } else {
            this.canvas.drawImage(
              this.options.imageProperties.src || defaultImages.brokenImage,
              this.getX(),
              this.getY(),
              this.getWidth(),
              this.getHeight()
            );
          }
          if (this.options.outline) {
            if (this.options.outlineProperties) {
              this.canvas.strokeStyle =
                this.options.outlineProperties.color || "black";
              this.canvas.lineWidth = this.options.outlineProperties.width || 1;
            }
            this.canvas.strokeRect(
              this.getX(),
              this.getY(),
              this.getWidth(),
              this.getHeight()
            );
          }
        }
      };
      this.drawBroken = function () {
        this.canvas.imageSmoothingEnabled = false;
        this.canvas.drawImage(
          defaultImages.brokenImage.src,
          this.getX(),
          this.getY(),
          this.getWidth(),
          this.getWidth()
        );
      };
      break;

    case "custom":
      this.update = function () {
        if (this.isShowing()) {
          this.canvas.fillStyle = this.options.color || "black";
          let allLines = this.options.lines || [];
          var i;
          this.canvas.beginPath();
          this.canvas.moveTo(
            this.options.startPoint[0] * this.getScaleX() + this.getX() || 0,
            this.options.startPoint[1] * this.getScaleY() + this.getY() || 0
          );
          for (i = 0; i < allLines.length; i++) {
            allLines[i].type = "straight";
            switch (allLines[i].type) {
              case "straight":
                this.canvas.lineTo(
                  allLines[i].endPoint[0] * this.getScaleX() + this.getX() || 0,
                  allLines[i].endPoint[1] * this.getScaleY() + this.getY() || 0
                );
                break;
              case "arc":
                this.canvas.arcTo(
                  allLines[i].curvePoint[0] * this.getScaleX() + this.getX() ||
                    0,
                  allLines[i].curvePoint[1] * this.getScaleY() + this.getY() ||
                    0,
                  allLines[i].endPoint[0] * this.getScaleX() + this.getX() || 0,
                  allLines[i].endPoint[1] * this.getScaleY() + this.getY() || 0,
                  allLines[i].radius * this.getScaleY() || 50
                );
                break;
              case "quadratic":
                break;
            }
          }
          this.canvas.lineTo(
            this.options.startPoint[0] * this.getScaleX() + this.getX() || 0,
            this.options.startPoint[1] * this.getScaleY() + this.getY() || 0
          );
          if (this.options.outline) {
            if (this.options.outlineProperties) {
              this.canvas.strokeStyle =
                this.options.outlineProperties.color || "black";
              this.canvas.lineWidth = this.options.outlineProperties || 1;
            } else {
              this.canvas.strokeStyle = "black";
              this.canvas.lineWidth = 1;
            }
            this.canvas.stroke();
          }
          if (this.options.filled == undefined || this.options.filled) {
            this.canvas.fill();
          }
        }
      };
  }

  this.mouseOn = function (x, y) {
    //Mouse Locations
    switch (this.type) {
      case "rectangle":
        var left = this.getX();
        var right = this.getX() + this.getWidth();
        var up = this.getY();
        var down = this.getY() + this.getHeight();

        return x >= left && x <= right && y >= up && y <= down;
        break;

      case "ellipse":
        break;

      case "image":
        var left = this.getX();
        var right = this.getX() + this.getWidth();
        var up = this.getY();
        var down = this.getY() + this.getHeight();

        return x >= left && x <= right && y >= up && y <= down;
        break;

      case "custom":
        break;
    }
    return false;
  };

  //////////////////////
  allComponents.push(this);
}
function Group(x, y, scale, group) {
  this.x = x || 0;
  this.y = y || 0;
  this.scaleX = scale[0] || 1;
  this.scaleY = scale[1] || this.scaleX;
  this.group = group || "";
  this.showing = true;
  this.animationOG = {};

  this.getX = function () {
    if (window[group]) {
      return window[group].getX() + this.x;
    }
    return this.x;
  };
  this.getY = function () {
    if (window[group]) {
      return window[group].getY() + this.y;
    }
    return this.y;
  };
  this.getWidth = function () {
    if (this.group) {
      return window[group].getWidth() * this.scaleX;
    }
    return this.scaleX;
  };
  this.getHeight = function () {
    if (this.group) {
      return window[group].getHeight() * this.scaleY;
    }
    return this.scaleY;
  };

  this.show = function () {
    this.showing = true;
  };
  this.hide = function () {
    this.showing = false;
  };
  this.toggleShowing = function () {
    if (this.showing) {
      this.hide();
    } else {
      this.show();
    }
  };

  this.isShowing = function () {
    var groupShow = true;
    if (this.group) {
      groupShow = window[this.group].isShowing();
    }
    if (!groupShow || !this.showing) {
      return false;
    }
    return true;
  };

  this.resetAnimation = function () {
    var i;
    var entries = Object.entries(this.animationOG);
    for (i = 0; i < entries.length; i++) {
      if (this[entries[i][0]]) {
        this[entries[i][0]] = entries[i][1];
      }
    }
  };
  this.setPoints = function () {
    this.animationOG = {};
  };
  this.addAnimation = function (name, time, properties, runAfter) {
    runAfter = runAfter || function () {};
    this[name] = function (otherRunAfter) {
      otherRunAfter = otherRunAfter || function () {};
      var i;
      var entries = Object.entries(properties);
      //this.resetAnimation()
      this.animationOG = {};
      for (i = 0; i < entries.length; i++) {
        if (this[entries[i][0]] != undefined) {
          this.animationOG[entries[i][0]] = this[entries[i][0]];
        } else {
          return;
        }
      }
      var runTimes = Math.floor((time / 1000) * frameRate);
      for (let i = 0; i < runTimes; i++) {
        setTimeout(() => {
          var j;
          for (j = 0; j < entries.length; j++) {
            if (this[entries[j][0]] != undefined) {
              this[entries[j][0]] -=
                (this.animationOG[entries[j][0]] - entries[j][1]) / runTimes;
              if (i == runTimes - 1) {
                this[entries[j][0]] = entries[j][1];
              }
            }
          }
          if (i == runTimes - 1) {
            runAfter();
            otherRunAfter();
          }
        }, (1000 / frameRate) * (i + 1));
      }
    };
  };
}
function animate() {
  var i;
  for (i = 0; i < allGameCanvas.length; i++) {
    window[allGameCanvas[i] + "Context"].clearRect(
      0,
      0,
      gameCanvas.width,
      gameCanvas.height
    );
    window[allGameCanvas[i] + "Context"].beginPath();
  }
  drawComponents();
}
function drawComponents() {
  var i;
  for (i = 0; i < allComponents.length; i++) {
    allComponents[i].update();
  }
}
function changeFrameRate(newFrameRate) {
  window.clearInterval(updateInterval);
  frameRate = newFrameRate;
  updateInterval = setInterval(animate, 1000 / frameRate);
}
function image(src) {
  let imageCoolPog = new Image();
  imageCoolPog.src = src;
  return imageCoolPog;
}
function horizontalLineAndSegmentIntersect(lineSegment, lineXVal) {
  let slope =
    (lineSegment[0][1] - lineSegment[1][1]) /
    (lineSegment[0][0] - lineSegment[1][0]);
  if (slope == Infinity || slope == -Infinity) {
    slope = Math.abs(slope);
  }
}
var updateInterval = setInterval(animate, 1000 / frameRate);
setUpNewCanvas();
