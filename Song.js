
function Song( params ){
  
  this.artist = params.artist;
  this.title  = params.title;

  this.url =  'http://api.soundcloud.com/tracks/' +
              params.soundcloudID +
              '/stream?client_id=2400df97862fa2c06f486af524e4f974';

  var vs = shaders.vs[ params.material ];
  var fs = shaders.fs[ params.material ];
  
  this.material = new THREE.MeshLambertMaterial({

     // uniforms:         params.uniforms,
     // vertexShader:     vs,
     // fragmentShader:   fs,
     // shading: THREE.FlatShading

    map: G.t_audio.value
  });

  this.selected = false;

  this.hoverColor = new THREE.Color( 0x66bbaa );
  this.neutralColor = new THREE.Color( 0xaa8822 );
  this.selectedColor = new THREE.Color( 0xffffff );
  this.material = new THREE.MeshPhongMaterial();
  this.mesh = new THREE.Mesh( params.geometry , this.material );

  this.mesh.position.copy( params.position );

  this.mesh.hoverOver = this.hoverOver.bind( this );
  this.mesh.hoverOut  = this.hoverOut.bind( this );
  this.mesh.select    = this.select.bind( this );
  this.mesh.deselect  = this.deselect.bind( this );


  var string = this.artist + " - " + this.title;

  var al = this.artist.length;
  var tl = this.title.length;

  var width = al;

  if( tl > al ){
   dif = tl - al;
   width = tl;

   var aString = "";
   for( var i = 0; i < dif/2; i++ ){
      aString += " ";
   }
   aString += this.artist;

   aString += "\n";

   aString += this.title;
   string = aString;

  }else if( tl < al ){

    dif = al - tl;

   var aString = this.artist;
   aString += "\n";
   for( var i = 0; i < dif/2; i++ ){
      aString += " ";
   }
   aString += this.title;
   string = aString;



  }else{

    string = this.artist + "\n" + this.title

  }

  var letterWidth = .03
  this.text = new TextParticles(
    string, 
    params.font , 
    shaders.vs.title , 
    shaders.fs.title , 
    {
      letterWidth: letterWidth,
      lineLength: width,
    }    
  );

  this.text.width = width * letterWidth;

  this.text.visible = false;
  this.text.position.x = -this.text.width / 2; 

  //scene.add( this.mesh );
  objectControls.add( this.mesh );


}

Song.prototype.play = function(){

  audio.src = this.url;
  source.mediaElement.play();
  currentSong = this;
  this.text.visible = true;
  //songInfo.innerHTML = this.artist + "  -  " +this.title 

  
}

Song.prototype.pause = function(){

  audio.src = this.url;
  source.mediaElement.pause();
  //songInfo.innerHTML = this.artist + "  -  " +this.title 

  
}

Song.prototype.hoverOver = function(){



  if( this.selected === false ){
    this.text.visible = true;
    this.mesh.material.color = this.hoverColor
  }

    if( currentSong && currentSong != this  ){
    currentSong.text.visible = false;
  }


 // songInfo.innerHTML = this.artist + "  -  " +this.title 
}


Song.prototype.hoverOut = function(){
  
 // var cs = currentSong;

 

  if( currentSong  && currentSong != this ){
     currentSong.text.visible = true;
  }

  if( this.selected === false ){ 
    this.text.visible = false;
    this.mesh.material.color = this.neutralColor
  }

  if( currentSong ){
     currentSong.text.visible = true;
  }
  //songInfo.innerHTML = cs.artist + "  -  " + cs.title; 
}


Song.prototype.select = function(){
  

  if( this.selected == false ){
  if( currentSong ){
    currentSong.deselect();
  }

  this.text.visible = true;
  this.selected = true;
  this.mesh.material.color = this.selectedColor;

  this.play();

  this.text.visible = true;
  
  }else{

    this.text.visible = false;
    this.selected = false;

    this.pause();
    currentSong = false;
    this.mesh.material.color = this.hoverColor;
  
  }

}


Song.prototype.deselect = function(){

  //this.text.visible = false;
  //this.selected = false;

  this.mesh.material.color = this.hoverColor;
  


}






