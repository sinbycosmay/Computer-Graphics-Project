import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from './three.js-master/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from './three.js-master/examples/jsm/loaders/MTLLoader.js';
import { DDSLoader } from './three.js-master/examples/jsm/loaders/DDSLoader.js';
import { RectAreaLightHelper } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/lights/RectAreaLightUniformsLib.js';
import Stats from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/libs/dat.gui.module.js';

//SCENE
let scene = new THREE.Scene();
scene.fog = new THREE.Fog('grey', 0, 1e4);

// var koclock = new THREE.Clock();
var t = 0;

//RENDER
let renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance",});
renderer.setClearColor('skyblue');
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
// renderer.gammaFactor = 1;
// renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

//CAMERA
var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1e-3, 1e5);
camera.position.x = 500;
camera.position.y = 500;
camera.position.z = 500;

//CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// LIGHT
var light = new THREE.AmbientLight('white');
scene.add(light);
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
const geometry = new THREE.SphereGeometry( 10, 10, 10 );
const material = new THREE.MeshLambertMaterial({color: 'orange'});
const sphere = new THREE.Mesh( geometry, material );
sphere.position.x = 750;
sphere.position.y = 100;
sphere.position.z = 200;
scene.add( sphere );

const spotLight = new THREE.SpotLight( 'orange' , 2);
spotLight.position.set( 800, 110, 200);
spotLight.castShadow = true;
spotLight.target.position.set(-5, 0, 0);
scene.add( spotLight );

//MERCEDES


// var carlightx;
// var carlighty;
// var carlightz;

// var Height = 50;   //50
// var Breadth = 150;    //10
// var Length = 55;    //10
// var Box_geometry = new THREE.BoxGeometry(Length,Height,Breadth);
// var Box_Material = new THREE.MeshLambertMaterial({color: 'red'});
// var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
// Box_Mesh.position.x = -700;
// Box_Mesh.position.y = 100;
// Box_Mesh.position.z = -900;
// scene.add(Box_Mesh);

// const light = new THREE.DirectionalLight('red', 1);
// light.position.set(Box_Mesh.position.x , Box_Mesh.position.y, Box_Mesh.position.z + 100);
// light.target.position.set(Box_Mesh.position.x , Box_Mesh.position.y, Box_Mesh.position.z);
// // light.position.setScalar(0.001)
// scene.add(light);
// scene.add(light.target);

// const helper = new THREE.DirectionalLightHelper( light, 100 );
// scene.add( helper );


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
// texture.encoding = THREE.sRGBEncoding;
scene.background = texture;
const FLOOR = - 250;
//ROAD
const road_texture = new THREE.TextureLoader().load('/resources/road/road1.jpg');
road_texture.anisotropy = 32
road_texture.wrapS = THREE.RepeatWrapping;
road_texture.wrapT = THREE.RepeatWrapping;
road_texture.repeat.set(100, 100);
const road_material = new THREE.MeshStandardMaterial({ map: road_texture, metalness: 0 });
const road_geometry = new THREE.PlaneBufferGeometry(1e5, 1e5, 1e3, 1e3)
const plane = new THREE.Mesh(road_geometry, road_material);
plane.position.set( 0, FLOOR, 0 );
plane.position.x = 0;
plane.position.y = -0.01;
plane.position.z = 0;
plane.castShadow = true;
plane.receiveShadow = true;
plane.rotation.x = -1 * Math.PI / 2;
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



//PERSON

// var _animations = {};
// const person_loader = new FBXLoader();
// person_loader.setPath('./resources/model/boy/');
// console.log('b');
// person_loader.load('boy.fbx', (fbx) => {
//   fbx.scale.setScalar(0.5);
//   fbx.traverse(c => {
//     c.castShadow = true;
//   });

//   const _target = fbx;
//   scene.add(_target);

//   const _mixer = new THREE.AnimationMixer(_target);

//   const _manager = new THREE.LoadingManager();
//   _manager.onLoad = () => {
//     _animations['idle'].action.play();
//     console.log("s");


//   };

//   const _OnLoad = (animName, anim) => {
//     const clip = anim.animations[0];
//     const action = _mixer.clipAction(clip);
//     action.play()
//     console.log("a");

