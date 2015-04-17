
function Song( params ){
  
  this.artist = params.artist;
  this.title  = params.title;

  this.url =  'http://api.soundcloud.com/tracks/' +
              params.soundcloudID +
              '/stream?client_id=2400df97862fa2c06f486af524e4f974';

  var vs = shaders.vs[ params.material ];
  var fs = shaders.fs[ params.material ];
  
  this.material = new THREE.ShaderMaterial({

      uniforms:         params.uniforms,
      vertexShader:     vs,
      fragmentShader:   fs,
      shading: THREE.FlatShading

  });

  this.material = new THREE.MeshLambertMaterial();
  this.mesh = new THREE.Mesh( params.geometry , this.material );

  this.mesh.position.copy( params.position );

  this.mesh.hoverOver = this.hoverOver.bind( this );
  this.mesh.hoverOut  = this.hoverOut.bind( this );
  this.mesh.select    = this.select.bind( this );
  this.mesh.deselect  = this.deselect.bind( this );


  var string = this.artist + "\n" +this.title 
  this.text = new TextParticles(
    string, 
    params.font , 
    shaders.vs.title , 
    shaders.fs.title , 
    {
      letterWidth: .03,
      lineLength: string.length,
    }    
  );

 
  this.text.visible = false;
  this.text.position.y = .5;
  this.text.position.z = .5;
  this.text.position.x = .5; 

  //scene.add( this.mesh );
  objectControls.add( this.mesh );


}

Song.prototype.play = function(){

  audio.src = this.url;
  source.mediaElement.play();
  currentSong = this;
  //songInfo.innerHTML = this.artist + "  -  " +this.title 

}

Song.prototype.hoverOver = function(){
  console.log( 'HOVER OV');

  console.log( this );
  this.text.visible = true;

 // songInfo.innerHTML = this.artist + "  -  " +this.title 
}


Song.prototype.hoverOut = function(){
  console.log( 'HOVER OV');

  console.log( currentSong );
  var cs = currentSong;

  this.text.visible = false;
  //songInfo.innerHTML = cs.artist + "  -  " + cs.title; 
}


Song.prototype.select = function(){
  this.play();
}


Song.prototype.deselect = function(){



}






