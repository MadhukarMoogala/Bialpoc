var viewerApp;
var _viewer3D;
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

function launchViewer(urn) {
    var options = {
        env: 'AutodeskProduction',
        getAccessToken: getForgeToken
    };
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Initializer(options, function onInitialized() {
        viewerApp = new Autodesk.Viewing.ViewingApplication('forgeViewer');
        viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D,{ extensions: ['BIALSensorExtension','SensorPanelExtension'] });
        viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}

function onDocumentLoadSuccess(doc) {
    // We could still make use of Document.getSubItemsWithProperties()
    // However, when using a ViewingApplication, we have access to the **bubble** attribute,
    // which references the root node of a graph that wraps each object from the Manifest JSON.
    var viewables = viewerApp.bubble.search({
        'type': 'geometry',
        'viewableID': 'Model-3D'
    });
    if (viewables.length === 0) {
        console.error('Document contains no viewables.');
        return;
    }

    //choose 3D Model viewable


    // Choose any of the avialble viewables
    viewerApp.selectItem(viewables[0], onItemLoadSuccess, onItemLoadFail);
}

function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function onItemLoadSuccess(viewer, item) {
    // item loaded, any custom action?
}




function onItemLoadFail(errorCode) {
    console.error('onItemLoadFail() - errorCode:' + errorCode);
}

function getForgeToken(callback) {
    jQuery.ajax({
        url: '/api/forge/oauth/token',
        success: function(res) {
            callback(res.access_token, res.expires_in)
        }
    });
}