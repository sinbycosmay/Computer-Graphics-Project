import * as THREE from './three.js-master/build/three.module.js';
import Stats from './three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from './three.js-master/examples/jsm/loaders/OBJLoader.js';
import { MD2CharacterComplex } from './three.js-master/examples/jsm/misc/MD2CharacterComplex.js';
import { Gyroscope } from './three.js-master/examples/jsm/misc/Gyroscope.js';
import { RoomEnvironment } from './three.js-master/examples/jsm/environments/RoomEnvironment.js';
import { DRACOLoader } from './three.js-master/examples/jsm/loaders/DRACOLoader.js';
import { Sky } from './three.js-master/examples/jsm/objects/Sky.js';
import { GUI } from './three.js-master/examples/jsm/libs/dat.gui.module.js';
import { FlyControls } from './three.js-master/examples/jsm/controls/FlyControls.js';
import { TrackballControls } from './three.js-master/examples/jsm/controls/TrackballControls.js';
import { FirstPersonControls } from './three.js-master/examples/jsm/controls/FirstPersonControls.js';

const clock = new THREE.Clock();

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
const FLOOR = 0;
const ANIMATION_GROUPS = 5;
let camera, cameraControls, scene, renderer,camera_1,camera_2,camera_3,camera_type=0,cameraControls_1,cameraControls_2,cameraControls_3;
let stats;
const NEAR=1, FAR = 1e6;
let sky, sun, intersects;
let followLight,lightTargetf;

let morph, mixer;
let texture_type;

const morphs = [];
const animGroups = [];
const car_f =[];
const car_r =[];
const building =[];
const streetlights = [];

const characters = [];
let nCharacters = 0;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(1,1);

const controls =
{
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false
};


const wheels = [];

