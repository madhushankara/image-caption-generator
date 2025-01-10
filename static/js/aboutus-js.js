let scene,
    camera,
    cameraCtrl,
    renderer,
    width = window.innerWidth,
    height = window.innerHeight,
    cx = width / 2,
    cy = height / 2,
    light1,
    light2,
    light3,
    light4,
    conf = { objectRadius: 2.5, objectDepth: 1, nx: Math.round(width / 20), ny: Math.round(height / 15), lookAtZ: 40 },
    meshes;
const lookAt = new THREE.Vector3(0, 0, conf.lookAtZ);
let mouseOver = !1;
const mouse = new THREE.Vector2(),
    mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0).translate(new THREE.Vector3(0, 0, -conf.lookAtZ)),
    mousePosition = new THREE.Vector3(),
    raycaster = new THREE.Raycaster();
function init() {
    (renderer = new THREE.WebGLRenderer({ antialias: !0 })),
        renderer.setSize(width, height),
        document.body.appendChild(renderer.domElement),
        (camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1e3)),
        (camera.position.z = 75),
        (cameraCtrl = new THREE.OrbitControls(camera)),
        (cameraCtrl.enableRotate = !1),
        (cameraCtrl.enableKeys = !1),
        onWindowResize(),
        window.addEventListener("resize", onWindowResize, !1),
        initScene(),
        document.addEventListener("click", initScene),
        document.addEventListener("mouseout", (e) => {
            mouseOver = !1;
        }),
        document.addEventListener("mousemove", (e) => {
            const t = new THREE.Vector3();
            camera.getWorldDirection(t),
                t.normalize(),
                (mousePlane.normal = t),
                (mouseOver = !0),
                (mouse.x = (e.clientX / width) * 2 - 1),
                (mouse.y = 2 * -(e.clientY / height) + 1),
                raycaster.setFromCamera(mouse, camera),
                raycaster.ray.intersectPlane(mousePlane, mousePosition);
        }),
        animate();
}
function initScene() {
    (scene = new THREE.Scene()), (scene.background = new THREE.Color(0)), initLights(), (meshes = []);
    var n = new THREE.MeshStandardMaterial({ color: 16777215, roughness: 0.4, metalness: 0.9 }),
        o = polygonGeometry(6, 0, 0, conf.objectRadius, 0);
    let i;
    var r = Math.cos(Math.PI / 6) * conf.objectRadius * 2,
        a = 1.5 * conf.objectRadius;
    for (let t = 0; t < conf.ny; t++)
        for (let e = 0; e < conf.nx; e++) {
            (i = new THREE.Mesh(o, n)),
                (i.position.x = (-conf.nx / 2 + e) * r + ((t % 2) / 2) * r),
                (i.position.y = (-conf.ny / 2 + t) * a),
                (i.position.z = -200 - rnd(50)),
                (i.rotation.x = rnd(2 * Math.PI, !0)),
                (i.rotation.y = rnd(2 * Math.PI, !0)),
                (i.rotation.z = rnd(2 * Math.PI, !0));
            var s = 1 + rnd(2);
            (i.tween1 = TweenMax.to(i.position, s, { z: 0, ease: Power1.easeOut })), (i.tween2 = TweenMax.to(i.rotation, s + 1.5, { x: 0, y: 0, z: 0, ease: Power1.easeOut })), meshes.push(i), scene.add(i);
        }
}
function initLights() {
    var e = 100,
        t = 300;
    scene.add(new THREE.AmbientLight(16777215)),
        (light1 = new THREE.PointLight(randomColor(), 0.2, t)),
        light1.position.set(0, e, e),
        scene.add(light1),
        (light2 = new THREE.PointLight(randomColor(), 0.2, t)),
        light2.position.set(0, -e, e),
        scene.add(light2),
        (light3 = new THREE.PointLight(randomColor(), 0.2, t)),
        light3.position.set(e, 0, e),
        scene.add(light3),
        (light4 = new THREE.PointLight(randomColor(), 0.2, t)),
        light4.position.set(-e, 0, e),
        scene.add(light4);
}
function animate() {
    requestAnimationFrame(animate), cameraCtrl.update();
    var e = 0.001 * Date.now(),
        t = 100;
    (light1.position.x = Math.sin(0.1 * e) * t),
        (light1.position.y = Math.cos(0.2 * e) * t),
        (light2.position.x = Math.cos(0.3 * e) * t),
        (light2.position.y = Math.sin(0.4 * e) * t),
        (light3.position.x = Math.sin(0.5 * e) * t),
        (light3.position.y = Math.sin(0.6 * e) * t),
        (light4.position.x = Math.sin(0.7 * e) * t),
        (light4.position.y = Math.cos(0.8 * e) * t);
    const n = mouseOver ? mousePosition : new THREE.Vector3(0, 0, 1e4);
    mouseOver && ((n.x = mousePosition.x), (n.y = mousePosition.y), (n.z = conf.lookAtZ));
    for (let e = 0; e < meshes.length; e++) meshes[e].tween1.isActive() || meshes[e].tween2.isActive() || meshes[e].lookAt(n);
    renderer.render(scene, camera);
}
function polygonGeometry(e, t, n, o, i) {
    let r = ppoints(e, t, n, o, i),
        a = new THREE.Shape();
    r.forEach((e, t) => {
        0 === t ? a.moveTo(e[0], e[1]) : a.lineTo(e[0], e[1]);
    }),
        a.lineTo(r[0][0], r[0][1]);
    i = { steps: 1, depth: conf.objectDepth, bevelEnabled: !1 };
    let s = new THREE.ExtrudeBufferGeometry(a, i);
    return s.translate(0, 0, -conf.objectDepth / 2), s;
}
function ppoints(t, n, o, i, r) {
    var a = (2 * Math.PI) / t;
    let s = [],
        h,
        c,
        d;
    for (let e = 0; e < t; e++) (h = Math.PI / 2 + r + e * a), (c = n + Math.cos(h) * i), (d = o + Math.sin(h) * i), s.push([c, d]);
    return s;
}
function onWindowResize() {
    (width = window.innerWidth), (cx = width / 2), (height = window.innerHeight), (cy = height / 2), (camera.aspect = width / height), camera.updateProjectionMatrix(), renderer.setSize(width, height);
}
function rnd(e, t) {
    return t ? 2 * Math.random() * e - e : Math.random() * e;
}
init();
