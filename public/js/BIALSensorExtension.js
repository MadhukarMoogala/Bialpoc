// *******************************************
// BIAL Extension
// *******************************************
var pushPinLocations = [{
    x: -63.035145328234876,
    y: 607.9587959555033,
    z: -286.98880004882835
}, {
    x: -677.1192893032128,
    y: 366.78141024073216,
    z: -286.9888000488279
}, {
    x: -1076.9735167381687,
    y: -319.29488791465224,
    z: -137.62739395623862
}];
var pushPinIds = [
    "_barChiller",
    "_tempChiller",
    "_compressor"
];
var _viewer3D;
var isPushPinDrawn = false;

function BIALSensorExtension(viewer, options) {
    _viewer3D = viewer;
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

BIALSensorExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
BIALSensorExtension.prototype.constructor = BIALSensorExtension;
BIALSensorExtension.prototype.load = function() {
    if (this.viewer.toolbar) {
        // Toolbar is already available, create the UI
        this.createUI();
    } else {
        // Toolbar hasn't been created yet, wait until we get notification of its creation
        this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
        this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }
    return true;
};
BIALSensorExtension.prototype.onToolbarCreated = function() {
    this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
};

BIALSensorExtension.prototype.createUI = function() {
    var _this = this;

    // prepare to execute the button action
    var sensorToolbarButton = new Autodesk.Viewing.UI.Button('TriggerSensorPanel');
    sensorToolbarButton.onClick = function(e) {       
        //--------------------------------------------------------------------------
        if (!isPushPinDrawn) {
            isPushPinDrawn = true;
            pushPinLocations.forEach(function draw(element, index) {
                drawPushpin(element, pushPinIds[index]);
            });
        }
        _viewer3D.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, function(rt) {

            //find out all pushpin markups
            var $eles = $("div[id^='mymk']");
            var DOMeles = $eles.get();

            for (var index in DOMeles) {

                //get each DOM element
                var DOMEle = DOMeles[index];
                var divEle = $('#' + DOMEle.id);
                //get out the 3D coordination
                var val = divEle.data('3DData');
                var pushpinModelPt = JSON.parse(val);
                //get the updated screen point
                var screenpoint = _viewer3D.worldToClient(new THREE.Vector3(
                    pushpinModelPt.x,
                    pushpinModelPt.y,
                    pushpinModelPt.z));
                //update the SVG position.
                divEle.css({
                    'left': screenpoint.x - pushpinModelPt.radius * 2,
                    'top': screenpoint.y - pushpinModelPt.radius
                });
            }
        });
        //--------------------------------------------------------------------------------------------------------- 
    };

    sensorToolbarButton.addClass('sensorToolbarButton');
    sensorToolbarButton.setToolTip('Senor Data from Database');
    // SubToolbar
    this.subToolbar = (this.viewer.toolbar.getControl("BIALToolbar") ?
        this.viewer.toolbar.getControl("BIALToolbar") :
        new Autodesk.Viewing.UI.ControlGroup('BIALToolbar'));
    this.subToolbar.addControl(sensorToolbarButton);
    this.viewer.toolbar.addControl(this.subToolbar);
};

BIALSensorExtension.prototype.unload = function() {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
};

//draw
function drawPushpin(pushpinModelPt, pushPinId) {
    //convert 3D position to 2D screen coordination
    var screenpoint = _viewer3D.worldToClient(
        new THREE.Vector3(pushpinModelPt.x,
            pushpinModelPt.y,
            pushpinModelPt.z));

    //build the div container
    var randomId = pushPinId;
    var htmlMarker = '<div id="mymk' + randomId + '"></div>';
    var parent = _viewer3D.container;
    $(parent).append(htmlMarker);
    $('#mymk' + randomId).css({
        'pointer-events': 'none',
        'width': '20px',
        'height': '20px',
        'position': 'absolute',
        'overflow': 'visible'
    });

    //build the svg element and draw a circle
    $('#mymk' + randomId).append('<svg id="mysvg' + randomId + '"></svg>')
    var s = Snap($('#mysvg' + randomId)[0]);
    var rad = 12;
    var circle = s.paper.circle(14, 14, rad);
    circle.attr({
        fill: '#66ff66',
        fillOpacity: 0.6,
        stroke: "#ffff33",
        strokeWidth: 3
    });

    function blink() {
        circle.animate({
            r: 4
        }, 1000, function() {
            circle.animate({
                r: 18
            }, 100);
        });
    }
    setInterval(blink, 1000);
    //set the position of the SVG
    //adjust to make the circle center is the position of the click point
    var $container = $('#mymk' + randomId);
    $container.css({
        'left': screenpoint.x - rad * 2,
        'top': screenpoint.y - rad
    });

    //store 3D point data to the DOM
    var div = $('#mymk' + randomId);
    //add radius info with the 3D data
    pushpinModelPt.radius = rad;
    var storeData = JSON.stringify(pushpinModelPt);
    div.data('3DData', storeData);
}
Autodesk.Viewing.theExtensionManager.registerExtension('BIALSensorExtension', BIALSensorExtension);