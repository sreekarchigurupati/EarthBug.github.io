/* Neural-network particle background — three.js */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('WebGLRenderingContext' in window)) return;

  var s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.async = true;
  s.onload = init;
  document.head.appendChild(s);

  function init() {
    var canvas = document.getElementById('webgl-bg');
    if (!canvas || !window.THREE) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 2000);
    camera.position.z = 440;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);

    var N = innerWidth < 700 ? 80 : 150;
    var positions = new Float32Array(N * 3);
    var velocities = [];
    var phases = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 900;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 560;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 420;
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.35,
        (Math.random() - 0.5) * 0.35,
        (Math.random() - 0.5) * 0.35
      ));
      phases[i] = Math.random() * Math.PI * 2;
    }

    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var pMat = new THREE.PointsMaterial({
      color: 0xefeae0,
      size: 3.0,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    var points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    var maxPairs = N * N;
    var linePositions = new Float32Array(maxPairs * 3);
    var lineColors = new Float32Array(maxPairs * 3);
    var lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));
    var lMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    var lines = new THREE.LineSegments(lGeo, lMat);
    scene.add(lines);

    var mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX / innerWidth - 0.5;
      mouse.y = e.clientY / innerHeight - 0.5;
    });
    window.addEventListener('resize', function () {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });

    var scrollY = window.scrollY || 0;
    var scrollTarget = scrollY;
    window.addEventListener('scroll', function () {
      scrollTarget = window.scrollY || 0;
    }, { passive: true });

    var shimmer = 0;
    var VMAX = 1.4;
    window.addEventListener('particle:burst', function (e) {
      shimmer = Math.min(1, shimmer + 0.9);
      var cx = 0, cy = 0;
      if (e && e.detail) {
        cx = (e.detail.x / innerWidth - 0.5) * 800;
        cy = -(e.detail.y / innerHeight - 0.5) * 500;
      }
      var pos = pGeo.attributes.position.array;
      for (var i = 0; i < N; i++) {
        var dx = pos[i * 3] - cx;
        var dy = pos[i * 3 + 1] - cy;
        var len = Math.sqrt(dx * dx + dy * dy) + 0.001;
        var falloff = Math.max(0, 1 - len / 600);
        var push = 0.9 * falloff;
        velocities[i].x += (dx / len) * push + (Math.random() - 0.5) * 0.3;
        velocities[i].y += (dy / len) * push + (Math.random() - 0.5) * 0.3;
        if (velocities[i].x >  VMAX) velocities[i].x =  VMAX;
        if (velocities[i].x < -VMAX) velocities[i].x = -VMAX;
        if (velocities[i].y >  VMAX) velocities[i].y =  VMAX;
        if (velocities[i].y < -VMAX) velocities[i].y = -VMAX;
      }
    });

    var clock = new THREE.Clock();
    var maxDist = 130;
    var maxDistSq = maxDist * maxDist;
    var baseLineOpacity = 0.55;
    var baseSize = 4.0;

    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      var pos = pGeo.attributes.position.array;

      for (var i = 0; i < N; i++) {
        pos[i * 3]     += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;
        if (Math.abs(pos[i * 3])     > 450) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > 280) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > 210) velocities[i].z *= -1;
      }
      pGeo.attributes.position.needsUpdate = true;

      var li = 0;
      for (var a = 0; a < N; a++) {
        for (var b = a + 1; b < N; b++) {
          var dx = pos[a * 3]     - pos[b * 3];
          var dy = pos[a * 3 + 1] - pos[b * 3 + 1];
          var dz = pos[a * 3 + 2] - pos[b * 3 + 2];
          var d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < maxDistSq) {
            var alpha = 1 - Math.sqrt(d2) / maxDist;
            var pulse = 0.6 + 0.4 * Math.sin(t * 2 + phases[a] + phases[b]);
            var k = alpha * pulse;
            linePositions[li * 3]     = pos[a * 3];
            linePositions[li * 3 + 1] = pos[a * 3 + 1];
            linePositions[li * 3 + 2] = pos[a * 3 + 2];
            lineColors[li * 3]     = 0.78 * k;
            lineColors[li * 3 + 1] = 1.00 * k;
            lineColors[li * 3 + 2] = 0.24 * k;
            li++;
            linePositions[li * 3]     = pos[b * 3];
            linePositions[li * 3 + 1] = pos[b * 3 + 1];
            linePositions[li * 3 + 2] = pos[b * 3 + 2];
            lineColors[li * 3]     = 0.50 * k;
            lineColors[li * 3 + 1] = 0.70 * k;
            lineColors[li * 3 + 2] = 1.00 * k;
            li++;
          }
        }
      }
      lGeo.setDrawRange(0, li);
      lGeo.attributes.position.needsUpdate = true;
      lGeo.attributes.color.needsUpdate = true;

      shimmer *= 0.94;
      scrollY += (scrollTarget - scrollY) * 0.08;
      var maxScroll = Math.max(1, (document.body.scrollHeight - innerHeight));
      var scrollProg = Math.min(1, scrollY / maxScroll);

      lMat.opacity = baseLineOpacity + shimmer * 0.45;
      pMat.size    = baseSize + shimmer * 3.0;

      var rotSpeed = 0.0009 + shimmer * 0.006;
      points.rotation.y += rotSpeed;
      lines.rotation.y   = points.rotation.y;
      points.rotation.x  = scrollProg * 0.35 + shimmer * 0.05;
      lines.rotation.x   = points.rotation.x;

      camera.position.x += (mouse.x * 90 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 70 - camera.position.y) * 0.03;
      camera.position.z = 440 - scrollProg * 110;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();
  }
})();
