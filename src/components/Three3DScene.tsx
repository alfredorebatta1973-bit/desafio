import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sparkles, Trophy, RotateCcw, Eye, Layers } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const Three3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [materialMode, setMaterialMode] = useState<'gold' | 'neon' | 'cyber'>('gold');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Renderer & Software WebGL detection
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b0716');
    scene.fog = new THREE.FogExp2('#0b0716', 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3, 7);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;

    // 3. Environment Lighting (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x221144, 1.2);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffd700, 2.0);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const pinkLight = new THREE.PointLight(0xff007f, 3, 10);
    pinkLight.position.set(-4, 2, -3);
    scene.add(pinkLight);

    // 4. Procedural 3-12 Part Composite Hero Model (Viral Trophy & Arena)
    const trophyGroup = new THREE.Group();
    scene.add(trophyGroup);

    // Part 1: Circular Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.4, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1a0b36, roughness: 0.3, metalness: 0.8 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.8;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    trophyGroup.add(baseMesh);

    // Part 2: Gold Ring Trim on Base
    const ringGeo = new THREE.TorusGeometry(1.85, 0.08, 16, 48);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.15, metalness: 0.95 });
    const ringMesh = new THREE.Mesh(ringGeo, goldMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.6;
    trophyGroup.add(ringMesh);

    // Part 3: Central Stem Pillar
    const stemGeo = new THREE.CylinderGeometry(0.4, 0.6, 1.5, 16);
    const stemMesh = new THREE.Mesh(stemGeo, goldMat);
    stemMesh.position.y = -0.9;
    stemMesh.castShadow = true;
    trophyGroup.add(stemMesh);

    // Part 4: Trophy Cup Main Bowl
    const cupGeo = new THREE.CylinderGeometry(1.4, 0.5, 1.8, 32, 1, true);
    const cupMat = new THREE.MeshPhysicalMaterial({
      color: 0xffd700,
      roughness: 0.2,
      metalness: 0.9,
      clearcoat: 1.0,
      side: THREE.DoubleSide,
    });
    const cupMesh = new THREE.Mesh(cupGeo, cupMat);
    cupMesh.position.y = 0.4;
    cupMesh.castShadow = true;
    trophyGroup.add(cupMesh);

    // Part 5: Cup Inner Bowl Bottom
    const bowlBottomGeo = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const bowlBottomMesh = new THREE.Mesh(bowlBottomGeo, goldMat);
    bowlBottomMesh.position.y = -0.5;
    bowlBottomMesh.rotation.x = Math.PI;
    trophyGroup.add(bowlBottomMesh);

    // Part 6 & 7: Left and Right Handles (Torus arcs)
    const handleGeo = new THREE.TorusGeometry(0.7, 0.09, 16, 32, Math.PI * 1.2);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xff8800, roughness: 0.2, metalness: 0.9 });
    
    const leftHandle = new THREE.Mesh(handleGeo, handleMat);
    leftHandle.position.set(-1.3, 0.4, 0);
    leftHandle.rotation.z = Math.PI / 4;
    trophyGroup.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeo, handleMat);
    rightHandle.position.set(1.3, 0.4, 0);
    rightHandle.rotation.z = -Math.PI / 4 - Math.PI;
    trophyGroup.add(rightHandle);

    // Part 8: Floating Crystal Star Emblem on top
    const starGeo = new THREE.OctahedronGeometry(0.6, 0);
    const starMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f2fe,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
      ior: 2.4,
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    starMesh.position.y = 1.8;
    trophyGroup.add(starMesh);

    // Ground Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(255, 0, 127, 0.5)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.0;
    scene.add(shadowPlane);

    // 5. Animation Loop (60fps)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      trophyGroup.rotation.y += delta * 0.8 * rotationSpeed;
      starMesh.position.y = 1.8 + Math.sin(time * 3) * 0.15;
      starMesh.rotation.x += delta;
      starMesh.rotation.y += delta * 1.5;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.innerHTML = '';
      }
      renderer.dispose();
    };
  }, [rotationSpeed]);

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-purple-800/40 shadow-2xl bg-[#0b0716]">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md border border-purple-500/40 px-4 py-2 rounded-2xl flex items-center gap-2">
        <Trophy className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-black text-white font-['Outfit',sans-serif]">
          Escena 3D PBR Studio · Trofeo Viral
        </span>
      </div>

      {/* Bottom Collapsible HUD Control Dock */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl transition-all duration-300 ${hudCollapsed ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div className="bg-slate-950/90 backdrop-blur-md border border-pink-500/40 p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Velocidad Giro:</span>
            {[0.5, 1.0, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  soundFx.playClick();
                  setRotationSpeed(spd);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  rotationSpeed === spd
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setHudCollapsed(true);
            }}
            className="text-xs font-bold text-slate-400 hover:text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors"
          >
            ▾ Ocultar Controles
          </button>
        </div>
      </div>

      {/* Expand button when collapsed */}
      {hudCollapsed && (
        <button
          onClick={() => {
            soundFx.playClick();
            setHudCollapsed(false);
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg transition-all"
        >
          ▴ Mostrar Controles 3D
        </button>
      )}

    </div>
  );
};
