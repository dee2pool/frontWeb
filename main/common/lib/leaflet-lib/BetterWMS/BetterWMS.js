/**
 * Created by lucahan on 2018/5/23.
 */
/**
 * 问题记录：
 * params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
   params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);
   上面的这个是wms查询传送的x和y坐标，由于wms查询的时候只支持整数，当拖动地图时会变成小数，所以需要进行四舍五入的操作；
 */
L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({
    onAdd: function (map) {
        // Triggered when the layer is added to a map.
        //   Register a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onAdd.call(this, map);
        map.on('click', this.getFeatureInfo, this);
    },
    onRemove: function (map) {
        // Triggered when the layer is removed from a map.
        //   Unregister a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onRemove.call(this, map);
        map.off('click', this.getFeatureInfo, this);
    },
    getFeatureInfo: function (evt) {
        // Make an AJAX request to the server and hope for the best
        var url = this.getFeatureInfoUrl(evt.latlng),
            showResults = L.Util.bind(this.showGetFeatureInfo, this);
        $.ajax({
            url: url,
            success: function (data, status, xhr) {
                var err = typeof data === 'string' ? null : data;
                var name=data.features[0].properties.name;
                //console.log(data.features[0].properties.name);
                console.log(data);
                showResults(err, evt.latlng, name);
            },
            error: function (xhr, status, error) {
                showResults(error);
            }
        });
    },
    getFeatureInfoUrl: function (latlng) {
        // Construct a GetFeatureInfo request URL given a point
        var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
            size = this._map.getSize(),
            params = {
                request: 'GetFeatureInfo',
                service: 'WMS',
                srs: 'EPSG:4326',
                styles: this.wmsParams.styles,
                transparent: this.wmsParams.transparent,
                version: this.wmsParams.version,
                format: this.wmsParams.format,
                bbox: this._map.getBounds().toBBoxString(),
                height: Math.round(size.y),
                width: Math.round(size.x),
                layers: this.wmsParams.layers,
                query_layers: this.wmsParams.layers,
                info_format: 'application/json',
            };
        params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
        params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);
        return this._url + L.Util.getParamString(params, this._url, true);
    },
    showGetFeatureInfo: function (err, latlng, content) {
        //if (err) { console.log(err); return; } // do nothing if there's an error.
        L.popup({ maxWidth: 800}).setLatLng(latlng).setContent(content).openOn(this._map);
        //console.log(content);
    }
});
L.tileLayer.betterWms = function (url, options) {
    return new L.TileLayer.BetterWMS(url, options);
};