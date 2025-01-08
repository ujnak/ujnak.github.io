/*
 * Motion - https://motion.dev/のQuick Startを実装します。
 * Ref: https://motion.dev/docs/quick-start
 */
import { animate, scroll, frame, stagger } from "https://cdn.jsdelivr.net/npm/motion@11.16.0/+esm";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@v0.149.0/build/three.module.js";

/*
 * What can be animated? - Three.js
 */
var scene = new THREE.Scene({ alpha: true });
const main = document.getElementById("three-container");
var camera = new THREE.PerspectiveCamera(
    25,
    main.offsetWidth / main.offsetHeight,
    0.1,
    1000
);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(main.offsetWidth, main.offsetHeight);
main.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshPhongMaterial({ color: 0x4ff0b7 });
var cube = new THREE.Mesh(geometry, material);
renderer.setClearColor(0xffffff, 0);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, 2);
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);
scene.add(directionalLight);
scene.add(cube);

camera.position.z = 5;

function rad(degrees) {
    return degrees * (Math.PI / 180)
};

/**
 * Create Three.js render loop using Motion's frameloop
 */
frame.render(() => renderer.render(scene, camera), true);

/*
 * Create an animation - Rotate
 */
var animateRotate = null;
const controlsRotate = apex.actions.createContext('controls-rotate', document.getElementById('ROTATE'));
controlsRotate.add([
    {
        name: "ANIMATE",
        action: (event, element, args) => {
            animateRotate = animate(
                ".box",
                { 
                    rotate: [ 0, 360 ]
                },
                {
                    duration: 1,
                    repeat: 3
                }
            );
            animateRotate.then(() => {
                apex.debug.info('rotate is completed.');
            });
            apex.debug.info('rotate is started.');
        }
    },
    {
        name: "STOP",
        action: (event, element, args) => {
            if ( animateRotate !== null ) {
                animateRotate.stop();
                apex.debug.info('rotate is stopped.');
            }
        }
    }
]);

/*
 * What can be animated? - Three.js
 */
var animateThree = null;
const controlsThree = apex.actions.createContext('controls-three', document.getElementById('THREE'));
controlsThree.add([
    {
        name: "ANIMATE",
        action: (event, element, args) => {
            animateThree = animate(
                cube.rotation,
                { 
                    y: rad(360), z: rad(360) 
                },
                { 
                    duration: 10, 
                    repeat: Infinity,
                    ease: "linear"
                }
            );
            animateThree.then(() => {
                apex.debug.info('three is completed.');
            });
            apex.debug.info('three is started.');
        }
    },
    {
        name: "STOP",
        action: (event, element, args) => {
            if ( animateThree !== null ) {
                animateThree.stop();
                apex.debug.info('three is stopped.');
            }
        }
    }
]);

/**
 * Customizing animations - Basic animation
 */
var animateBasic = null;
const controlsBasic = apex.actions.createContext('controls-basic', document.getElementById('BASIC'));
controlsBasic.add([
    {
        name: "ANIMATE",
        action: (event, element, args) => {
            animateBasic = animate(
                ".box2",
                {
                    scale: [0.4, 1]
                },
                {
                    ease: "circInOut",
                    duration: 1,
                    repeat: 3
                }
            );
            animateBasic.then(() => {
                apex.debug.info('basic is completed.');
            });
            apex.debug.info('basic is started.');
        }
    },
    {
        name: "STOP",
        action: (event, element, args) => {
            if ( animateBasic !== null ) {
                animateBasic.stop();
                apex.debug.info('basic is stopped.');
            }
        }
    }
]);

/**
 * Customizing animations - Spring
 */
var animateSpring = null;
const controlsSpring = apex.actions.createContext('controls-spring', document.getElementById('SPRING'));
controlsSpring.add([
    {
        name: "ANIMATE",
        action: (event, element, args) => {
            animateSpring = animate(
                ".box3",
                {
                    rotate: [ 0, 90 ]
                },
                {
                    type: "spring",
                    repeat: Infinity,
                    repeatDelay: 0.2
                }
            );
            animateSpring.then(() => {
                apex.debug.info('spring is completed.');
            });
            apex.debug.info('spring is started.');
        }
    },
    {
        name: "STOP",
        action: (event, element, args) => {
            if ( animateSpring !== null ) {
                animateSpring.stop();
                apex.debug.info('spring is stopped.');
            }
        }
    }
]);

/**
 * Customizing animations - Stagger
 */
var animateStagger = null;
const controlsStagger = apex.actions.createContext('controls-stagger', document.getElementById('STAGGER'));
controlsStagger.add([
    {
        name: "ANIMATE",
        action: (event, element, args) => {
            animateStagger = animate(
                ".example li",
                {
                    opacity: 1, y: [50, 0]
                },
                {
                    delay: stagger(0.05),
                    repeat: 3
                }
            );
            animateStagger.then(() => {
                apex.debug.info('stagger is completed.');
            });
            apex.debug.info('stagger is started.');
        }
    },
    {
        name: "STOP",
        action: (event, element, args) => {
            if ( animateStagger !== null ) {
                animateStagger.stop();
                apex.debug.info('stagger is stopped.');
            }
        }
    }
]);