//     _animations[animName] = {
//       clip: clip,
//       action: action,
//     };
//     // _animations['idle'].action.play();
//   };

//   const person_loader = new FBXLoader(_manager);
//   person_loader.setPath('./resources/model/boy/');
// //   person_loader.load('walk.fbx', (a) => { _OnLoad('walk', a); });
// //   person_loader.load('run.fbx', (a) => { _OnLoad('run', a); });
//   person_loader.load('idle.fbx', (a) => { _OnLoad('idle', a); });
// //   person_loader.load('kick.fbx', (a) => { _OnLoad('kick', a); });
// });

// let mixer = new THREE.AnimationMixer();
// let modelReady = false;
// let animationActions = [];
// let activeAction;
// let lastAction;
// const fbxLoader = new FBXLoader();

// fbxLoader.load('resources/model/boy/boy.fbx', (object) => {
//     object.scale.set(1, 1, 1);
//     mixer = new THREE.AnimationMixer(object);
//     let animationAction = mixer.clipAction(object.animations[0]);
//     animationActions.push(animationAction);
//     animationsFolder.add(animations, "default");
//     activeAction = animationActions[0];
//     scene.add(object);
//     //add an animation from another file
//     fbxLoader.load('resources/model/boy/idle.fbx', (object) => {
//         console.log("loaded samba");
//         let animationAction = mixer.clipAction(object.animations[0]);
//         animationActions.push(animationAction);
//         animationsFolder.add(animations, "samba");
//         //add an animation from another file
//         fbxLoader.load('resources/model/boy/walk.fbx', (object) => {
//             console.log("loaded bellydance");
//             let animationAction = mixer.clipAction(object.animations[0]);
//             animationActions.push(animationAction);
//             animationsFolder.add(animations, "bellydance");
//             //add an animation from another file
//             fbxLoader.load('resources/model/boy/run.fbx', (object) => {
//                 console.log("loaded goofyrunning");
//                 object.animations[0].tracks.shift();
//                 let animationAction = mixer.clipAction(object.animations[0]);
//                 animationActions.push(animationAction);
//                 animationsFolder.add(animations, "goofyrunning");
//                 // progressBar.style.display = "none";
//                 modelReady = true;
//             },)
//         },)
//     },)
// });

// const stats = Stats();
//         document.body.appendChild(stats.dom);
//         var animations = {
//             default: function () {
//                 setAction(animationActions[0]);
//             },
//             samba: function () {
//                 setAction(animationActions[1]);
//             },
//             bellydance: function () {
//                 setAction(animationActions[2]);
//             },
//             goofyrunning: function () {
//                 setAction(animationActions[3]);
//             },
//         };
//         const setAction = (toAction) => {
//             if (toAction != activeAction) {
//                 lastAction = activeAction;
//                 activeAction = toAction;
//                 lastAction.fadeOut(1);
//                 activeAction.reset();
//                 activeAction.fadeIn(1);
//                 activeAction.play();
//             }
//         };

//         const gui = new GUI();
//         const animationsFolder = gui.addFolder("Animations");
//         animationsFolder.open();

//         const clock = new THREE.Clock();
//         var animate = function () {
//             requestAnimationFrame(animate);
//             controls.update();
//             if (modelReady)
//                 mixer.update(clock.getDelta());
//             render();
//             stats.update();
//         };        



// // // BOX1
// var box_texture = new THREE.TextureLoader().load('/resources/building/123.jpeg');
// box_texture.anisotropy = 32
// box_texture.wrapS = THREE.RepeatWrapping;
// box_texture.wrapT = THREE.RepeatWrapping;
// box_texture.repeat.set(1, 1);
// var Height = 500;   //50
// var Breadth = 500;    //10
// var Length = 250;    //10
// var Box_geometry = new THREE.BoxGeometry(Length, Height, Breadth);
// var Box_Material = new THREE.MeshLambertMaterial({ map: box_texture });
// var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
// Box_Mesh.position.x = 0;
// Box_Mesh.position.y = Height / 2 + 1;
// Box_Mesh.position.z = 0;
// scene.add(Box_Mesh);

