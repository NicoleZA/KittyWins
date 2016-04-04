var frameModule = require("ui/frame");
var gestures = require("ui/gestures");
var observable = require("data/observable");
var custom = require("custom");
var StackLayoutModule = require("ui/layouts/stack-layout")
var LabelModule = require("ui/label");
var ImageModule = require("ui/image");
var orientationModule = require("nativescript-screen-orientation");
var absoluteLayoutModule = require("ui/layouts/absolute-layout");
var timer = require("timer");
var sound = require("nativescript-sound");
var platformModule = require("platform");


var viewModel = (function (_super) {
    __extends(viewModel, _super);

    var me = null;
    var page = null;
    var kitty = null;
    var move = 0;
    var waiting = 0;
    var pos = 300;  //100
    var last = "right";
    var alt = false;
    var fridgeLeft = 60; //20
    var fridgeRight = 335; //145
    var counterLeft = 600; //200
    var floorHeight = 720; //240
    var counterHeight = 390; //130
    var fridgeHeight = 150; //50
    var ceilingHeight = 0;
    var height = 0;
    var endHeight = 0;
    var found = 0;
    
    var fish1Pos = 90; //30
    var fish2Pos =600; //200
    var pelletPos = 900; //300
    var controlHeight = 780; //260
    var leftPos = 0;
    var rightPos = 80; //240
    var jumpPos = 550; //1650
     var time = new Date();
     
     var screenWidth = 0;
     var screenHeight = 0;
     var widthScale = 0;
     var heightScale = 0;
     var stepHorizontal = 1;
     var stepVertical = 1;
     var isInit = false;

    //constructor
    function viewModel(args) {
        _super.call(this);
        me = this;
        page = args;
         isInit = false;
         found = 0;
        timer.setTimeout(me.CheckTimer, 500);
    };
 
      viewModel.prototype.moveLeft = function (args) {
         if(move == "jump" || move == "fall") return;
         move = (args.action == "up" ? "" : "left");
     }
     
     viewModel.prototype.moveRight = function (args) {
         if(move == "jump" || move == "fall") return;
         move = (args.action == "up" ? "" : "right");
     }
 
       viewModel.prototype.jump = function (args) {
        switch(height) {
            case floorHeight:
                endHeight = counterHeight;
                move = "jump";
                break;
            case counterHeight:
                endHeight = fridgeHeight; 
                move = "jump";
               break;
             case fridgeHeight:
                endHeight = counterHeight;
                move = "fall";
                break;
        }
     }
     
     viewModel.prototype.touchKitty = function (args) {
        sound.create("~/img/purr.mp3").play();
     }

      viewModel.prototype.CheckTimer = function (args) {
        if (found == 3) return;
        if (!isInit) me.Init();
        timer.setTimeout(me.CheckTimer, 10);
        switch(move) {
            case "":
                waiting += 1;
                if(waiting > 800) {
                   kitty.src= (last == "left" ? "~/img/KittySitLeft.png" : "~/img/KittySitRight.png") ;
                   sound.create("~/img/meow-short.mp3").play();
                    waiting = 0;
                }
                   break;
            case "left":
              waiting = 0;
              last = "left";
              pos -= stepHorizontal;
              if(pos < 0) pos = 0;
              if (height == fridgeHeight && pos < fridgeLeft) {
                  endHeight = floorHeight;
                  move="fall"
              } else if (height == counterHeight && pos < counterLeft) {
                  endHeight = floorHeight;
                  move="fall"
              } else {
                me.checkFood();
                alt = ~alt;
                kitty.src= (alt ? "~/img/KittyLeft.png" : "~/img/KittyLeft1.png") ;
                absoluteLayoutModule.AbsoluteLayout.setLeft(kitty, pos);
              }
              break;            
            case "right":            
                waiting = 0;
                last = "right";
                pos += stepHorizontal;
                if(pos > screenWidth) pos = screenWidth;
               if (height == fridgeHeight && pos > fridgeRight) {
                    endHeight = counterHeight;
                    move="fall"
                    break;
                }
                me.checkFood();
                alt = ~alt;
                kitty.src= (alt ? "~/img/KittyRight.png" : "~/img/KittyRight1.png") ;
                absoluteLayoutModule.AbsoluteLayout.setLeft(kitty, pos);
                break;            
            case "jump":            
                waiting = 0;
                pos += (last == "left" ? -stepHorizontal: stepHorizontal);
                if(pos < 0) pos = 0;
                height -= stepVertical;
                kitty.src= (last == "left" ? "~/img/KittyJumpLeft.png" : "~/img/KittyJumpRight.png") ;
                if (height <= endHeight) {
                    height = endHeight;
                    switch(height) {
                    case counterHeight:
                        if(pos > counterLeft) {
                            kitty.src= (last == "left" ? "~/img/KittySitLeft.png" : "~/img/KittySitRight.png") ;
                            move = ""
                        } else {
                            endHeight = floorHeight;
                            move = "fall"
                        }
                        break;
                    case fridgeHeight:
                        if(pos < fridgeRight) {
                            kitty.src= (last == "left" ? "~/img/KittySitLeft.png" : "~/img/KittySitRight.png") ;
                            move = ""
                       } else {
                            endHeight = counterHeight;
                            move = "fall"
                       }
                       break;
                    }
                }
                absoluteLayoutModule.AbsoluteLayout.setLeft(kitty, pos);
                absoluteLayoutModule.AbsoluteLayout.setTop(kitty, height);
               break;            
            case "fall":            
                waiting = 0;
                pos += (last == "left" ? -stepHorizontal: stepHorizontal);
                if(pos < 0) pos = 0;
                height += stepVertical;
                kitty.src= (last == "left" ? "~/img/KittyFallLeft.png" : "~/img/KittyFallRight.png") ;
                if (height >= endHeight) {
                    height = endHeight;
                     if(endHeight == counterHeight && pos < counterLeft) {
                        endHeight = floorHeight;
                        move = "fall"
                     } else {
                         kitty.src= (last == "left" ? "~/img/KittySitLeft.png" : "~/img/KittySitRight.png") ;
                         move = ""
                     }
               }
                absoluteLayoutModule.AbsoluteLayout.setLeft(kitty, pos);
                absoluteLayoutModule.AbsoluteLayout.setTop(kitty, height);
                break;            
        }

     }

     viewModel.prototype.Init = function () {
        isInit = true;
        var scale = platformModule.screen.mainScreen.scale; //3 2
        screenWidth = platformModule.screen.mainScreen.widthPixels / scale; //1080  2560    640
        screenHeight = platformModule.screen.mainScreen.heightPixels  / scale; //1920 1504
        
        widthScale = Math.floor(screenWidth / 640);
        heightScale = Math.floor(screenHeight / 360);

        last = "right";
        found = 0;
        stepHorizontal = Math.floor(.005 * screenWidth);
        stepVertical  = stepHorizontal;

        fridgeLeft = Math.floor(.03 * screenWidth);
        fridgeRight = Math.floor(.23 * screenWidth);
        counterLeft = Math.floor(.31 * screenWidth);
 
        floorHeight = Math.floor(.75 * screenHeight);
        counterHeight = Math.floor(.36 * screenHeight);
        fridgeHeight = Math.floor(.14 * screenHeight);

        height = floorHeight;
        endHeight = 0;
        controlHeight = Math.floor(.70 * screenHeight);

        pos = stepHorizontal * 80;
        fish1Pos = stepHorizontal * 20;
        fish2Pos = stepHorizontal * 67;
        pelletPos = stepHorizontal * 170;
        leftPos = 0;
        rightPos = Math.floor(.12 * screenWidth);
        jumpPos = Math.floor(.80 * screenWidth);

        kitty = page.getViewById("kitty");
        absoluteLayoutModule.AbsoluteLayout.setTop(kitty, height);
        absoluteLayoutModule.AbsoluteLayout.setLeft(kitty, pos);
         
        var view = page.getViewById("left");
        absoluteLayoutModule.AbsoluteLayout.setTop(view, controlHeight);
        absoluteLayoutModule.AbsoluteLayout.setLeft(view, leftPos);
        var view = page.getViewById("right");
        absoluteLayoutModule.AbsoluteLayout.setTop(view, controlHeight);
        absoluteLayoutModule.AbsoluteLayout.setLeft(view, rightPos);
        var view = page.getViewById("jump");
        absoluteLayoutModule.AbsoluteLayout.setTop(view, controlHeight - Math.floor(.06 * screenHeight));
        absoluteLayoutModule.AbsoluteLayout.setLeft(view, jumpPos);

       var view = page.getViewById("fish1");
        absoluteLayoutModule.AbsoluteLayout.setTop(view, fridgeHeight + Math.floor(.02 * screenHeight));
        absoluteLayoutModule.AbsoluteLayout.setLeft(view, fish1Pos);

       var view = page.getViewById("fish2");
        absoluteLayoutModule.AbsoluteLayout.setTop(view, counterHeight + Math.floor(.05 * screenHeight));
        absoluteLayoutModule.AbsoluteLayout.setLeft(view, fish2Pos);

       var view = page.getViewById("pellet");
        absoluteLayoutModule.AbsoluteLayout.setTop(view, floorHeight + Math.floor(.10 * screenHeight));
        absoluteLayoutModule.AbsoluteLayout.setLeft(view, pelletPos);
     }
     
     viewModel.prototype.checkFood = function () {
        switch (height) {
        case fridgeHeight:
             if(pos == fish1Pos ) {
                 fish1Pos = Math.floor(.01 * screenWidth);
                var view = page.getViewById("fish1");
                absoluteLayoutModule.AbsoluteLayout.setTop(view, 0);
                absoluteLayoutModule.AbsoluteLayout.setLeft(view, fish1Pos);
                 me.ProcessFound();
            }
             break;
        case counterHeight:
             if(pos == fish2Pos ) {
                 sound.create("~/img/found.mp3").play();
                 fish2Pos = Math.floor(.07 * screenWidth);
                var view = page.getViewById("fish2");
                absoluteLayoutModule.AbsoluteLayout.setTop(view, 0);
                absoluteLayoutModule.AbsoluteLayout.setLeft(view, fish2Pos);
                 me.ProcessFound();
            }
           break;
        case floorHeight:
             if(pos == pelletPos ) {
                 sound.create("~/img/found.mp3").play();
                 pelletPos = Math.floor(.12 * screenWidth);
                var view = page.getViewById("pellet");
                absoluteLayoutModule.AbsoluteLayout.setTop(view, 0);
                absoluteLayoutModule.AbsoluteLayout.setLeft(view, pelletPos);
                 me.ProcessFound();
            }
             break;
        }

     viewModel.prototype.ProcessFound = function () {
         found += 1;
         sound.create("~/img/found.mp3").play();
         if (found==3) {
           sound.create("~/img/cheer.mp3").play();
            var view = page.getViewById("cup");
            view.visibility = "visible";
            var view = page.getViewById("win");
            view.visibility = "visible";
         
            var sec = Math.floor((new Date() - time) / 1000);

            alert("It took you: " + sec + " seconds to help kitty win");   
            kitty.src= (last == "left" ? "~/img/KittySitLeft.png" : "~/img/KittySitRight.png") ;
 
         }
      }
    }


return viewModel;
})(observable.Observable);


exports.pageLoaded = function(args) {
orientationModule.setCurrentOrientation("landscape");
var page = args.object;
var obj = new viewModel(page);
page.bindingContext = obj ;
};

 
 exports.onNavigatingFrom = function(args) {
//     alert("nav from");
//     orientationModule.orientationCleanup();
     
 }