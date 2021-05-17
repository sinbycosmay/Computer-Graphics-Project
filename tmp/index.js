import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from './three.js-master/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from './three.js-master/examples/jsm/loaders/MTLLoader.js';
import { DDSLoader } from './three.js-master/examples/jsm/loaders/DDSLoader.js';
import { RectAreaLightHelper } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/lights/RectAreaLightUniformsLib.js';

//SCENE
let scene = new THREE.Scene();
scene.fog = new THREE.Fog('grey', 0, 1e4);

//RENDER
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor('skyblue');
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio);
renderer.shadowMap.enabled = true;
// renderer.gammaFactor = 1;
// renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

//CAMERA
var camera = new THREE.PerspectiveCamera(90,window.innerWidth/window.innerHeight,1e-3,1e5);
camera.position.x = 500;
camera.position.y = 500;
camera.position.z = 500;

//CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', () =>{
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// LIGHT
// var light = new THREE.AmbientLight('white');
// scene.add( light );
// const hemilight = new THREE.HemisphereLight('skyblue', 'grey', 2);
// scene.add(hemilight);

//LAMP

//POINT

// const pointLight = new THREE.PointLight( 'purple', 10, 0 );
// pointLight.position.set( 100, 700, 100 );
// scene.add( pointLight );

// const sphereSize = 100;
// const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
// scene.add( pointLightHelper )

//FOR CAR HEADLIGHT : DIRECTIONAL

// const light = new THREE.DirectionalLight('red', 1);
// light.position.set(100, 700, 100);
// light.target.position.set(0, 0, 0);
// scene.add(light);
// scene.add(light.target);

// const helper = new THREE.DirectionalLightHelper( light, 100 );
// scene.add( helper );

//For STREET LIGHT

// const spotLight = new THREE.SpotLight( 'yellow' );
// spotLight.position.set( 100, 1000, 100 );

// spotLight.castShadow = true;

// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;

// spotLight.shadow.camera.near = 500;
// spotLight.shadow.camera.far = 4000;
// spotLight.shadow.camera.fov = 30;

// scene.add( spotLight );

// RectAreaLightUniformsLib.init();

// const width = 100;
// const height = 100;
// const intensity = 100;
// const rectLight = new THREE.RectAreaLight( 'yellow', intensity,  width, height );
// rectLight.position.set( 500, 700, 1000 );
// rectLight.lookAt( 0, 0, 0 );
// scene.add( rectLight )

// scene.add( new RectAreaLightHelper( rectLight ) );




//LAMP SPHERES (Add 2 more)

// const geometry = new THREE.SphereGeometry( 10, 10, 10 );
// // const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
// const material = new THREE.MeshLambertMaterial({color: 'yellow'});
// const sphere = new THREE.Mesh( geometry, material );
// sphere.position.x = 500;
// sphere.position.y = 260;
// sphere.position.z = 200;
// scene.add( sphere );

// const spotLight = new THREE.SpotLight( 'yellow' , 2);
// spotLight.position.set( 500, 210, 200);

// spotLight.castShadow = true;


// spotLight.target.position.set(-5, 0, 0);

// scene.add( spotLight );

//MERCEDES


var carlightx;
var carlighty;
var carlightz;

var Height = 50;   //50
var Breadth = 150;    //10
var Length = 55;    //10
var Box_geometry = new THREE.BoxGeometry(Length,Height,Breadth);
var Box_Material = new THREE.MeshLambertMaterial({color: 'red'});
var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
Box_Mesh.position.x = -700;
Box_Mesh.position.y = 100;
Box_Mesh.position.z = -900;
scene.add(Box_Mesh);

const light = new THREE.DirectionalLight('red', 1);
light.position.set(Box_Mesh.position.x , Box_Mesh.position.y, Box_Mesh.position.z + 100);
light.target.position.set(Box_Mesh.position.x , Box_Mesh.position.y, Box_Mesh.position.z);
// light.position.setScalar(0.001)
scene.add(light);
scene.add(light.target);

const helper = new THREE.DirectionalLightHelper( light, 100 );
scene.add( helper );





//SKYBOX

const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './resources/skybox/left.JPG',
        './resources/skybox/right.JPG',
        // './resources/skybox/left.JPG',
        // './resources/skybox/front.JPG',
        // './resources/skybox/back.JPG',
        './resources/skybox/up.JPG',
        './resources/skybox/down.JPG',
        './resources/skybox/front.JPG',
        './resources/skybox/back.JPG',
        
    ]);
    texture.encoding = THREE.sRGBEncoding;
    scene.background = texture;

//ROAD
const road_texture = new THREE.TextureLoader().load('/resources/road/road1.jpg');
road_texture.anisotropy = 32
road_texture.wrapS = THREE.RepeatWrapping;
road_texture.wrapT = THREE.RepeatWrapping;
road_texture.repeat.set(100,100);
const road_material = new THREE.MeshLambertMaterial({map:road_texture});
const road_geometry = new THREE.PlaneBufferGeometry(1e5,1e5,1e3,1e3)
const plane = new THREE.Mesh(road_geometry,road_material);
plane.position.x=0;
plane.position.y=0;
plane.position.z=0;
plane.castShadow = true;
plane.receiveShadow = true;
plane.rotation.x = Math.PI / 2;
plane.doubleSided = true;
plane.material.side = THREE.DoubleSide;
scene.add(plane);



