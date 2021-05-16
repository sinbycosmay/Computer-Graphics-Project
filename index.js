import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';



//SCENE
let scene = new THREE.Scene();
scene.fog = new THREE.Fog('grey', 0, 1e4);
var clock = new THREE.Clock();
var t = 0;

//RENDER
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor('skyblue');
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio);
renderer.shadowMap.enabled = true;
// renderer.gammaFactor = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
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
var light = new THREE.AmbientLight('white');
scene.add( light );

//ROAD
const road_texture = new THREE.TextureLoader().load('/resources/road/road1.jpg');
road_texture.anisotropy = 32
road_texture.wrapS = THREE.RepeatWrapping;
road_texture.wrapT = THREE.RepeatWrapping;
road_texture.repeat.set(100,100);
const road_material = new THREE.MeshStandardMaterial({map:road_texture, metalness: 0});
const road_geometry = new THREE.PlaneBufferGeometry(1e5,1e5,1e3,1e3)
const plane = new THREE.Mesh(road_geometry,road_material);
plane.position.x=0;
plane.position.y=-0.01;
plane.position.z=0;
plane.castShadow = true;
plane.receiveShadow = true;
plane.rotation.x = -1*Math.PI / 2;
plane.doubleSided = true;
plane.material.side = THREE.DoubleSide;
scene.add(plane);


// //BOX1
// var box_texture = new THREE.TextureLoader().load('/resources/building/123.jpeg');
// box_texture.anisotropy = 32
// box_texture.wrapS = THREE.RepeatWrapping;
// box_texture.wrapT = THREE.RepeatWrapping;
// box_texture.repeat.set(1,1);
// var Height = 50;
// var Breadth = 10;
// var Length = 10;
// var Box_geometry = new THREE.BoxGeometry(Length,Height,Breadth);
// var Box_Material = new THREE.MeshLambertMaterial({map:box_texture});
// var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
// Box_Mesh.position.x = 0;
// Box_Mesh.position.y = Height/2+1;
// Box_Mesh.position.z = 0;
// scene.add(Box_Mesh);

// //BOX2
// var Height = 50;
// var Breadth = 10;
// var Length = 10;
// var Box_geometry = new THREE.BoxGeometry(Length,Height,Breadth);
// var Box_Material = new THREE.MeshLambertMaterial({color: 'red'});
// var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
// Box_Mesh.position.x = 250;
// Box_Mesh.position.y = Height/2+1;
// Box_Mesh.position.z = 250;
// scene.add(Box_Mesh);

// //BOX3
// var Height = 50;
// var Breadth = 5;
// var Length = 5;
// var Box_geometry = new THREE.BoxGeometry(Length,Height,Breadth);
// var Box_Material = new THREE.MeshLambertMaterial({color: 'green'});
// var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
// Box_Mesh.position.x = -250;
// Box_Mesh.position.y = Height/2+1;
// Box_Mesh.position.z = 250;
// scene.add(Box_Mesh);

// //BOX4
// var Height = 50;
// var Breadth = 5;
// var Length = 5;
// var Box_geometry = new THREE.BoxGeometry(Length,Height,Breadth);
// var Box_Material = new THREE.MeshLambertMaterial({color: 'blue'});
// var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
// Box_Mesh.position.x = 250;
// Box_Mesh.position.y = Height/2+1;
// Box_Mesh.position.z = -250;
// scene.add(Box_Mesh);


// //BOX5
// var Height = 50;
// var Breadth = 5;
// var Length = 5;
// var Box_geometry = new THREE.BoxGeometry(Length,Height,Breadth);
// var Box_Material = new THREE.MeshLambertMaterial({color: 'orange'});
// var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
// Box_Mesh.position.x = -250;
// Box_Mesh.position.y = Height/2+1;
// Box_Mesh.position.z = -250;
// scene.add(Box_Mesh);


// path 
var curveObj = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, -10),
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(-5, 0, 10),
    new THREE.Vector3(-2.5, 0, 5),
    new THREE.Vector3(0, 0, 10),
    new THREE.Vector3(5, 0, 12),
    new THREE.Vector3(7, 0, -7)
  ]);
  curveObj.closed = true;
  var curveGeom = new THREE.BufferGeometry().setFromPoints(curveObj.getPoints(200));
  var curveMat = new THREE.LineBasicMaterial({color: 0x444400});
  var curve = new THREE.Line(curveGeom, curveMat);
  scene.add(curve);


// light holder
var carProfileShape = new THREE.Shape([
    new THREE.Vector2(1, 0),
    new THREE.Vector2(1, 0.25),
    new THREE.Vector2(0.65, 0.25),
    new THREE.Vector2(0.35, 0.5),
    new THREE.Vector2(-0.25, 0.5),
    new THREE.Vector2(-0.95, 0.25),
    new THREE.Vector2(-1, 0.25),
    new THREE.Vector2(-1, 0)
  ]);
  var carProfileGeometry = new THREE.ExtrudeBufferGeometry(carProfileShape, {depth: 1, bevelEnabled: false});
  carProfileGeometry.translate(0, 0, -0.5);
  carProfileGeometry.rotateY(-Math.PI * 0.5);
  var lightHolder = new THREE.Mesh(carProfileGeometry, new THREE.MeshLambertMaterial({color: "magenta"}));
  scene.add(lightHolder);
  
  // lights
  createLight(lightHolder, -0.3);
  createLight(lightHolder, 0.3);
  
  function createLight(base, shift) 
  {
    let bulb = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshBasicMaterial());
    bulb.scale.setScalar(0.1);
    bulb.position.set(shift, 0.125, 1);
    base.add(bulb);
  
    let light = new THREE.SpotLight('red', 50, 10, THREE.Math.degToRad(60), 0.25);
    light.position.set(shift, 0.125, 1);
    base.add(light);
    
    let lightTarget = new THREE.Object3D();
    lightTarget.position.set(shift, 0.125, 1 + 0.1);
    base.add(lightTarget);
    light.target = lightTarget;
  }
  

//RENDERING
var render = function()
{
    t = clock.getElapsedTime() * 0.1;
  
    lightHolder.position.copy(curveObj.getPointAt( t % 1));
    lightHolder.lookAt(curveObj.getPointAt((t + 0.01) % 1));
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    
};
render();


