module.exports = function(){

	var module = {

			createWayPoint:createWayPoint,
			createRelation:createRelation,
			findPath:findPath,
			getAllWayPoints:getAllWayPoints,
			deleteWayPoint:deleteWayPoint

	}

	return  module
	function createWayPoint(waypoint,cb){
	
		db.save(waypoint,'WAYPOINT', function(err, node) { 
				  if (err) throw err;
				  cb(node);	  
			});
	}

	function createRelation(wp1,wp2,cb) {

		var a = wp1.latitude - wp2.latitude;
		var b = wp1.longitude - wp2.longitude;
		var distance = Math.sqrt( a*a + b*b );

		var query = [
			'Start  wp1= node({id1}) , wp2= node({id2})',
			'Create Unique (wp1)-[r1:NAVIGATE_TO { distance:{distance} }]->(wp2)',
			'Create Unique (wp2)-[r2:NAVIGATE_TO { distance:{distance} }]->(wp1)',
			'Return r1,r2'	
		].join('\n')

		db.query(query,{id1:wp1.id,id2:wp2.id,distance:distance},function(err,results){

			if(err) console.log(err);

			cb(results);

		})
	

				
	}

	function findPath(wp1,wp2,cb) {
		var query = [
				  'START  startNode=node({id1}),',
				  'endNode=node:node({id2})',
				  'RETURN p AS shortestPath, ',
				  'reduce(weight=0, r in relationships(p) : weight+r.distance) AS totalWeight',
				  'ORDER BY totalWeight ASC',
				  'LIMIT 1'
				].join('\n');
			
			db.query(query, {id1: wp1, id2: wp2},function(err, results) {

			  if (err)  throw err;
				  cb(results);

		  	});
	}

	function getAllWayPoints(cb)
	{
			var query = [
				  'Match (wp:WAYPOINT)',
				  'RETURN wp '
				].join('\n');

			db.query(query, function(err, results) {

			  if (err)  console.log(err);
				  cb(results);
		  	});
	}

	function deleteWayPoint(id,cb)
	{

		var query = [
		  'START  node=node({id})',
		  'detach',
		  'delete node'
		].join('\n');
		
		db.query(query,{id:id},function(err, result) {

		  if (err)  throw err;
			  cb(result);

	  	});


	}
}