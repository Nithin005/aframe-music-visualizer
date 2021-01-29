AFRAME.registerComponent('move-z',{
    init: function(){ 
    },
    tick: function() {
        this.el.object3D.position.z += 1;
    }
})

AFRAME.registerComponent('rotate-z',{
    tick: function(){
        this.el.object3D.rotation.z += THREE.Math.degToRad(0.05);
    }
})

AFRAME.registerComponent('audioanalyser-volume-bind', {
  schema: {
    analyserEl: {type: 'selector'},
    component: {type: 'string'},
    property: {type: 'string'},
    max: {type: 'number'},
    multiplier: {type: 'number'},
  },

  tick: function () {
    var analyserComponent;
    var data = this.data;
    var el = this.el;
    var value;

    analyserComponent = data.analyserEl.components.audioanalyser;
    if (!analyserComponent.analyser) { return; }

    value = Math.min(data.max, analyserComponent.volume * data.multiplier);
    console.log(value)
    el.setAttribute(data.component, value+' '+value+' '+value);
  }
});

AFRAME.registerComponent('generate-shapes',{
    dependencies: ['audioanalyser'],
    schema: {},
    init: function(){
      this.color_scale = chroma.scale(['green','yellow', 'red']);
    },
    events: {
        audioanalyserbeat: function(evt) {
            var el = this.el;
            var shape = document.createElement('a-entity');
            shape.setAttribute('mixin','triangle')
           
            //vol range 1-50
            var vol = el.components.audioanalyser.volume;
            var scale = vol*0.01; 
            //Todo
            shape.setAttribute('scale',scale+' '+scale+' '+scale)
           
            var color = this.color_scale(vol*0.02).hex();
            shape.setAttribute('material','color',color)
            shape.setAttribute('material','emissive',color)
            
            shape.object3D.position.copy(el.object3D.position)
            shape.object3D.rotation.copy(el.object3D.rotation)
            shape.addEventListener('animationcomplete',function(){
              el.sceneEl.removeChild(shape)
            })
            el.sceneEl.appendChild(shape);
            
        }
    }
})

