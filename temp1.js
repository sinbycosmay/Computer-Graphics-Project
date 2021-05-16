import * as THREE from './three.js-master/build/three.module.js';

function main()
{
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize(window.innerWidth,window.innerHeight);
  // renderer.setClearColor();
  renderer.setClearColor("#e5e5e5");

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  const cubes = [
    // makeInstance(geometry, 0x44aa88,  0),
    // makeInstance(geometry, 0x8844aa, -2),
    // makeInstance(geometry, 0xaa8844,  2),

  ];

  var objLoader = new OBJLoader();
  // objLoader.setMaterials(materials);
  objLoader.setPath('./models/');
  objLoader.load('dragon.obj', function (object) {

      scene.add(object);
      object.position.y -= 1;

  });

  // objLoader.setPath('./models/');
  var mtlLoader = new MTLLoader();
  // mtlLoader.setTexturePath('./models/');  
  // mtlLoader.setPath('./models/');
  // mtlLoader.load('untitled.mtl', function (materials) {

  //   materials.preload();

  //   objLoader.load('untitled.obj', function (object) {

  //     scene.add(object);
  //     // object.position.y -= 1;

  //   });
  // });

  const onProgress = function ( xhr ) {

    if ( xhr.lengthComputable ) {

      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

    }

  };
  const onError = function () { };

  const manager = new THREE.LoadingManager();
				manager.addHandler( /\.dds$/i, new DDSLoader() );
  new MTLLoader( manager )
					.setPath( './models/' )
					.load( 'untitled.mtl', function ( materials ) {

						materials.preload();

						new OBJLoader( manager )
							.setMaterials( materials )
							.setPath( './models/' )
							.load( 'untitled.obj', function ( object ) {

								// object.position.y = - 1;
								scene.add( object );

							}, onProgress, onError );

					} );

  function render(time) {
    time *= 0.001;  // convert time to seconds

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

main();
