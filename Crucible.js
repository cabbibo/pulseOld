function Crucible( songParams){

  this.height = .2;
  this.radius = 1;
  this.innerRadius = .8;
  this.downInnerRadius = .5;

  var geo = new THREE.CylinderGeometry(this.innerRadius , 1 , this.height , 50 , 1 , true );
  var mat = new THREE.MeshLambertMaterial()
  this.body = new THREE.Mesh( geo , mat );

  var geo = new THREE.CylinderGeometry( this.innerRadius , this.downInnerRadius , this.height  , 50 , 1 , true );
  var mat = new THREE.MeshPhongMaterial({ side: THREE.BackSide })
  var mesh = new THREE.Mesh( geo , mat );
  this.body.add( mesh );

  this.songs = [];


  var geo = new THREE.IcosahedronGeometry( .05 , 1 );
    
   
  var font = UbuntuMono( "img/UbuntuMono.png" )

  for( var i =0; i < songParams.length; i++ ){

    var floor = i % 2; //Math.floor( ( i * 2 ) / songParams.length );
    var params = songParams[i];

    var a = -(Math.floor((i /2 ))- floor * .5) * .03 * Math.PI 
    a += 1;

    floor = 1 - floor;

    var x = (1.1 - (floor * .1 )) * Math.cos( a );
    var y = floor * .05;
    var z =(1.1 - (floor * .1 ))  * Math.sin(a );
    params.position = new THREE.Vector3( x , y , z );
    params.uniforms = uniforms;
    params.geometry = geo;
    params.font = font;
    
    var song = new Song( params );

    this.body.add( song.mesh );
    this.body.add( song.text );

    this.songs.push( song );

  }

  //this.songs[0].play();



  this.veins = this.createVeins();
  this.body.add( this.veins );


  this.floor = new THREE.Mesh( new THREE.PlaneGeometry( 10000 , 10000 ) , new THREE.MeshLambertMaterial(0xffffff));
  this.floor.position.y = - this.height / 2;
  this.floor.position.y -= .01;
  this.floor.rotation.x = -Math.PI / 2;
  this.body.add( this.floor );


  var mountainMat = new THREE.ShaderMaterial({
    uniforms:{
      t_audio: G.t_audio,
      time: G.time,
      bumpSize:   G.value1,
      bumpSpeed:  G.value2,
      bumpHeight: G.value3
      
    },
    vertexShader: shaders.vs.mountain,
    fragmentShader: shaders.fs.mountain,
    

  });

  this.mountains = new THREE.Mesh( new THREE.PlaneGeometry( 40 , 16 , 300 , 100 ), mountainMat );

  this.mountains.position.z = -10;
  this.mountains.rotation.x = - Math.PI / 2;

  console.log( this.mountains );
  this.body.add( this.mountains );


  var gooMat = new THREE.ShaderMaterial({
    uniforms:{
      t_audio: G.t_audio,
      time: G.time,
      bumpSize:   G.value1,
      bumpSpeed:  G.value2,
      bumpHeight: G.value3
      
    },
    vertexShader: shaders.vs.goo,
    fragmentShader: shaders.fs.goo,
    //side: THREE.DoubleSide
    

  });

  var geo = new THREE.CylinderGeometry(0,this.downInnerRadius , 0. , 100 , 100 , true );

  
  this.goo = new THREE.Mesh( geo, gooMat );

  //this.goo.rotation.x = -Math.PI /2 ;
  this.goo.position.y = -this.height / 2;
  console.log( this.mountains );
  this.body.add( this.goo );

  this.city = new City();

  this.city.position.z = 50;
  this.city.position.y = - this.height / 2;

  this.body.add( this.city );
}


Crucible.prototype.createVeins = function(){

  var positions = [];
  
  var l = this.songs.length;
  for( var i = 0; i < l ; i++ ){

    var s = this.songs[i];
    var p1 = new THREE.Vector3();
    var p2 = new THREE.Vector3();
    var p3 = new THREE.Vector3();

    
    p1.z = 100;
    p1.y = -this.height/2;
    p1.x = i * .02;

    p2.z = 1.3;
    p2.y = -this.height/2;
    p2.x = i * .02;

    positions.push( p1 );
    positions.push( p2 );

    p3.copy( p2 );

    p1 = new THREE.Vector3();
    p2 = new THREE.Vector3();
    
    
    var newP = l * .02 + .05;
    p1.copy( p3 );

    p2.z = 1.3 - .05 - (l- i)  * .02;
    p2.y = -this.height/2;
    p2.x = newP ;

    positions.push( p1 );
    positions.push( p2 );


    p3.copy( p2 );

    p1 = new THREE.Vector3();
    p2 = new THREE.Vector3();

    p1.copy( p3 );

    p2.x = s.mesh.position.x * 1;
    p2.y = -this.height/2;
    p2.z = 1.3 - .05 - (l- i) * .02;

    positions.push( p1 );
    positions.push( p2 );


    p3.copy( p2 );

    p1 = new THREE.Vector3();
    p2 = new THREE.Vector3();

    p1.copy( p3 );

    p2.x = s.mesh.position.x ;
    p2.y = -this.height/2;
    p2.z = s.mesh.position.z * 1.;
    positions.push( p1 );
    positions.push( p2 );





    p3.copy( p2 );

    p1 = new THREE.Vector3();
    p2 = new THREE.Vector3();

    p1.copy( p3 );

    p2.copy( s.mesh.position );

    positions.push( p1 );
    positions.push( p2 );



      


  }


  var totalVerts = (positions.length);


  var posArray = new Float32Array( totalVerts * 3 );

  for( var i = 0; i < positions.length; i++ ){

    index = i * 3
    
    posArray[ index + 0 ] =  positions[i].x; 
    posArray[ index + 1 ] =  positions[i].y; 
    posArray[ index + 2 ] =  positions[i].z; 
  }

  var a_pos = new THREE.BufferAttribute( posArray , 3 );

  geo = new THREE.BufferGeometry();
  geo.addAttribute( 'position'  , a_pos );

  var mat = new THREE.LineBasicMaterial();

  var mesh = new THREE.Line( geo , mat , THREE.LinePieces );

  return mesh;
}
