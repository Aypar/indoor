module.exports = function(app){

	var mapping = require("../modules/Mapping.js")();

	app.post('/Mapping/CreateWayPoint',createWayPoint);
	app.post('/Mapping/DeleteWayPoint',deleteWayPoint);
	app.post('/Mapping/CreateRelation',createRelation);


	app.get('/Mapping/GetAllWayPoints',getAllWayPoints);



	function createWayPoint(req,res){

		var waypoint = req.body.waypoint;

		mapping.createWayPoint(waypoint,function(result){
				res.json(result);
		});

	}

	function getAllWayPoints(req,res){

		mapping.getAllWayPoints(function(result){
				res.json(result);
		});
	}

	function deleteWayPoint(req,res)
	{
		var id = req.body.id
		mapping.deleteWayPoint(id,function(result){

			res.json(result);
		})
	}

	function createRelation(req,res)
	{
		var wp1 = req.body.wp1
		var wp2 = req.body.wp2
		mapping.createRelation(wp1,wp2,function(result){

			res.json(result);
		})
	}


}