//FBXModel

// const fbx_loader = new FBXLoader();
// fbx_loader.setPath('resources/building/');
// fbx_loader.load('uploads_files_1872817_OneFifth.fbx',(fbx) => {
//     fbx.scale.setScalar(0.1);
//     scene.add(fbx);
// }); 


//OBJBuilding
// const onProgress = function ( xhr ) {

//     if ( xhr.lengthComputable ) {

//       const percentComplete = xhr.loaded / xhr.total * 100;
//       console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

//     }

//   };
//   const onError = function () { };

//   const manager = new THREE.LoadingManager();
// 				manager.addHandler( /\.dds$/i, new DDSLoader() );
//   new MTLLoader( manager )
// 					.setPath( 'resources/building/' )
// 					.load( 'untitled.mtl', function ( materials ) {

// 						materials.preload();

// 						new OBJLoader( manager )
// 							.setMaterials( materials )
// 							.setPath( 'resources/building/' )
// 							.load( 'untitled.obj', function ( object ) {

// 								// object.position.y = - 1;
//                                 object.scale.setScalar(10);
// 								scene.add( object );

// 							}, onProgress, onError );

// 					} );



// BOX1
var box_texture = new THREE.TextureLoader().load('/resources/building/123.jpeg');
box_texture.anisotropy = 32
box_texture.wrapS = THREE.RepeatWrapping;
box_texture.wrapT = THREE.RepeatWrapping;
box_texture.repeat.set(1,1);
var Height = 500;   //50
var Breadth = 500;    //10
var Length = 250;    //10
var Box_geometry = new THREE.BoxGeometry(Length,Height,Breadth);
var Box_Material = new THREE.MeshLambertMaterial({map:box_texture});
var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
Box_Mesh.position.x = 0;
Box_Mesh.position.y = Height/2+1;
Box_Mesh.position.z = 0;
scene.add(Box_Mesh);

//BOX2
var box_texture = new THREE.TextureLoader().load('/resources/building/Green.jpg');
box_texture.anisotropy = 32
box_texture.wrapS = THREE.RepeatWrapping;
box_texture.wrapT = THREE.RepeatWrapping;
box_texture.repeat.set(1,1);
var Height = 500;
var Breadth = 500;
var Length = 250;
var Box_geometry = new THREE.BoxGeometry(Length,Height,Breadth);
var Box_Material = new THREE.MeshLambertMaterial({map:box_texture});
var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
Box_Mesh.position.x = 1000;
Box_Mesh.position.y = Height/2+1;
Box_Mesh.position.z = 250;
scene.add(Box_Mesh);

//BOX3
var box_texture = new THREE.TextureLoader().load('/resources/building/3.jpg');
box_texture.anisotropy = 32
box_texture.wrapS = THREE.RepeatWrapping;
box_texture.wrapT = THREE.RepeatWrapping;
box_texture.repeat.set(1,1);
var Height = 500;
var Breadth = 500;
var Length = 250;
var Box_geometry = new THREE.BoxGeometry(Length,Height,Breadth);
var Box_Material = new THREE.MeshLambertMaterial({map:box_texture});
var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
Box_Mesh.position.x = -1000;
Box_Mesh.position.y = Height/2+1;
Box_Mesh.position.z = 250;
scene.add(Box_Mesh);

//BOX4
var box_texture = new THREE.TextureLoader().load('/resources/building/4.jpg');
box_texture.anisotropy = 32
box_texture.wrapS = THREE.RepeatWrapping;
box_texture.wrapT = THREE.RepeatWrapping;
box_texture.repeat.set(1,1);
var Height = 500;
var Breadth = 500;
var Length = 250;
var Box_geometry = new THREE.BoxGeometry(Length,Height,Breadth);
var Box_Material = new THREE.MeshLambertMaterial({map:box_texture});
var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
Box_Mesh.position.x = 1000;
Box_Mesh.position.y = Height/2+1;
Box_Mesh.position.z = -1500;
scene.add(Box_Mesh);


//BOX5
var box_texture = new THREE.TextureLoader().load('/resources/building/5.jpg');
box_texture.anisotropy = 32
box_texture.wrapS = THREE.RepeatWrapping;
box_texture.wrapT = THREE.RepeatWrapping;
box_texture.repeat.set(1,1);
var Height = 500;
var Breadth = 500;
var Length = 250;
var Box_geometry = new THREE.BoxGeometry(Length,Height,Breadth);
var Box_Material = new THREE.MeshLambertMaterial({map:box_texture});
var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
Box_Mesh.position.x = -1000;
Box_Mesh.position.y = Height/2+1;
Box_Mesh.position.z = -1500;
scene.add(Box_Mesh);


//RENDERING
var render = function()
{
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};
render();