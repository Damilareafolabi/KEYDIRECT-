import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  X, 
  Upload, 
  Eye, 
  RotateCw, 
  Maximize2, 
  Play, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { 
  VirtualRoomMediaItem, 
  getVirtualRoomMedia, 
  addVirtualRoomMedia, 
  deleteVirtualRoomMedia, 
  BusinessProfile,
  getBusinessProfile
} from '../utils/lazyCeoStorage';

interface VirtualRoom3DProps {
  isOpen: boolean;
  onClose: () => void;
  businessProfile?: BusinessProfile;
  onRequireUpgrade?: () => void;
}

export const VirtualRoom3D: React.FC<VirtualRoom3DProps> = ({
  isOpen,
  onClose,
  businessProfile = getBusinessProfile(),
  onRequireUpgrade,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mediaItems, setMediaItems] = useState<VirtualRoomMediaItem[]>(() => getVirtualRoomMedia());
  const [selectedItem, setSelectedItem] = useState<VirtualRoomMediaItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeCameraAngle, setActiveCameraAngle] = useState<'overview' | 'wallA' | 'wallB' | 'center'>('overview');

  // New Media Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newCategory, setNewCategory] = useState('Products & Showroom');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const isProOrEnterprise = businessProfile.tier === 'PRO' || businessProfile.tier === 'ENTERPRISE';
  const canUploadMore = isProOrEnterprise || mediaItems.length < 2;

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    let animationFrameId: number;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c10);
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.025);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 8.5);

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Room Architecture (Walls, Floor, Ceiling)
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // Floor with glossy reflections
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x12151e,
      roughness: 0.15,
      metalness: 0.6,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Floor Grid lines
    const gridHelper = new THREE.GridHelper(24, 24, 0x00f0ff, 0x1e2638);
    gridHelper.position.y = 0.01;
    roomGroup.add(gridHelper);

    // Back Wall
    const backWallGeo = new THREE.PlaneGeometry(24, 9);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0e111a,
      roughness: 0.8,
      metalness: 0.1,
    });
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 4.5, -12);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(backWallGeo, wallMat);
    leftWall.position.set(-12, 4.5, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(backWallGeo, wallMat);
    rightWall.position.set(12, 4.5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    roomGroup.add(rightWall);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x00f0ff, 0xff6b00, 0.6);
    scene.add(hemiLight);

    // Cyan Neon Accent Lights
    const spotCyan = new THREE.SpotLight(0x00f0ff, 35, 25, Math.PI / 4, 0.5, 1);
    spotCyan.position.set(-6, 7.5, 3);
    spotCyan.castShadow = true;
    scene.add(spotCyan);

    // Orange Neon Accent Lights
    const spotOrange = new THREE.SpotLight(0xff6b00, 35, 25, Math.PI / 4, 0.5, 1);
    spotOrange.position.set(6, 7.5, 3);
    spotOrange.castShadow = true;
    scene.add(spotOrange);

    // Center Stage Spotlight
    const centerSpot = new THREE.SpotLight(0xffffff, 40, 20, Math.PI / 5, 0.3);
    centerSpot.position.set(0, 8, 2);
    centerSpot.target.position.set(0, 2, -10);
    scene.add(centerSpot);
    scene.add(centerSpot.target);

    // 5. Interactive 3D Media Frames & Video Screens
    const frameMeshes: { mesh: THREE.Mesh; item: VirtualRoomMediaItem }[] = [];
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Helper to generate canvas texture for media frames
    const createMediaTexture = (title: string, category: string, isVideo: boolean, customUrl?: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 340;
      const ctx = canvas.getContext('2d')!;

      // Background
      const grad = ctx.createLinearGradient(0, 0, 512, 340);
      grad.addColorStop(0, '#101522');
      grad.addColorStop(1, '#080a10');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 340);

      // Neon Frame border
      ctx.strokeStyle = isVideo ? '#ff6b00' : '#00f0ff';
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, 498, 326);

      // Icon circle
      ctx.fillStyle = isVideo ? 'rgba(255, 107, 0, 0.2)' : 'rgba(0, 240, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(256, 130, 48, 0, Math.PI * 2);
      ctx.fill();

      // Play or Image Icon text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isVideo ? '▶ LIVE 3D VIDEO' : '🖼️ 3D GALLERY ASSET', 256, 140);

      // Category Pill
      ctx.fillStyle = isVideo ? '#ff6b00' : '#00f0ff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`[ ${category.toUpperCase()} ]`, 256, 210);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(title.slice(0, 32) + (title.length > 32 ? '...' : ''), 256, 255);

      // Click to inspect hint
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '14px sans-serif';
      ctx.fillText('CLICK TO INSPECT IN HD', 256, 290);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    // Frame positions in the room
    const framePositions = [
      { pos: new THREE.Vector3(-6, 3.8, -11.8), rot: new THREE.Euler(0, 0, 0), size: [4.8, 3.2] },
      { pos: new THREE.Vector3(6, 3.8, -11.8), rot: new THREE.Euler(0, 0, 0), size: [4.8, 3.2] },
      { pos: new THREE.Vector3(-11.8, 3.8, -4), rot: new THREE.Euler(0, Math.PI / 2, 0), size: [4.8, 3.2] },
      { pos: new THREE.Vector3(-11.8, 3.8, 4), rot: new THREE.Euler(0, Math.PI / 2, 0), size: [4.8, 3.2] },
      { pos: new THREE.Vector3(11.8, 3.8, -4), rot: new THREE.Euler(0, -Math.PI / 2, 0), size: [4.8, 3.2] },
      { pos: new THREE.Vector3(11.8, 3.8, 4), rot: new THREE.Euler(0, -Math.PI / 2, 0), size: [4.8, 3.2] },
    ];

    mediaItems.slice(0, 6).forEach((item, index) => {
      const config = framePositions[index];
      if (!config) return;

      // Frame Mount
      const frameHolderGeo = new THREE.BoxGeometry(config.size[0] + 0.3, config.size[1] + 0.3, 0.15);
      const frameHolderMat = new THREE.MeshStandardMaterial({
        color: 0x181e2b,
        metalness: 0.8,
        roughness: 0.2,
      });
      const holder = new THREE.Mesh(frameHolderGeo, frameHolderMat);
      holder.position.copy(config.pos);
      holder.rotation.copy(config.rot);
      roomGroup.add(holder);

      // Artwork Canvas screen
      const screenGeo = new THREE.PlaneGeometry(config.size[0], config.size[1]);
      const isVid = item.mediaType === 'video';
      const texture = createMediaTexture(item.title, item.category, isVid, item.url);
      const screenMat = new THREE.MeshBasicMaterial({ map: texture });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      
      // Slightly in front of holder
      screen.position.copy(config.pos);
      screen.rotation.copy(config.rot);
      screen.translateZ(0.08);

      screen.userData = { mediaItem: item };
      roomGroup.add(screen);
      frameMeshes.push({ mesh: screen, item });
    });

    // Center 3D Holographic Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(2, 2.4, 0.6, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0d121c,
      metalness: 0.9,
      roughness: 0.1,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, 0.3, 0);
    roomGroup.add(pedestal);

    // Floating Brand Monolith on Pedestal
    const brandMonolithGeo = new THREE.OctahedronGeometry(1.2, 0);
    const brandMonolithMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x005577,
      metalness: 0.95,
      roughness: 0.05,
      wireframe: true,
    });
    const brandMonolith = new THREE.Mesh(brandMonolithGeo, brandMonolithMat);
    brandMonolith.position.set(0, 2.2, 0);
    roomGroup.add(brandMonolith);

    // 6. Mouse Controls & Orbit Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        targetRotationY += deltaX * 0.005;
        targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX + deltaY * 0.003));
        prevMouseX = clientX;
        prevMouseY = clientY;
      }

      // Raycast for hover pointer
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((clientY - rect.top) / container.clientHeight) * 2 + 1;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(frameMeshes.map((f) => f.mesh));
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData.mediaItem) {
          setSelectedItem(hit.userData.mediaItem);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.fov = Math.max(35, Math.min(80, camera.fov + e.deltaY * 0.03));
      camera.updateProjectionMatrix();
    };

    container.addEventListener('mousedown', handlePointerDown);
    container.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('click', handleClick);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Touch support
    container.addEventListener('touchstart', handlePointerDown);
    container.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    // 7. Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth camera interpolation
      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 8, delta);
      currentRotationX = THREE.MathUtils.damp(currentRotationX, targetRotationX, 8, delta);

      camera.position.x = Math.sin(currentRotationY) * 8.5;
      camera.position.z = Math.cos(currentRotationY) * 8.5;
      camera.position.y = 3.2 + currentRotationX * 4;
      camera.lookAt(0, 2.5, 0);

      // Rotate floating monolith
      brandMonolith.rotation.y += delta * 0.8;
      brandMonolith.rotation.x += delta * 0.4;
      brandMonolith.position.y = 2.2 + Math.sin(clock.getElapsedTime() * 1.5) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      container.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handlePointerDown);
      container.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isOpen, mediaItems]);

  if (!isOpen) return null;

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (!newTitle.trim()) {
      setUploadError('Please enter a title for your media item.');
      return;
    }
    if (!newMediaUrl.trim()) {
      setUploadError('Please enter a media URL or image preview.');
      return;
    }
    if (newMediaType === 'video' && !isProOrEnterprise) {
      setUploadError('Video uploads require LazyCEO Pro ($29/mo) or Enterprise.');
      return;
    }
    if (!canUploadMore) {
      setUploadError('Free tier is limited to 2 media items. Upgrade to Pro for unlimited showcase items!');
      return;
    }

    const newItem: VirtualRoomMediaItem = {
      id: `vrm-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Uploaded to LazyCEO 3D Virtual Showroom.',
      mediaType: newMediaType,
      url: newMediaUrl.trim(),
      uploaderName: businessProfile.businessName,
      uploaderBusiness: businessProfile.industry,
      category: newCategory,
      uploadedAt: new Date().toISOString().split('T')[0],
      wallPosition: mediaItems.length % 6,
    };

    const updated = addVirtualRoomMedia(newItem);
    setMediaItems(updated);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewMediaUrl('');
    }, 1200);
  };

  const handleDeleteItem = (id: string) => {
    const updated = deleteVirtualRoomMedia(id);
    setMediaItems(updated);
    setSelectedItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-stone-950 text-white rounded-3xl max-w-6xl w-full h-[90vh] overflow-hidden shadow-2xl border border-cyan-500/30 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <RotateCw className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-base sm:text-lg tracking-tight text-white">
                  LazyCEO 3D Virtual Showroom
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  REAL-TIME 3D
                </span>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  {businessProfile.tier} TIER
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Drag to orbit · Scroll to zoom · Click any framed artwork or video screen to inspect
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload to 3D Room</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Viewport Canvas Container */}
        <div className="flex-1 relative w-full h-full bg-stone-950 overflow-hidden select-none">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Floating Navigation Controls Overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-stone-800 shadow-xl text-xs">
            <span className="text-stone-400 font-medium hidden sm:inline">Orbit Showroom:</span>
            <span className="px-2 py-1 bg-stone-800 rounded-lg text-cyan-400 font-bold">
              {mediaItems.length} Mounted Assets
            </span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-300 text-[11px]">
              Drag to Rotate · Scroll to Zoom
            </span>
          </div>

          {/* Tier indicator pill */}
          <div className="absolute top-4 left-4 z-20 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-800 text-[11px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-stone-300 font-semibold">
              Showcase Capacity: <strong>{mediaItems.length}</strong> / {isProOrEnterprise ? 'Unlimited' : '2'}
            </span>
            {!isProOrEnterprise && onRequireUpgrade && (
              <button
                onClick={onRequireUpgrade}
                className="text-orange-400 hover:text-orange-300 font-bold ml-1 cursor-pointer underline"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* Detail Inspector Modal when user clicks an artwork */}
        {selectedItem && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div 
              className="bg-stone-900 text-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-700 relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-stone-850 flex items-center justify-between border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 uppercase">
                    {selectedItem.mediaType}
                  </span>
                  <span className="text-xs text-stone-400">{selectedItem.category}</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-16/10 bg-black flex items-center justify-center border border-stone-800">
                  {selectedItem.mediaType === 'video' ? (
                    <video
                      src={selectedItem.url}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div>
                  <h4 className="font-heading font-black text-lg text-white">
                    {selectedItem.title}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Exhibitor</span>
                    <span className="font-bold text-white">{selectedItem.uploaderName}</span>
                  </div>
                  <a
                    href={`https://wa.me/2348039991122?text=${encodeURIComponent(`Hello, I saw your 3D Virtual Room item "${selectedItem.title}" on LazyCEO!`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => handleDeleteItem(selectedItem.id)}
                    className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer"
                  >
                    Remove from My Room
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-white cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Media to 3D Room Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div 
              className="bg-stone-900 text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-cyan-500/40 relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 bg-stone-850 flex items-center justify-between border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-base text-white">
                      Upload Media to 3D Showroom
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Mounted on high-definition 3D gallery walls
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {uploadSuccess ? (
                <div className="p-10 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-bold text-lg text-white">
                    Mounted to 3D Wall Successfully!
                  </h4>
                  <p className="text-xs text-stone-400">
                    Visitors can now orbit and view your media in the interactive showroom.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
                  {uploadError && (
                    <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-200">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Media Type Toggle */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                      Media Format
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewMediaType('image')}
                        className={`p-2.5 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          newMediaType === 'image'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-750'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Photo / Render</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!isProOrEnterprise && onRequireUpgrade) {
                            onRequireUpgrade();
                          } else {
                            setNewMediaType('video');
                          }
                        }}
                        className={`p-2.5 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          newMediaType === 'video'
                            ? 'bg-orange-500/20 border-orange-400 text-orange-300'
                            : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-750'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        <span>3D Video Screen</span>
                        {!isProOrEnterprise && (
                          <span className="text-[9px] bg-orange-500 text-black px-1.5 py-0.2 rounded font-black">
                            PRO
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                      Showcase Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Luxury Soundproof Party Penthouse"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                      Showcase Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="Products & Showroom">Products & Showroom</option>
                      <option value="Real Estate & Interiors">Real Estate & Interiors</option>
                      <option value="Event & Party">Event & Party</option>
                      <option value="Brand Presentation">Brand Presentation</option>
                      <option value="Hospitality & Suites">Hospitality & Suites</option>
                    </select>
                  </div>

                  {/* Media URL / Preset Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                      {newMediaType === 'video' ? 'Video File URL (MP4)' : 'Image URL or Upload'}
                    </label>
                    <input
                      type="url"
                      required
                      placeholder={newMediaType === 'video' ? 'https://assets.mixkit.co/videos/preview/mixkit-modern-interior-of-a-living-room-41525-large.mp4' : 'https://images.unsplash.com/...'}
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400 font-mono text-xs"
                    />

                    {/* Device Upload and Presets */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Phone / Laptop</span>
                        <input
                          type="file"
                          accept={newMediaType === 'video' ? 'video/*' : 'image/*'}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (typeof event.target?.result === 'string') {
                                setNewMediaUrl(event.target.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="hidden"
                        />
                      </label>

                      {newMediaType === 'image' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setNewMediaUrl('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')}
                            className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-[10px] text-cyan-300 whitespace-nowrap cursor-pointer"
                          >
                            Villa Preset
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewMediaUrl('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80')}
                            className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-[10px] text-cyan-300 whitespace-nowrap cursor-pointer"
                          >
                            Penthouse Preset
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                      Description / Highlight Points
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Detail features, pricing, or specifications for visitors..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-white outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded-xl shadow-lg shadow-cyan-500/25 uppercase tracking-wider text-xs transition-all cursor-pointer"
                  >
                    Mount into 3D Virtual Room
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
