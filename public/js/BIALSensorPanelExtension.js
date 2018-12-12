
var _dockPanel;
var dbIds = [
    "7260",
    "3944",
    "429"
];

var _sensorData = {};

var _today = new Date();
_today = _today.toLocaleString();

function readSensorData(sensorData)
{
sensorData = JSON.parse(sensorData);
console.log("FromExtension:",sensorData);
var _loop = 0;
for(var i in sensorData){
    _sensorData[dbIds[_loop]] = sensorData[i];
    _loop++;
}

}

function SensorPanelExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);

    var _self = this;

    ///////////////////////////////////////////////////////////////////////////
    // load callback
    ///////////////////////////////////////////////////////////////////////////
    _self.load = function () {

        // need to access geometry? wait until is loaded
        viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function (selected) {

            if (selected.dbIdArray.length > 0) {
                var selectedItems = selected.dbIdArray.map(String);
                selectedItems.forEach(function log(a, b) {
                    if (dbIds.indexOf(a) >= 0) {
                    createDockPanel(a);
                    }
                    else
                    _dockPanel.setVisible(false);
                });
            }

        });

        return true;
    };
    function createDockPanel(dbId) {

        var pressure, temperature;

        if (_dockPanel) {
            _dockPanel.setVisible(true);
            switch(dbId)
            {
                case dbIds[0]:
                 pressure =_sensorData[dbIds[0]].Pressure;
                 temperature = _sensorData[dbIds[0]].Temperature;
                $("td[id='Pressure']").text(pressure);
                $("td[id='Temperature']").text(temperature);
                break;
                case dbIds[1]:
                pressure =_sensorData[dbIds[1]].Pressure;
                temperature = _sensorData[dbIds[1]].Temperature;
               $("td[id='Pressure']").text(pressure);
               $("td[id='Temperature']").text(temperature);
                break;
                case dbIds[2]:
                pressure =_sensorData[dbIds[2]].Pressure;
                temperature = _sensorData[dbIds[2]].Temperature;
               $("td[id='Pressure']").text(pressure);
               $("td[id='Temperature']").text(temperature);
                break;                
            }
            $("span[id='time']").text(_today);
            return;
        }
        else {
            _dockPanel = new Autodesk.Viewing.UI.DockingPanel(viewer.container, 'SensorPanel', 'SensorPanel');
            _dockPanel.content = document.createElement('div');
            _dockPanel.container.style.top = "40px";
            _dockPanel.container.style.left = "40px";
            _dockPanel.container.style.width = "auto";
            _dockPanel.container.style.height = "auto";
            _dockPanel.container.style.resize = "auto";
            _dockPanel.setVisible(true);
            var op = { left: false, heightAdjustment: 45, marginTop: 0 };
            _dockPanel.scrollcontainer = _dockPanel.scrollcontainer || _dockPanel.createScrollContainer(op);
            var html =
                `<div class="docking-panel-scroll docking-panel-container-solid-color-a right">
                <div class="docking-panel-container-gradient" style="width: 100%; height: 100%;">
                <table class="table table-hover table-responsive" id="clashresultstable">
                <thead>
                <th>Pressure</th><th>Temperature</th><th>Date</th>
                </thead>
                <tbody>
                <tr><td id="Pressure">170Mpa</td><td id="Temperature">60<span>&#8451;</span></td><td><span id="time"></span></td></tr>                
                </tbody>
                </table>
                </div>
                <canvas class="chart" id="smoothie-chart" width="400" height="100"></canvas>
                </div>`;
            $(_dockPanel.scrollContainer).append(html);
            _dockPanel.initializeMoveHandlers(_dockPanel.title);
            _dockPanel.initializeCloseHandler(_dockPanel.closer);
            $("span[id*='time']").each(function(index){
                $(this).text(_today);
            });
            var chart = new SmoothieChart(),
                canvas = document.getElementById('smoothie-chart'),
                temperatureSeries = new TimeSeries();
           var pressureSeries = new TimeSeries();
            setInterval(function () {
                temperatureSeries.append(new Date().getTime(), Math.random());
                pressureSeries.append(new Date().getTime(), Math.random());
            }, 500);
            chart.addTimeSeries(temperatureSeries, { lineWidth: 2, strokeStyle: '#40ff00', tooltipLabel: '°C' });
            chart.addTimeSeries(pressureSeries, { lineWidth: 2, strokeStyle: '#ff0000', tooltipLabel: 'MPa' });
            chart.streamTo(canvas, 500);
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    // unload callback
    ///////////////////////////////////////////////////////////////////////////
    _self.unload = function () {
        _dockPanel.setVisible(false);
        return true;
    };
}


SensorPanelExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
SensorPanelExtension.prototype.constructor = SensorPanelExtension;
Autodesk.Viewing.theExtensionManager.registerExtension('SensorPanelExtension', SensorPanelExtension);