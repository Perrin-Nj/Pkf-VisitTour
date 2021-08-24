const container = document.body
    //get Tooltp from .Html
const tooltip = document.querySelector('.tooltip')

let spriteActive = false

class Scene {
    constructor(panorama) {
        this.panorama = panorama
        this.points = []
        this.sprites = []
        this.scene = null
    }

    createScene(scene) {
        this.scene = scene
            // creating sphere 
        const geometry = new THREE.SphereGeometry(50, 32, 16);

        const texture = new THREE.TextureLoader().load(this.image);
        texture.wrapS = THREE.RepeatWrapping
        texture.repeat.x = -1
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, })
        material.transparent = true
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere)
        this.points.forEach(this.addToolTip.bind(this))

    }

    addPoint(point) {
        this.points.push(point);
    }

    addToolTip(point) {

        let spriteMap = new THREE.TextureLoader().load('assets/up direction.png');
        let spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });
        let sprite = new THREE.Sprite(spriteMaterial);
        sprite.name = point.name
            //Enable tooltip to not follow mouvement of the Camera
        sprite.position.copy(point.position.clone().normalize().multiplyScalar(30))
            //to  scale up the sprite
        sprite.scale.multiplyScalar(2)
        this.scene.add(sprite);
        this.sprites.push(sprite);
    }
}

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

let s = new Scene("assets/essaie1.jpg")
let s2 = new Scene("assets/essaie2.jpg")

s.createScene(scene)
s.addPoint({
    position: new THREE.Vector3(0.04881278659140563, -49.94631700490292, -0.5402453268611607),
    name: "Entrance",
    scene: s2
})

s2.addPoint({
    position: new THREE.Vector3(0.04881278659140563, -49.94631700490292, -0.5402453268611607),
    name: "Return",
    scene: s
})

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
                TweenLite.to(sphere.material, 1, {
                    opacity: 0.2
                })
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
            tooltip.innerHTML = intersect.object.name
            spriteActive = intersect.object
            foundSprite = true
            TweenLite.to(intersect.object.scale, 0.6, {
                x: 4,
                y: 4,
                z: 4,
            })
        }
    })

    if (foundSprite === false && spriteActive) {
        tooltip.classList.remove('is-active')
        TweenLite.to(spriteActive.scale, 0.6, {
            x: 2,
            y: 2,
            z: 2,
        })
        spriteActive = false
    }
}

window.addEventListener('resize', onResize)
container.addEventListener('click', onClick)
container.addEventListener('mousemove', onMouseMove)