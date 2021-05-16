import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
camera.position.set(0, 27, 5);
var renderer = new THREE.WebGLRenderer({antialias: true});
var canvas = renderer.domElement
document.body.appendChild(canvas);

var controls = new OrbitControls(camera, canvas);

scene.add(new THREE.AmbientLight(0xffffff, 0.125));

var dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
dirLight.position.setScalar(10);
scene.add(dirLight);

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

// ground
var ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(30, 30), new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/hardwood2_diffuse.jpg"), metalness: 0, roughtness: 1}));
ground.geometry.rotateX(-Math.PI * 0.5);
ground.position.set(0, -0.01, 0);
scene.add(ground);

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

  let light = new THREE.SpotLight(0xffffff, 5, 10, THREE.Math.degToRad(10), 0.25);
  light.position.set(shift, 0.125, 1);
  base.add(light);
  
  let lightTarget = new THREE.Object3D();
  lightTarget.position.set(shift, 0.125, 1 + 0.1);
  base.add(lightTarget);
  light.target = lightTarget;
}

var clock = new THREE.Clock();
var t = 0;

render();
// renderer.setSize(window.innerWidth,window.innerHeight);
// renderer.setPixelRatio( window.devicePixelRatio);

function render() {
  if (resize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  
  t = clock.getElapsedTime() * 0.1;
  
  lightHolder.position.copy(curveObj.getPointAt( t % 1));
  lightHolder.lookAt(curveObj.getPointAt((t + 0.01) % 1));
  
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function resize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}