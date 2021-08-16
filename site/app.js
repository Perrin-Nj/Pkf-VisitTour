const container = document.body
    //get Tooltp from .Html
const tooltip = document.querySelector('.tooltip')

let tooltipActive = false

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
const renderer = new THREE.WebGLRenderer();


renderer.setSize(window.innerWidth, window.innerHeight);

container.appendChild(renderer.domElement);


//controls.update() must be called after any manual changes to the camera's transform

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 0.2
    //to enable rotation
    //controls.autoRotate = true
    //to enable zoom
controls.enableZoom = false
    // controls.zoomSpeed = 0.1
    // controls.minZoom = 0.8
    // controls.maxZoom = 1
camera.position.set(-1, 0, 0)
controls.update()

// creating sphere 
const geometry = new THREE.SphereGeometry(50, 32, 16);

const texture = new THREE.TextureLoader().load("assets/essaie2.jpg");
texture.wrapS = THREE.RepeatWrapping
texture.repeat.x = -1
const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

//tooltip


function addToolTip(position, name) {

    let spriteMap = new THREE.TextureLoader().load('assets/up direction.png');
    let spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });
    let sprite = new THREE.Sprite(spriteMaterial);
    sprite.name = name
        //Enable tooltip to not follow mouvement of the Camera
    sprite.position.copy(position.clone().normalize().multiplyScalar(30))
        //to  scale up the sprite
    sprite.scale.multiplyScalar(2)
    scene.add(sprite);
}
//rendering
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

function onResize() {
    renderer.setSize(window.innerWidth, innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
}

const rayCaster = new THREE.Raycaster()

function onClick(e) {
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1,
    )
    let rayCaster = new THREE.Raycaster()
    rayCaster.setFromCamera(mouse, camera)
    let intersects = rayCaster.intersectObjects(scene.children)
    intersects.forEach(function(intersect) {
            if (intersect.object.type === 'Sprite') {
                console.log(intersect.object.name)
            }
        })
        //--------to get the position of the sprite so that we can place direction in front of maybe a door--------------
        // let intersect = rayCaster.intersectObject(sphere)
        // if (intersect.length > 0) {
        //     addToolTip(intersect[0].point)
        //     console.log(intersect[0].point)
        // }

}

function onMouseMove(e) {
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1,
    )
    let rayCaster = new THREE.Raycaster()

    rayCaster.setFromCamera(mouse, camera)
    let foundSprite = false
    let intersects = rayCaster.intersectObjects(scene.children)
    intersects.forEach(function(intersect) {
        if (intersect.object.type === 'Sprite') {
            let p = intersect.object.position.clone().project(camera)
            tooltip.style.top = ((-1 * p.y + 1) * window.innerHeight / 2) + 'px'
            tooltip.style.left = ((p.x + 1) * window.innerWidth / 2) + 'px'
            tooltip.classList.add('is-active')
            tooltipActive = true
            foundSprite = true
        }
    })

    if (foundSprite === false && tooltipActive) {
        tooltip.classList.remove('is-active')
    }
}

addToolTip(new THREE.Vector3(0.04881278659140563, -49.94631700490292, -0.5402453268611607), 'Entrance')

window.addEventListener('resize', onResize)
container.addEventListener('click', onClick)
container.addEventListener('mousemove', onMouseMove)