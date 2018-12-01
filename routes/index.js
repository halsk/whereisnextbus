var express = require('express');
var router = express.Router();

var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');

var requestSettings = {
  method: 'GET',
  url: 'http://loc.bus-vision.jp/realtime/okaden_trip_update.bin',//宇野バス
  encoding: null
};
/* GET home page. */
router.get('/', function(req, res, next) {
  request(requestSettings, function (error, response, body) {
  console.log("read to data");
  
  //正しくデータを読み込めたら
  var trip_data = null;
  if (!error && response.statusCode == 200) {
    //GTFSのデータ構造については、https://developers.google.com/transit/gtfs-realtime/reference#VehicleDescriptorを参照
    var feed = GtfsRealtimeBindings.FeedMessage.decode(body);
    feed.entity.forEach(function(entity) {
      if (entity.trip_update) {
        //コン/ソールにデータを表示
        trip_data = entity.trip_update;
        //console.log(trip_data.trip_id);
        if (trip_data.trip_id == '177_2302346_20181201'){
          console.log(entity);
        }
      }
    });
    res.render('index', { title: 'GTFS Realtime test', trip_update: JSON.stringify(trip_data) });
  }else{
    res.render('index', { title: 'Error: GTFS Realtime test' });
  }
});

});

module.exports = router;
