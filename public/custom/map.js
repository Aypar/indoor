

(function(window,document,undefined){


var CustomMap = function(){


	var map = {}
	this.geoJson = {};
	this.mode = null;

	var wayPointMarkers = {};
	var bounds = [[0,0], [613,1912]];

	var mode = null;

	this.init = function (){

	 	map =	L.map('map', {
 	  	 crs: L.CRS.Simple
		});
		var image = L.imageOverlay('http://localhost:3001/public/image/floor.jpg', bounds).addTo(map);
		map.setView( [70, 120], 1);
		map.on('click',onMapClick);

		$.ajax({
		    type: 'GET',
		    url: '/mapping/getAllWayPoints',
		    success: function(result){
		    	
				var route = [];
		    	for(var i = 0; i < result.length;i++)
		    	{
		    		var wp = result[i];
		    		var poi = L.latLng([ wp.latitude, wp.longitude ]);
		    		route.push([wp.latitude,wp.longitude]);
					var marker = L.marker(poi).addTo(map);
					marker.waypointData = wp;
					setMarkerEvents(marker);

		    	}

    			setRoadNetwork(function(roadNetwork){

					var graph = new Graph(roadNetwork);
					console.log(roadNetwork);
					var path = graph.findShortestPath('118','128');
					var  coordinates = [];
					_.each(path,function(p){

						var marker =wayPointMarkers[p];	
						coordinates.push(marker._latlng);

					});

					var route = new L.Polyline(coordinates, {
					    color: 'red',
					    weight: 3,
					    opacity: 0.5,
					    smoothFactor: 1
					});
					route.addTo(map);

				})


			},
		    contentType: "application/json",
		    dataType: 'json'
		});


		function setRoadNetwork(cb){


				var roadNetwork = {};
				$.getJSON( "/public/data.json", function( result ) {
				  
					_.each(result.data,function(d){
				

							roadNetwork[d.row[0].from] = {};
							_.each(d.row[0].to,function(t){

									roadNetwork[d.row[0].from][t.id] = t.distance;		
							})
						

					})
					
					cb(roadNetwork);
				});

		}

	this.map = map;

	}


	function onMapClick(e){

		var latLang = e.latlng;
		var wayPoint = {
			latitude:latLang.lat,
			longitude:latLang.lng,
			level:1,
			name: "WP_" + Math.round((Math.random()*10000))
		}


		$.ajax({
		    type: 'POST',
		    url: '/mapping/createWayPoint',
		    data: JSON.stringify({ waypoint: wayPoint}),
		    success: function(result){
		
		    var poi = L.latLng([ latLang.lat, latLang.lng ]);
			var marker = L.marker(poi).addTo(map);
			marker.waypointData = result;
			setMarkerEvents(marker);		
			
				
			},
		    contentType: "application/json",
		    dataType: 'json'
		});
		

	}


	function setMarkerEvents(marker){

		wayPointMarkers[marker.waypointData.id] = marker;
		marker.bindPopup('<button onClick="CustomMap.deleteWayPoint('+marker.waypointData.id+')"> Sil </button> <br/> <button onClick="CustomMap.startRelation('+marker.waypointData.id+')"> Şuna Bağla </button <br/> <button onClick="CustomMap.createRelation('+marker.waypointData.id+')"> Bağlama işlemini tamamla </button')
		marker.on('click',function(e){
			marker.openPopup();
		});


	}

	this.deleteWayPoint = function(id)
	{
		$.ajax({
		    type: 'POST',
		    url: '/mapping/deleteWayPoint',
		    data: JSON.stringify({ id: id}),
		    success: function(result){
				map.removeLayer(wayPointMarkers[id]);
			},
		    contentType: "application/json",
		    dataType: 'json'
		});
		
	}
	var relation = []
	this.startRelation = function (id)
	{
		relation[0] = id;
	}
	this.createRelation = function (id)
	{
		relation[1] = id;
		var data = { 
			wp1: wayPointMarkers[relation[0]].waypointData,
			wp2: wayPointMarkers[relation[1]].waypointData,
		 }
		$.ajax({
		    type: 'POST',
		    url: '/mapping/createRelation',
		    data: JSON.stringify(data),
		    success: function(result){
				
			},
		    contentType: "application/json",
		    dataType: 'json'
		});

	}};


if(typeof window !== 'undefined')
	window.CustomMap = new CustomMap();



}(window,document))
