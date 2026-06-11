/* hero3d.js
 * --------------------------------------------------------------------
 * Optional Three.js animated particle-network background for the intro
 * hero section. Purely additive and non-destructive:
 *   - renders into #hero-bg-canvas, which sits at z-index 0 behind all
 *     hero content (content is z-index 2) with pointer-events: none, so
 *     it never intercepts clicks or affects layout.
 *   - guards on THREE + canvas presence and silently no-ops if either is
 *     missing, so the page works exactly as before if this file (or the
 *     CDN) is removed.
 * To revert: delete this file, its two <script> tags, and the
 * <canvas id="hero-bg-canvas"> element from index.html.
 * -------------------------------------------------------------------- */
(function () {
    'use strict';

    function initHero3D() {
        var canvas = document.getElementById('hero-bg-canvas');
        if (!canvas || typeof window.THREE === 'undefined') return;

        // Respect users who prefer reduced motion.
        var reduceMotion = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var width = canvas.clientWidth || canvas.parentElement.clientWidth;
        var height = canvas.clientHeight || canvas.parentElement.clientHeight;

        var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height, false);
        // Dark navy canvas so the blue particle network reads as a glowing
        // network (opaque, so the right-side portrait still layers on top).
        renderer.setClearColor(new THREE.Color(0x0b1020), 1);

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.z = 60;

        var COUNT = 130;
        var positions = new Float32Array(COUNT * 3);
        var vel = [];
        for (var i = 0; i < COUNT; i++) {
            positions[i * 3]     = (Math.random() - 0.5) * 120;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 70;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
            vel.push({
                x: (Math.random() - 0.5) * 0.08,
                y: (Math.random() - 0.5) * 0.08,
                z: (Math.random() - 0.5) * 0.08
            });
        }

        var pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        // On-brand coral points + soft gray links, tuned to read on the
        // light (#eceeec) hero background without overpowering the text.
        var pMat = new THREE.PointsMaterial({ color: 0x4db3ff, size: 1.7, transparent: true, opacity: 0.9 });
        var points = new THREE.Points(pGeo, pMat);
        scene.add(points);

        var lineGeo = new THREE.BufferGeometry();
        var lineMat = new THREE.LineBasicMaterial({ color: 0x4db3ff, transparent: true, opacity: 0.22 });
        var lineSeg = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(lineSeg);

        var mouseX = 0, mouseY = 0;
        var host = canvas.parentElement || canvas;
        window.addEventListener('mousemove', function (e) {
            var r = host.getBoundingClientRect();
            mouseX = ((e.clientX - r.left) / r.width - 0.5) * 2;
            mouseY = ((e.clientY - r.top) / r.height - 0.5) * 2;
        }, { passive: true });

        function updateLines() {
            var pos = pGeo.attributes.position.array;
            var verts = [];
            var maxD2 = 18 * 18;
            for (var a = 0; a < COUNT; a++) {
                for (var b = a + 1; b < COUNT; b++) {
                    var dx = pos[a * 3] - pos[b * 3];
                    var dy = pos[a * 3 + 1] - pos[b * 3 + 1];
                    var dz = pos[a * 3 + 2] - pos[b * 3 + 2];
                    if (dx * dx + dy * dy + dz * dz < maxD2) {
                        verts.push(pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2],
                                   pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]);
                    }
                }
            }
            lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        }

        function render() {
            var pos = pGeo.attributes.position.array;
            for (var i = 0; i < COUNT; i++) {
                pos[i * 3]     += vel[i].x;
                pos[i * 3 + 1] += vel[i].y;
                pos[i * 3 + 2] += vel[i].z;
                if (pos[i * 3] > 60 || pos[i * 3] < -60) vel[i].x *= -1;
                if (pos[i * 3 + 1] > 35 || pos[i * 3 + 1] < -35) vel[i].y *= -1;
                if (pos[i * 3 + 2] > 30 || pos[i * 3 + 2] < -30) vel[i].z *= -1;
            }
            pGeo.attributes.position.needsUpdate = true;
            updateLines();
            points.rotation.y += 0.0008;
            lineSeg.rotation.y = points.rotation.y;
            camera.position.x += (mouseX * 12 - camera.position.x) * 0.04;
            camera.position.y += (-mouseY * 8 - camera.position.y) * 0.04;
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
        }

        function animate() {
            render();
            requestAnimationFrame(animate);
        }

        if (reduceMotion) {
            // Draw a single static frame instead of animating.
            updateLines();
            renderer.render(scene, camera);
        } else {
            animate();
        }

        window.addEventListener('resize', function () {
            var w = canvas.clientWidth || canvas.parentElement.clientWidth;
            var h = canvas.clientHeight || canvas.parentElement.clientHeight;
            if (!w || !h) return;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h, false);
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHero3D);
    } else {
        initHero3D();
    }
})();
