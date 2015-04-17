function City(){


  var geo = this.createGeometry();

  var mesh = new THREE.Mesh( geo , new THREE.MeshPhongMaterial({
    map: G.t_audio.value 
  }) );

  return mesh;

}

City.prototype.createGeometry = function(){

  var numOf = 1000;

  var geo = new THREE.CubeGeometry( 1 , 1 , 1 );

  var geometry = new THREE.Geometry();

  for( var  i = 0; i < numOf; i++ ){

    var m = new THREE.Mesh( geo );

    var l = Math.random() < .5 ? 1 :  -1;

    var h = 0;
    if( l > 0 ){
      h = Math.random();
      m.position.x = h * 5 + .3; 

    }else{
      h = Math.random();

      m.position.x = -h * 5 - .1 ; 
    }
    m.position.z = Math.random() * 20; 
    
    m.scale.x = Math.random() * .2 + .1;
    m.scale.z = Math.random() * .2 + .1;
    m.scale.y = (Math.random() * h * 3) + h;

    m.position.y = m.scale.y / 2;

    m.updateMatrix();

    geometry.merge( geo , m.matrix );

  }


  return geometry;


}