AFRAME.registerComponent('lrc',{
    schema:{
        song:{type:'selector'}
    },
    init: function(){
        this.encodeLrc = 'WzAwOjAwLjAwXUJsaW5kaW5nIExpZ2h0cwpbMDA6MjcuNzFdSSBoYXZlIGJlZW4gdHJ5bmEgY2FsbApbMDA6MzAuNzBdSSBoYXZlIGJlZW4gb24gbXkgb3duIGZvciBsb25nIGVub3VnaApbMDA6MzMuMzBdTWF5YmUgeW91IGNhbiBzaG93IG1lIGhvdyB0byBsb3ZlIG1heWJlClswMDozOS4wMV1JIGFtIGdvaW5nIHRocm91Z2ggd2l0aGRyYXdhbHMKWzAwOjQxLjcyXVlvdSBkb27igLJ0IGV2ZW4gaGF2ZSB0byBkbyB0b28gbXVjaApbMDA6NDQuMzBdWW91IGNhbiB0dXJuIG1lIG9uIHdpdGgganVzdCBhIHRvdWNoIGJhYnkKWzAwOjUwLjIwXUkgbG9vayBhcm91bmQgYW5kClswMDo1MS41Ml1TaW4gQ2l0eeKAsnMgY29sZCBhbmQgZW1wdHkKWzAwOjU0LjAxXU5vIG9uZeKAsnMgYXJvdW5kIHRvIGp1ZGdlIG1lClswMDo1Ni42MV1JIGNhbuKAsnQgc2VlIGNsZWFybHkgd2hlbiBZb3UgYXJlIGdvbmUKWzAxOjAxLjQxXUkgc2FpZCBvb2ggSSBhbSBibGluZGVkIGJ5IHRoZSBsaWdodHMKWzAxOjA3LjQwXU5vIEkgY2Fu4oCydCBzbGVlcCB1bnRpbCBJIGZlZWwgeW91ciB0b3VjaApbMDE6MTIuNzJdSSBzYWlkIG9vaCBJIGFtIGRyb3duaW5nIGluIHRoZSBuaWdodApbMDE6MTguNTBdT2ggd2hlbiBJIGFtIGxpa2UgdGhpcyBZb3UgYXJlIHRoZSBvbmUgSSB0cnVzdApbMDE6MjMuMDBdSGV5IGhleSBoZXkKWzAxOjM0LjcwXUkgYW0gcnVubmluZyBvdXQgb2YgdGltZQpbMDE6MzcuNzJd4oCyQ2F1c2UgSSBjYW4gc2VlIHRoZSBzdW4gbGlnaHQgdXAgdGhlIHNreQpbMDE6NDAuNzBdU28gSSBoaXQgdGhlIHJvYWQgaW4gb3ZlcmRyaXZlIGJhYnkgb2gKWzAxOjQ3LjYwXVRoZSBjaXR54oCycyBjb2xkIGFuZCBlbXB0eQpbMDE6NTAuMjFdTm8gb25l4oCycyBhcm91bmQgdG8ganVkZ2UgbWUKWzAxOjUyLjkyXUkgY2Fu4oCydCBzZWUgY2xlYXJseSB3aGVuIFlvdSBhcmUgZ29uZQpbMDE6NTcuNjBdSSBzYWlkIG9vaCBJIGFtIGJsaW5kZWQgYnkgdGhlIGxpZ2h0cwpbMDI6MDMuNDFdTm8gSSBjYW7igLJ0IHNsZWVwIHVudGlsIEkgZmVlbCB5b3VyIHRvdWNoClswMjowOC44MF1JIHNhaWQgb29oIEkgYW0gZHJvd25pbmcgaW4gdGhlIG5pZ2h0ClswMjoxNC42MV1PaCB3aGVuIEkgYW0gbGlrZSB0aGlzIFlvdSBhcmUgdGhlIG9uZSBJIHRydXN0ClswMjoyMC4yMF1JIGFtIGp1c3QgY2FsbGluZyBiYWNrIHRvIGxldCB5b3Uga25vdyBCYWNrIHRvIGxldCB5b3Uga25vdwpbMDI6MjIuOTFdSSBjb3VsZCBuZXZlciBzYXkgaXQgb24gdGhlIHBob25lIFNheSBpdCBvbiB0aGUgcGhvbmUKWzAyOjI1LjYxXVdpbGwgbmV2ZXIgbGV0IHlvdSBnbyB0aGlzIHRpbWUKWzAyOjMxLjQwXUkgc2FpZCBvb2ggSSBhbSBibGluZGVkIGJ5IHRoZSBsaWdodHMKWzAyOjM3LjIyXU5vIEkgY2Fu4oCydCBzbGVlcCB1bnRpbCBJIGZlZWwgeW91ciB0b3VjaApbMDI6NDEuNjFdSGV5IGhleSBoZXkKWzAzOjA0LjgwXUkgc2FpZCBvb2ggSSBhbSBibGluZGVkIGJ5IHRoZSBsaWdodHMKWzAzOjEwLjgxXU5vIEkgY2Fu4oCydCBzbGVlcCB1bnRpbCBJIGZlZWwgeW91ciB0b3VjaApbMDM6MTcuMjBd'
        var el = this.el;
        var data = this.data;
        //https://github.com/mrdoob/three.js/issues/18996
        THREE.Vector3.prototype.random = function(){
          this.x = Math.random() * 2 - 1;
          this.y = Math.random() * 2 - 1;
          this.z = Math.random() * 2 - 1;
          return this;
      }
        var lrc = new Lyric({
            onPlay: function (line, text) {
              var textEl = document.createElement('a-entity')
                textEl.setAttribute('text','value',text)
                textEl.setAttribute('mixin','text')
                textEl.addEventListener( 'animationcomplete',function(evt) {
                  evt.target.sceneEl.removeChild(evt.target)
                })
                textEl.object3D.position.copy( (new THREE.Vector3()).random().subScalar( 0.5 ).clampScalar(-0.2,0.3).add(el.object3D.position))
                el.sceneEl.appendChild(textEl)
            },
            onSetLyric: function (lines) {
            //  console.log(lines)
            }
          })
         
        this.data.song.onplay = function () {
            
            lrc.play(data.song.currentTime * 1000)
          }
        this.data.song.onpause = function() {
            lrc.pause()
        }
        lrc.setLyric(this.b64DecodeUnicode(this.encodeLrc))
        this.data.song.src="./assets/song.mp3"
    },
    b64DecodeUnicode: function (str) {
        return decodeURIComponent(atob(str).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
      },
    tick: function(){
      //  console.log(this.data.song.currentTime)
    }

})

AFRAME.registerComponent('move-in-circle',{
  schema: {
      center:{type: 'vec3'},
      radius:{type:'number'},
      dur:{type:'number'},
      loop:{type:'boolean'},

  },
  init: function(){
    //  this.deg = 0 ;
      this.timelapsed = 0;
      this.active = true;
      if(!this.data.loop){
          setTimeout(()=>{this.active=false;},this.data.dur)
      }
  },
  tick: function(t,dt) {
      if(this.active){
      var rad = 2*Math.PI*(this.timelapsed/this.data.dur)
      this.rotate(rad)
      this.timelapsed += dt;
      }
  },
  rotate: function(rad){
    var el = this.el;
      var position = this.el.object3D.position;
      var center = this.data.center;
      var radius = this.data.radius;
       //https://stackoverflow.com/questions/155649/circle-coordinates-to-array-in-javascript
      //var x = (center.x + radius * Math.cos(THREE.Math.degToRad(this.deg)));
      //var z = (center.z + radius * Math.sin(THREE.Math.degToRad(this.deg)));
      var x = (center.x + radius * Math.cos(rad));
      var z = (center.z + radius * Math.sin(rad));
      
      position.x = x;
      position.z = z;
      
  }
})

AFRAME.registerComponent('move-random-y',{
  schema: {sensitivity:{type:'number'},
scale:{type:'number'},
yseed:{type:'number'}},
  init: function(){
      noise.seed(Math.random());
  },

  tick: function(){
    
      var position = this.el.object3D.position;
      console.log(position)
      var y = noise.perlin2(position.x*this.data.sensitivity,this.data.yseed)
      position.y = y*this.data.scale;
  }
})

AFRAME.registerComponent('spe',{
  schema: {

  },
  init: function(){
    var worldPosition = new THREE.Vector3();
    this.el.object3D.getWorldPosition(worldPosition);
      this.particleGroup = new SPE.Group({
          texture: {
              value: THREE.ImageUtils.loadTexture('./assets/smokeparticle.png')
          }
      });
      this.emitter =  new SPE.Emitter({
          maxAge: 3,
          position: {
              value: worldPosition,
              spread: new THREE.Vector3(2, 2, 2)
          },

          acceleration: {
              value: new THREE.Vector3(0, -5, 0),
              spread: new THREE.Vector3(5, 0, 5)
          },

          velocity: {
             // value: new THREE.Vector3(0, 10, 0)
          },

          color: {
              value: [ new THREE.Color( 0.5, 0.5, 0.5 ), new THREE.Color() ],
              spread: new THREE.Vector3(1, 1, 1),
          },
          size: {
              value: [2, 0]
          },

          particleCount: 1000
      });
      this.particleGroup.addEmitter( this.emitter );
      this.el.sceneEl.object3D.add( this.particleGroup.mesh );

  },
  tick: function(t,dt){
    var worldPosition = new THREE.Vector3();
    this.el.object3D.getWorldPosition(worldPosition);
      this.emitter.position.value = worldPosition
      this.particleGroup.tick( );

  }
})