init();
animate();


 function initSky()
{
    // Add Sky
    sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);
    sun = new THREE.Vector3();

    /// GUI
    const effectController =
    {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        // exposure: renderer.toneMappingExposure,
        exposure: 0.25
    };

     function guiChanged()
    {
        const uniforms = sky.material.uniforms;
        uniforms['turbidity'].value = effectController.turbidity;
        uniforms['rayleigh'].value = effectController.rayleigh;
        uniforms['mieCoefficient'].value = effectController.mieCoefficient;
        uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
        const phi = THREE.MathUtils.degToRad(90-effectController.elevation);
        const theta = THREE.MathUtils.degToRad(effectController.azimuth);
        sun.setFromSphericalCoords( 1, phi, theta );
        uniforms['sunPosition'].value.copy(sun);
        renderer.toneMappingExposure = effectController.exposure;
        renderer.render(scene,camera);
    }

    const gui = new GUI();
    gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
    gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
    gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
    gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
    gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
    gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
    gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );
    guiChanged();
}


 function init()
{
    const container = document.createElement( 'div' );
    document.body.appendChild( container );

    // RENDERER
    renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance"});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    container.appendChild( renderer.domElement );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.setClearColor('grey');
    
    
    // SCENE
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    scene = new THREE.Scene();
    scene.environment = pmremGenerator.fromScene( new RoomEnvironment() ).texture;
    scene.fog = new THREE.Fog('grey', 0, FAR);
    
    // CAMERA
    //default camera
    camera_1 = new THREE.PerspectiveCamera( 60, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR );
    camera_1.position.set(500,500,1500);
    cameraControls_1 = new OrbitControls( camera_1, renderer.domElement );

    //drone camera
    camera_2 = new THREE.PerspectiveCamera( 60, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR );
    camera_2.position.set(1000,1000,1000);
    camera_2.lookAt(0,1,0);
    cameraControls_2 = new OrbitControls( camera_2, renderer.domElement );
    cameraControls_2.enableRotate=false;

    //avatar camera
    camera_3 = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR );
    camera_3.position.set(15,100,25);
    cameraControls_3 = new OrbitControls( camera_3, renderer.domElement );
    cameraControls_3.enableZoom=false;
    // cameraControls_3.enableRotate=false;
    // cameraControls_3.autoRotate=true;

    if(camera_type==0)
    {
        camera = camera_1;
        console.log("camera 1");
        scene.activeCamera=camera_1;
        cameraControls_1.enabled=true;
        cameraControls_2.enabled=false;
        cameraControls_3.enabled=false;
    }
    else if(camera_type==1)
    {
        camera = camera_2;
        console.log("camera 2");
        scene.activeCamera=camera_2;
        cameraControls_1.enabled=false;
        cameraControls_2.enabled=true;
        cameraControls_3.enabled=false;
    }
    else if(camera_type==2)
    {
        camera = camera_3;
        console.log("camera 3");
        scene.activeCamera=camera_2;
        cameraControls_1.enabled=false;
        cameraControls_2.enabled=false;
        cameraControls_3.enabled=true;
    }

    // LIGHTS
    const ambient = new THREE.AmbientLight( 'white',0.25 );
    scene.add( ambient );
    
    raycaster.setFromCamera( mouse, camera );

    initSky();
    createScene();

    // STATS
    stats = new Stats();
    container.appendChild( stats.dom );
    window.addEventListener( 'resize', onWindowResize );
    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );
    window.addEventListener( 'mousemove', onMouseMove, false );

    // console.log(scene.children)
}

 function createScene( )
{
    
    add_ground();

    //FERRARI
    
    add_car_f('red','blue',-1175,0,-5e3/2+1500);
    add_car_f('aqua','blue',-450,0,-5e3/2);
    add_car_r('yellow','blue',+450,0,-5e3/2+1500);
    add_car_r('purple','blue',+1175,0,-5e3/2);

    // Animals    
    add_birds(-5e3/2,1500,500);
    add_birds(-5e3/2,1500,500);
    
    // CHARACTER
    add_chracter();

    //Building
    texture_type=1;
    draw_building(10);

    //LightHouse Type Light
    // const sphere1 = new THREE.SphereGeometry(10, 16, 8 );
    // followLight = new THREE.SpotLight('white', 5, 0, THREE.Math.degToRad(30), 1);
    // followLight.add( new THREE.Mesh( sphere1, new THREE.MeshBasicMaterial( { color: 'white' } ) ) );
    // followLight.position.set(500, 500 , 500);
    
    add_light_house(0,500,0);
    
}

 function draw_building(num)
{
    for(let i=0;i<num;i++)
    {
        add_building_1(-2000,0,-num*200+i*400);
        add_street_light(-2000+250,0,-num*200+i*400);
    }

    for(let i=0;i<num;i++)
    {
        add_building_2(2000,0,-num*200+i*400);
        add_street_light(2000-250,0,-num*200+i*400);
    }

}

 function add_ground()
{
    const road_texture = new THREE.TextureLoader().load('/resources/road/road1.jpg');
    road_texture.anisotropy = 32
    road_texture.wrapS = THREE.RepeatWrapping;
    road_texture.wrapT = THREE.RepeatWrapping;
    road_texture.repeat.set(10, 10);

    const planeMaterial = new THREE.MeshStandardMaterial({ map: road_texture, metalness: 0 });
    const geometry = new THREE.PlaneBufferGeometry(5e3, 5e3, 1e3, 1e3)
    const ground = new THREE.Mesh(geometry, planeMaterial);
    ground.position.set( 0, FLOOR, 0 );
    ground.castShadow = true;
    ground.receiveShadow = true;
    ground.rotation.x = -1 * Math.PI / 2;
    ground.doubleSided = true;
    ground.material.side = THREE.DoubleSide;
    ground.name="GROUND";
    scene.add(ground);    
}

 function add_light_house(pos_x,pos_y,pos_z)
{
    //Tower
    const tower_texture = new THREE.TextureLoader().load('/resources/light_house/texture1.jpg');
    tower_texture.anisotropy = 32
    tower_texture.wrapS = THREE.RepeatWrapping;
    tower_texture.wrapT = THREE.RepeatWrapping;
    tower_texture.repeat.set(3, 3);
    const towerMaterial = new THREE.MeshBasicMaterial({ map: tower_texture});

    const tower_texture2 = new THREE.TextureLoader().load('/resources/light_house/texture2.jpg');
    tower_texture2.anisotropy = 32
    tower_texture2.wrapS = THREE.RepeatWrapping;
    tower_texture2.wrapT = THREE.RepeatWrapping;
    tower_texture2.repeat.set(2, 2);
    const towerMaterial2 = new THREE.MeshBasicMaterial({ map: tower_texture2});

    const tower_texture3 = new THREE.TextureLoader().load('/resources/light_house/texture3.jpg');
    tower_texture3.anisotropy = 32
    tower_texture3.wrapS = THREE.RepeatWrapping;
    tower_texture3.wrapT = THREE.RepeatWrapping;
    tower_texture3.repeat.set(0.5, 0.5);
    const towerMaterial3 = new THREE.MeshBasicMaterial({ map: tower_texture3}); 


    const geometry = new THREE.CylinderGeometry( 110, 110, 1000, 32 );
    const material = new THREE.MeshLambertMaterial({map:tower_texture});
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.set(pos_x,pos_y,pos_z);
    scene.add(cylinder);

    const geometry1 = new THREE.CylinderGeometry( 90, 90, 100, 32 );
    const material1 = new THREE.MeshLambertMaterial({map:tower_texture2});
    const cylinder1 = new THREE.Mesh( geometry1, material1 );
    cylinder1.position.set(pos_x,pos_y+550,pos_z);
    scene.add(cylinder1); 
    

    const sphere1 = new THREE.SphereGeometry(50, 16, 8 );
    followLight = new THREE.SpotLight('white', 5, 0, THREE.Math.degToRad(10), 0.9);
    followLight.add( new THREE.Mesh( sphere1, new THREE.MeshBasicMaterial( { color: 'white' } ) ) );
    followLight.position.set(pos_x,pos_y+550,pos_z-80); 
    lightTargetf = new THREE.Object3D();
    lightTargetf.position.set(characters[0].root.position.x,0,characters[0].root.position.z);
    followLight.target = lightTargetf; 
    scene.add(followLight);
    scene.add(lightTargetf);


    const geometry2 = new THREE.ConeGeometry(110, 100, 32 );
    const material2 = new THREE.MeshLambertMaterial({map:tower_texture3});
    const cone = new THREE.Mesh( geometry2, material2 );
    cone.position.set(pos_x,pos_y+650,pos_z);
    scene.add( cone );

    const point_light = new THREE.PointLight( 'white', 10, 500 );
    point_light.position.set(pos_x,pos_y+100,pos_z-100); 
    followLight.attach( point_light );  
}

 function add_street_light(pos_x,pos_y,pos_z)
{
    const tower_texture = new THREE.TextureLoader().load('/resources/lamp/text.jpg');
    tower_texture.anisotropy = 32
    tower_texture.wrapS = THREE.RepeatWrapping;
    tower_texture.wrapT = THREE.RepeatWrapping;
    tower_texture.repeat.set(1000, 1000);
    const towerMaterial = new THREE.MeshStandardMaterial({ map: tower_texture});
    let fbxloader = new OBJLoader();
    fbxloader.load('/resources/lamp/street_lamp.obj',  function (object) {
        object.scale.multiplyScalar(2.5);
        object.position.set(pos_x,pos_y,pos_z);
        object.rotation.y = THREE.Math.degToRad(-90);
        object.traverse(  function ( node )
        {
            if ( node.isMesh ) node.material = towerMaterial;
        }); 
        scene.add(object);
        let carlight = new THREE.SpotLight('orange', 10, 500, THREE.Math.degToRad(45), 0.1);
        carlight.position.set(pos_x+50,pos_y+350,pos_z+250);

        let lightTarget = new THREE.Object3D();
        lightTarget.position.set(pos_x+50,pos_y,pos_z+250);
        carlight.target = lightTarget;
        object.attach(carlight);
        object.attach(lightTarget);
        streetlights.push(carlight);
    })
}

 function add_building_1(pos_x,pos_y,pos_z)
{
    let tower_texture1;
    if(texture_type==1)
    {
        tower_texture1 = new THREE.TextureLoader().load('/resources/building/3.jpg',animate);
    }
    else
    {
        tower_texture1 = new THREE.TextureLoader().load('/resources/building/6.jpg',animate);
    }
    tower_texture1.anisotropy = 32
    tower_texture1.wrapS = THREE.RepeatWrapping;
    tower_texture1.wrapT = THREE.RepeatWrapping;
    tower_texture1.repeat.set(1,1);
    // tower_texture1.needsUpdate=true;

    const towerMaterial1 = new THREE.MeshBasicMaterial({ map: tower_texture1});
    towerMaterial1.needsUpdate=true;
    let loader = new OBJLoader();
    loader.load('/resources/apt/Building.obj',  function (object)
    {
        object.scale.multiplyScalar(0.1);
        object.position.set(pos_x,pos_y,pos_z);
        object.rotation.y = THREE.Math.degToRad(90);
        object.traverse(  function ( node ) {

            if ( node.isMesh ) node.material = towerMaterial1;
        
            }); 
        scene.add(object);
        building.push(object);
    })
}


 function add_building_2(pos_x,pos_y,pos_z)
{
    let tower_texture1;
    if(texture_type==1)
    {
        tower_texture1 = new THREE.TextureLoader().load('/resources/building/6.jpg');
    }
    else
    {
        tower_texture1 = new THREE.TextureLoader().load('/resources/building/3.jpg');
    }
    
    tower_texture1.anisotropy = 32
    tower_texture1.wrapS = THREE.RepeatWrapping;
    tower_texture1.wrapT = THREE.RepeatWrapping;
    tower_texture1.repeat.set(1,1);
    // tower_texture1.needsUpdate=true;

    const towerMaterial1 = new THREE.MeshBasicMaterial({ map: tower_texture1});
    towerMaterial1.needsUpdate=true;
    let loader = new OBJLoader();
    loader.load('/resources/apt/Building.obj',  function (object)
    {
        object.scale.multiplyScalar(0.1);
        object.position.set(pos_x,pos_y,pos_z);
        object.rotation.y = THREE.Math.degToRad(270);
        object.traverse(  function ( node ) {

            if ( node.isMesh ) node.material = towerMaterial1;
        
            }); 
        scene.add(object);
        building.push(object);
    })
}

 function add_car_f(body_color,detail_color,pos_x,pos_y,pos_z)
{
    const bodyMaterial = new THREE.MeshPhysicalMaterial( {color: body_color, metalness: 0.6, roughness: 0.4, clearcoat: 0.05, clearcoatRoughness: 0.05} );
    const detailsMaterial = new THREE.MeshStandardMaterial( { color: detail_color, metalness: 1.0, roughness: 0.5 } );
    const glassMaterial = new THREE.MeshPhysicalMaterial( { color: 'white', metalness: 0, roughness: 0.1, transmission: 0.9, transparent: true } );
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( './three.js-master/examples/js/libs/draco/gltf/' );
    const loader = new GLTFLoader();
    loader.setDRACOLoader( dracoLoader );
    loader.load( './three.js-master/examples/models/gltf/ferrari.glb',  function ( gltf )
    {
        const carModel = gltf.scene.children[ 0 ];
        car_f.push(carModel);
        carModel.getObjectByName( 'body' ).material = bodyMaterial;
        carModel.getObjectByName( 'rim_fl' ).material = detailsMaterial;
        carModel.getObjectByName( 'rim_fr' ).material = detailsMaterial;
        carModel.getObjectByName( 'rim_rr' ).material = detailsMaterial;
        carModel.getObjectByName( 'rim_rl' ).material = detailsMaterial;
        carModel.getObjectByName( 'trim' ).material = detailsMaterial;
        carModel.getObjectByName( 'glass' ).material = glassMaterial;

        wheels.push(
            carModel.getObjectByName( 'wheel_fl' ),
            carModel.getObjectByName( 'wheel_fr' ),
            carModel.getObjectByName( 'wheel_rl' ),
            carModel.getObjectByName( 'wheel_rr' )
        );

        carModel.position.set(pos_x,pos_y,pos_z);
        carModel.rotation.y = THREE.Math.degToRad(180);
        carModel.scale.set(100,100,100);
        scene.add(carModel);

        let carlight = new THREE.SpotLight('blue', 500, 500, THREE.Math.degToRad(15), 0.1);
        carlight.position.set(pos_x+50, pos_y+50 , pos_z-30);
        carlight.rotation.y = THREE.Math.degToRad(180);

        let lightTarget = new THREE.Object3D();
        lightTarget.position.set(pos_x-50, pos_y-0, pos_z+1500);
        lightTarget.rotation.y = THREE.Math.degToRad(180);
        carlight.target = lightTarget;
        carModel.attach(carlight);
        carModel.attach(lightTarget);

        let carlight1 = new THREE.SpotLight('blue', 500, 500, THREE.Math.degToRad(15), 0.1);
        carlight1.position.set(pos_x-50, pos_y+50,pos_z -30);
        carlight1.rotation.y = THREE.Math.degToRad(180);

        let lightTarget1 = new THREE.Object3D();
        lightTarget1.position.set(pos_x+50, pos_y-0, pos_z+1500);
        lightTarget1.rotation.y = THREE.Math.degToRad(180);
        carlight1.target = lightTarget1;
        carModel.attach(carlight1);
        carModel.attach(lightTarget1);
    });
}


 function add_car_r(body_color,detail_color,pos_x,pos_y,pos_z)
{
    const bodyMaterial = new THREE.MeshPhysicalMaterial( {color: body_color, metalness: 0.6, roughness: 0.4, clearcoat: 0.05, clearcoatRoughness: 0.05} );
    const detailsMaterial = new THREE.MeshStandardMaterial( { color: detail_color, metalness: 1.0, roughness: 0.5 } );
    const glassMaterial = new THREE.MeshPhysicalMaterial( { color: 'white', metalness: 0, roughness: 0.1, transmission: 0.9, transparent: true } );
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( './three.js-master/examples/js/libs/draco/gltf/' );
    const loader = new GLTFLoader();
    loader.setDRACOLoader( dracoLoader );
    loader.load( './three.js-master/examples/models/gltf/ferrari.glb',  function ( gltf )
    {
        const carModel = gltf.scene.children[ 0 ];
        car_r.push(carModel);
        carModel.getObjectByName( 'body' ).material = bodyMaterial;
        carModel.getObjectByName( 'rim_fl' ).material = detailsMaterial;
        carModel.getObjectByName( 'rim_fr' ).material = detailsMaterial;
        carModel.getObjectByName( 'rim_rr' ).material = detailsMaterial;
        carModel.getObjectByName( 'rim_rl' ).material = detailsMaterial;
        carModel.getObjectByName( 'trim' ).material = detailsMaterial;
        carModel.getObjectByName( 'glass' ).material = glassMaterial;

        wheels.push(
            carModel.getObjectByName( 'wheel_fl' ),
            carModel.getObjectByName( 'wheel_fr' ),
            carModel.getObjectByName( 'wheel_rl' ),
            carModel.getObjectByName( 'wheel_rr' )
        );

        carModel.position.set(pos_x,pos_y,pos_z);
        carModel.scale.set(100,100,100);
        scene.add(carModel);

        let carlight = new THREE.SpotLight('blue', 500, 500, THREE.Math.degToRad(15), 0.1);
        carlight.position.set(pos_x+50, pos_y+50 , pos_z-30);
        let lightTarget = new THREE.Object3D();
        lightTarget.position.set(pos_x+50, pos_y+0, pos_z-1500);
        carlight.target = lightTarget;
        carModel.attach(carlight);
        carModel.attach(lightTarget);

        let carlight1 = new THREE.SpotLight('blue', 500, 500, THREE.Math.degToRad(15), 0.1);
        carlight1.position.set(pos_x-50, pos_y+50,pos_z -30);
        let lightTarget1 = new THREE.Object3D();
        lightTarget1.position.set(pos_x-50, pos_y+0, pos_z-1500);
        carlight1.target = lightTarget1;
        carModel.attach(carlight1);
        carModel.attach(lightTarget1);
    });
}

 function add_birds(pos_x,pos_y,pos_z)
{
    mixer = new THREE.AnimationMixer( scene );
    for ( let i = 0; i !== ANIMATION_GROUPS; ++ i )
    {
        const group = new THREE.AnimationObjectGroup();
        animGroups.push( group );
    }
    
     function addMorph( mesh, clip, speed, duration, x, y, z, fudgeColor, massOptimization )
    {
        mesh = mesh.clone();
        mesh.material = mesh.material.clone();
        mesh.speed = speed;

        if ( fudgeColor )
        {
            mesh.material.color.offsetHSL( 0, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25 );
        }

        if ( massOptimization )
        {
            const index = Math.floor( Math.random() * ANIMATION_GROUPS ),animGroup = animGroups[ index ];
            animGroup.add( mesh );
            if ( ! mixer.existingAction( clip, animGroup ) )
            {
                const randomness = 0.6 * Math.random() - 0.3;
                const phase = ( index + randomness ) / ANIMATION_GROUPS;
                mixer.clipAction( clip, animGroup ).setDuration( duration ).startAt( - duration * phase ).play();
            }
        }
        else
        {
            mixer.clipAction( clip, mesh ).setDuration( duration ).startAt( - duration * Math.random() ).play();
        }

        mesh.position.set( x, y, z );
        mesh.rotation.y = Math.PI / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name="Animal";
        scene.add( mesh );
        morphs.push( mesh );
    }

    const gltfLoader = new GLTFLoader();
    gltfLoader.load( "./three.js-master/examples/models/gltf/Flamingo.glb",  function ( gltf )
    {
        const mesh = gltf.scene.children[0];
        const clip = gltf.animations[0];
        for ( let i=1; i<=5; i += 1 )
        {
            addMorph( mesh, clip, 500, 1 , pos_x -250 -i*500, pos_y, pos_z + i, true, false );

        }
    });

    gltfLoader.load( "./three.js-master/examples/models/gltf/Parrot.glb",  function ( gltf )
    {
        const mesh = gltf.scene.children[0];
        const clip = gltf.animations[0];
        for ( let i=1; i<=5; i += 1 )
        {
            addMorph( mesh, clip, 500, 1 , pos_x + 250 + i*500 , pos_y, pos_z + i, true, false );

        }
    });
}

 function add_chracter()
{
    const configOgro = 
    {
        baseUrl: "./three.js-master/examples/models/md2/ogro/",
        body: "ogro.md2",
        skins: [ 
            "grok.jpg", "ogrobase.png", "arboshak.png", 
            // "ctf_r.png", "ctf_b.png", "darkam.png", 
            // "freedom.png","gib.png", "gordogh.png", 
            // "igdosh.png", "khorne.png", "nabogro.png","sharokh.png" 
        ],
        weapons: [[ "weapon.md2", "weapon.jpg" ]],
        animations: {
            move: "run",
            idle: "stand",
            jump: "jump",
            attack: "attack",
            crouchMove: "cwalk",
            crouchIdle: "cstand",
            crouchAttach: "crattack"
        },
        walkSpeed: 350,
        crouchSpeed: 175
    };

    //making characters
    const nRows = 1;
    const nSkins = configOgro.skins.length;
    nCharacters = nSkins * nRows;    
    for ( let i = 0; i < nCharacters; i ++ )
    {
        const character = new MD2CharacterComplex();
        character.scale = 3;
        character.controls = controls;
        characters.push( character );
    }
    
    //ading to base character
    const baseCharacter = new MD2CharacterComplex();
    baseCharacter.scale = 3;
    baseCharacter.onLoadComplete =  function ()
    {
        let k=0;
        for ( let j=0; j<nRows; j++ )
        {
            for ( let i=0; i<nSkins; i++ )
            {
                const cloneCharacter = characters[k];
                cloneCharacter.shareParts( baseCharacter );
                cloneCharacter.enableShadows( true );
                cloneCharacter.setWeapon(0);
                cloneCharacter.setSkin(i);
                cloneCharacter.root.position.z = ( i - nSkins / 2 ) * 150-600;
                cloneCharacter.root.name = "Character";
                scene.add(cloneCharacter.root);
                k++;
            }
        }
        const gyro = new Gyroscope();
        gyro.add( new THREE.PointLight( 0xff0000, 1, 100 ) );
        characters[Math.floor(nSkins/2)].root.add(camera_3);
    };
    baseCharacter.loadParts( configOgro );
}

 function onWindowResize()
{
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
}

 function onMouseMove(event)
{
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

 function onKeyDown( event )
{
    // console.log(event.code);
    switch ( event.code )
    {
        case 'ArrowUp':
            if(camera_type==1)
            {
                camera_2.position.z-=10;
            }
            break;
        
        case 'ArrowDown':
            if(camera_type==1)
            {
                camera_2.position.z+=10;
            }
            break;
        
        case 'ArrowRight':
            if(camera_type==1)
            {
                camera_2.position.x+=10;
            }
            break;
        
        case 'ArrowLeft':
            if(camera_type==1)
            {
                camera_2.position.x-=10;
                console.log("change");
            }
            break;

        case 'KeyW':
            controls.moveForward = true;
            break;

        case 'KeyS':
            controls.moveBackward = true;
            break;

        case 'KeyA':
            controls.moveLeft = true;
            break;

        case 'KeyD':
            controls.moveRight = true;
            break;

        case 'KeyC':
            camera_change();
            break;
        case 'KeyT':
            if(texture_type==1)
            {
                texture_type=2;
            }
            else
            {
                texture_type=1;
            }
            draw_building(10);
            break;
        case 'KeyO':
            for(let i = 0;i < streetlights.length;i++)
            {
                if(streetlights[i].visible)
                {
                    streetlights[i].visible = false;
                }
                else{
                    streetlights[i].visible = true;
                }
            }
            break;    
    }
}

 function onKeyUp( event )
{
    switch ( event.code )
    {
        case 'KeyW':
            controls.moveForward = false;
            break;

        case 'KeyS':
            controls.moveBackward = false;
            break;

        case 'KeyA':
            controls.moveLeft = false;
            break;

        case 'KeyD':
            controls.moveRight = false;
            break;
    }
}


 function check_collision()
{
    lightTargetf.position.set(characters[0].root.position.x,0,characters[0].root.position.z);
    followLight.target = lightTargetf;

    let bx=100,by=100,bz=100,pos_x,pos_y,pos_z;
    let car_collision=false,building_collision=false;
    let car_x,car_y,car_z,car_bx=100,car_by=100,car_bz=150;
    let building_x,building_y,building_z,building_bx=125,building_by=450,building_bz=200;
    

    // for (let i=1;i<characters.length;i++)
    let i=0;
    {
        pos_x = characters[i].root.position.x;
        pos_z = characters[i].root.position.z;

        if(pos_x>1500)
        {
            characters[i].root.position.x=1500;
        }
        else if(pos_x<-1500)
        {
            characters[i].root.position.x=-1500;
        }

        if(pos_z>1500)
        {
            characters[i].root.position.z=1500;
        }
        else if(pos_x<-1500)
        {
            characters[i].root.position.z=-1500;
        }
    }
    
    
    let car = car_f;
    car[1].position.x= -1175;
    car[0].position.x= -450;

    for(let j=0;j<car.length;j++)
    {
        car_collision=false;
        for (let i=0;i<characters.length;i++)
        {
            pos_x = characters[i].root.position.x;
            pos_y = characters[i].root.position.y;
            pos_z = characters[i].root.position.z;
            
            car_x = car[j].position.x;
            car_y = car[j].position.y;
            car_z = car[j].position.z;

            // const geometry = new THREE.BoxGeometry( 200, 200, 500 );
            // const material = new THREE.MeshBasicMaterial( {color: 'green'} );
            // const cube = new THREE.Mesh( geometry, material );
            // console.log(car[j].position);
            // cube.position.set(car[j].position.x,car[j].position.y,car[j].position.z);
            // scene.add( cube );

            // const geometry1 = new THREE.BoxGeometry( 100, 100, 100 );
            // const material1 = new THREE.MeshBasicMaterial( {color: 'green'} );
            // const cube1 = new THREE.Mesh( geometry1, material1 );
            // console.log(car[j].position);
            // cube1.position.set(characters[i].root.position.x,characters[i].root.position.y,characters[i].root.position.z);
            // scene.add( cube1 );
            
            
            let col_x=false,col_z=false;

            if( (pos_x-bx<car_x+car_bx && pos_x-bx>car_x-car_bx ) || (pos_x+bx<car_x+car_bx && pos_x+bx>car_x-car_bx ) )
            {
                col_x=true;
            }
            if( (pos_z-bz<car_z+car_bz && pos_z-bz>car_z-car_bz ) || (pos_z+bz<car_z+car_bz && pos_z+bz>car_z-car_bz ) )
            {
                col_z=true;
            }

            if(col_x && col_z )
            {
                car_collision=true;
            }
        }

        if(car_collision==true)
        {
            if(j==0)
            {
                car[j].position.x= -1175;
                console.log("Collision");
            }
            else if(j==1)
            {
                car[j].position.x= -450;
                console.log("Collision");
            }
        }
    }

    car = car_r;
    car[1].position.x= +1175;
    car[0].position.x= +450;

    for(let j=0;j<car.length;j++)
    {
        car_collision=false;
        for (let i=0;i<characters.length;i++)
        {
            pos_x = characters[i].root.position.x;
            pos_y = characters[i].root.position.y;
            pos_z = characters[i].root.position.z;
            
            car_x = car[j].position.x;
            car_y = car[j].position.y;
            car_z = car[j].position.z;
            
            let col_x=false,col_z=false;

            if( (pos_x-bx<car_x+car_bx && pos_x-bx>car_x-car_bx ) || (pos_x+bx<car_x+car_bx && pos_x+bx>car_x-car_bx ) )
            {
                col_x=true;
            }
            if( (pos_z-bz<car_z+car_bz && pos_z-bz>car_z-car_bz ) || (pos_z+bz<car_z+car_bz && pos_z+bz>car_z-car_bz ) )
            {
                col_z=true;
            }

            if(col_x && col_z )
            {
                car_collision=true;
            }
        }

        if(car_collision==true)
        {
            if(j==0)
            {
                car[j].position.x= +1175;
                console.log("Collision");
            }
            else if(j==1)
            {
                car[j].position.x= +450;
                console.log("Collision");
            }
        }
    }

    // console.log(building.length);
}

 function car_collision_1()
{

}

 function car_collision_2()
{

}



 function camera_change()
{
    camera_type++;
    camera_type%=3;
    if(camera_type==0)
    {
        camera = camera_1;
        console.log("camera 1");
        scene.activeCamera=camera_1;
        cameraControls_1.enabled=true;
        cameraControls_2.enabled=false;
        cameraControls_3.enabled=false;
    }
    else if(camera_type==1)
    {
        camera = camera_2;
        console.log("camera 2");
        scene.activeCamera=camera_2;
        cameraControls_1.enabled=false;
        cameraControls_2.enabled=true;
        cameraControls_3.enabled=false;
    }
    else if(camera_type==2)
    {
        camera = camera_3;
        console.log("camera 3");
        scene.activeCamera=camera_2;
        cameraControls_1.enabled=false;
        cameraControls_2.enabled=false;
        cameraControls_3.enabled=true;
    }
}

 function animate()
{
    requestAnimationFrame( animate );
    stats.begin();
    render();
    stats.end();
}


 function render()
{
    // console.log(scene.children.length);
    const time = - performance.now() / 1000;
    const delta = clock.getDelta();

    for ( let i = 0; i < wheels.length; i ++ )
    {
        wheels[i].rotation.x = time * Math.PI;
    }

    for ( let i = 0; i < car_f.length; i ++ )
    {
        car_f[i].position.z += 5;
        if(car_f[i].position.z > 5e3/2)
        {
            car_f[i].position.z = -5e3/2;
        }
    }

    for ( let i = 0; i < car_r.length; i ++ )
    {
        car_r[i].position.z -= 5;
        if(car_r[i].position.z < -5e3/2)
        {
            car_r[i].position.z = 5e3/2;
        }
    }

    if (mixer)
    {
        mixer.update( delta );
    }


    for ( let i=0; i<nCharacters; i++ )
    {
        characters[i].update( delta );
    }

    for ( let i=0; i<morphs.length; i++ )
    {
        morph = morphs[i];
        morph.position.x += morph.speed * delta;
        morph.position.x%=5e3/2;
        // if ( morph.position.x > 1e5 )
        // {
        //     morph.position.x = - 1000 ;
        // }
    }
    check_collision();
    renderer.clear();
    renderer.render( scene, camera );
    cameraControls_1.update(delta);
    cameraControls_2.update(delta);
    cameraControls_3.update(delta);
}