// //BOX2
// var box_texture = new THREE.TextureLoader().load('/resources/building/Green.jpg');
// box_texture.anisotropy = 32
// box_texture.wrapS = THREE.RepeatWrapping;
// box_texture.wrapT = THREE.RepeatWrapping;
// box_texture.repeat.set(1, 1);
// var Height = 500;
// var Breadth = 500;
// var Length = 250;
// var Box_geometry = new THREE.BoxGeometry(Length, Height, Breadth);
// var Box_Material = new THREE.MeshLambertMaterial({ map: box_texture });
// var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
// Box_Mesh.position.x = 1000;
// Box_Mesh.position.y = Height / 2 + 1;
// Box_Mesh.position.z = 250;
// scene.add(Box_Mesh);

// //BOX3
// var box_texture = new THREE.TextureLoader().load('/resources/building/3.jpg');
// box_texture.anisotropy = 32
// box_texture.wrapS = THREE.RepeatWrapping;
// box_texture.wrapT = THREE.RepeatWrapping;
// box_texture.repeat.set(1, 1);
// var Height = 500;
// var Breadth = 500;
// var Length = 250;
// var Box_geometry = new THREE.BoxGeometry(Length, Height, Breadth);
// var Box_Material = new THREE.MeshLambertMaterial({ map: box_texture });
// var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
// Box_Mesh.position.x = -1000;
// Box_Mesh.position.y = Height / 2 + 1;
// Box_Mesh.position.z = 250;
// scene.add(Box_Mesh);

// //BOX4
// var box_texture = new THREE.TextureLoader().load('/resources/building/4.jpg');
// box_texture.anisotropy = 32
// box_texture.wrapS = THREE.RepeatWrapping;
// box_texture.wrapT = THREE.RepeatWrapping;
// box_texture.repeat.set(1, 1);
// var Height = 500;
// var Breadth = 500;
// var Length = 250;
// var Box_geometry = new THREE.BoxGeometry(Length, Height, Breadth);
// var Box_Material = new THREE.MeshLambertMaterial({ map: box_texture });
// var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
// Box_Mesh.position.x = 1000;
// Box_Mesh.position.y = Height / 2 + 1;
// Box_Mesh.position.z = -1500;
// scene.add(Box_Mesh);


// //BOX5
// var box_texture = new THREE.TextureLoader().load('/resources/building/5.jpg');
// box_texture.anisotropy = 32
// box_texture.wrapS = THREE.RepeatWrapping;
// box_texture.wrapT = THREE.RepeatWrapping;
// box_texture.repeat.set(1, 1);
// var Height = 500;
// var Breadth = 500;
// var Length = 250;
// var Box_geometry = new THREE.BoxGeometry(Length, Height, Breadth);
// var Box_Material = new THREE.MeshLambertMaterial({ map: box_texture });
// var Box_Mesh = new THREE.Mesh(Box_geometry, Box_Material);
// Box_Mesh.position.x = -1000;
// Box_Mesh.position.y = Height / 2 + 1;
// Box_Mesh.position.z = -1500;
// scene.add(Box_Mesh);

// var curveObj = new THREE.CatmullRomCurve3([
//     new THREE.Vector3(0, 0, -100),
//     new THREE.Vector3(-100, 0, 0),
//     new THREE.Vector3(-50, 0, 100),
//     new THREE.Vector3(-25, 0, 50),
//     new THREE.Vector3(0, 0, 100),
//     new THREE.Vector3(5, 0, 120),
//     new THREE.Vector3(70, 0, -70)
// ]);
// curveObj.closed = true;
// var curveGeom = new THREE.BufferGeometry().setFromPoints(curveObj.getPoints(200));
// var curveMat = new THREE.LineBasicMaterial({ color: 0x444400 });
// var curve = new THREE.Line(curveGeom, curveMat);
// scene.add(curve);


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

var carProfileGeometry = new THREE.ExtrudeBufferGeometry(carProfileShape, { depth: 1, bevelEnabled: false });
carProfileGeometry.translate(0, 0, 10);
carProfileGeometry.rotateY(-Math.PI * 0.5);

var lightHolder = new THREE.Mesh(carProfileGeometry, new THREE.MeshLambertMaterial({ color: "blue" }));
lightHolder.scale.setScalar(70)
scene.add(lightHolder);

function createLight(base, shift) {
    let bulb = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshBasicMaterial());
    bulb.scale.setScalar(0.1);
    bulb.position.set(shift - 10, 0.125, 1);
    base.add(bulb);

    let light = new THREE.SpotLight('yellow', 50, 100, THREE.Math.degToRad(60), 0.25);
    light.position.set(shift - 10, 0.125, 1);
    base.add(light);

    let lightTarget = new THREE.Object3D();
    lightTarget.position.set(shift - 10, 0.125, 1 + 0.1);
    base.add(lightTarget);
    light.target = lightTarget;
}

// lights
createLight(lightHolder, -0.2);
createLight(lightHolder, -0.8);

var carProfileShape1 = new THREE.Shape([
    new THREE.Vector2(1, 0),
    new THREE.Vector2(1, 0.25),
    new THREE.Vector2(0.65, 0.25),
    new THREE.Vector2(0.35, 0.5),
    new THREE.Vector2(-0.25, 0.5),
    new THREE.Vector2(-0.95, 0.25),
    new THREE.Vector2(-1, 0.25),
    new THREE.Vector2(-1, 0)
]);
var carProfileGeometry1 = new THREE.ExtrudeBufferGeometry(carProfileShape1, { depth: 1, bevelEnabled: false });
carProfileGeometry1.translate(0, 0, -10);
carProfileGeometry1.rotateY(-Math.PI * 0.5);
var lightHolder1 = new THREE.Mesh(carProfileGeometry1, new THREE.MeshLambertMaterial({ color: "green" }));
lightHolder1.scale.setScalar(70)
scene.add(lightHolder1);

function createLight1(base, shift) {
    let bulb = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshBasicMaterial());
    bulb.scale.setScalar(0.1);
    bulb.position.set(shift + 10, 0.125, -1);
    base.add(bulb);

    let light = new THREE.SpotLight('yellow', 50, 100, THREE.Math.degToRad(60), 0.25);
    light.position.set(shift + 10, 0.125, -1);
    base.add(light);

    let lightTarget = new THREE.Object3D();
    lightTarget.position.set(shift  + 10, 0.125, -1 - 0.1);
    base.add(lightTarget);
    light.target = lightTarget;
}

// lights
createLight1(lightHolder1, -0.2);
createLight1(lightHolder1, -0.8);

let mixer = new THREE.AnimationMixer( scene );
const morphs = [];
function addMorph( mesh, clip, speed, duration, x, y, z, fudgeColor ) {

    mesh = mesh.clone();
    mesh.material = mesh.material.clone();

    if ( fudgeColor ) {

        mesh.material.color.offsetHSL( 0, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25 );

    }

    mesh.speed = speed;

    mixer.clipAction( clip, mesh ).
        setDuration( duration ).
    // to shift the playback out of phase:
        startAt( - duration * Math.random() ).
        play();

    mesh.position.set( x, y, z );
    mesh.rotation.y = Math.PI / 2;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add( mesh );

    morphs.push( mesh );

}

const gltfloader = new GLTFLoader();

gltfloader.load( "./three.js-master/examples/models/gltf/Horse.glb", function ( gltf ) {

    const mesh = gltf.scene.children[ 0 ];

    const clip = gltf.animations[ 0 ];

    addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 300, true );
    addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 450, true );
    addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 600, true );

    addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, - 300, true );
    addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, - 450, true );
    addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, - 600, true );

} );


//RENDERING
var render = function () {
    // t = clock.getElapsedTime() * 0.1;  
    // lightHolder.position.copy(curveObj.getPointAt( t % 1));
    t += 1;
    lightHolder1.position.set(0, 0, -0.5 - t)
    lightHolder.position.set(0, 0, -0.5 + t)
    if(t == 1700)
    {
        t = -1000;
    }
    // console.log(t);
    // lightHolder.lookAt(curveObj.getPointAt((t + 0.01) % 1));
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};
render();
// animate();