// 3D太阳系模型功能
console.log('=== 3D太阳系模块加载 ===');

// 立即检查Three.js是否已加载
if (typeof THREE === 'undefined') {
    console.error('Three.js未正确加载，3D太阳系模块无法初始化');
    // 尝试重新加载Three.js，使用更可靠的CDN链接
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.128.0/three.min.js';
    script.onload = function() {
        console.log('Three.js重新加载成功，尝试初始化3D太阳系');
        initSolarSystemAfterThreeJsLoaded();
    };
    script.onerror = function() {
        console.error('Three.js重新加载失败');
        showThreeJSError();
    };
    document.head.appendChild(script);
} else {
    // Three.js已加载，等待DOM完全加载后初始化
    document.addEventListener('DOMContentLoaded', function() {
        console.log('=== 3D太阳系模块初始化 ===');
        initSolarSystemMain();
    });
}

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM完全加载 ===');
    
    // 检查solar-system容器是否存在
    const container = document.getElementById('solar-system');
    if (!container) {
        console.error('未找到solar-system容器，3D太阳系模块无法初始化');
        return;
    }
    
    // 确保容器有正确的样式
    container.style.width = '100%';
    container.style.height = '600px';
    container.style.border = '1px solid rgba(74, 157, 227, 0.3)';
    container.style.borderRadius = '15px';
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
});

// Three.js加载后初始化
function initSolarSystemAfterThreeJsLoaded() {
    console.log('=== Three.js加载后初始化 ===');
    
    // 检查DOM是否已加载
    if (document.readyState === 'loading') {
        // DOM还在加载，等待DOMContentLoaded事件
        document.addEventListener('DOMContentLoaded', function() {
            initSolarSystemMain();
        });
    } else {
        // DOM已加载，直接初始化
        initSolarSystemMain();
    }
}

// 主初始化函数
function initSolarSystemMain() {
    console.log('=== 调用主初始化函数 ===');
    
    // 显示WebGL不支持的消息
    function showWebGLMessage() {
        const container = document.getElementById('solar-system');
        if (container) {
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #fff; text-align: center; padding: 20px;">
                    <h3>浏览器不支持WebGL</h3>
                    <p>请尝试使用Chrome、Firefox或Edge等现代浏览器访问本网站</p>
                    <p>或升级您的浏览器版本以体验3D太阳系模型</p>
                </div>
            `;
        }
    }
    
    // 显示Three.js加载失败的消息
    function showThreeJSError() {
        const container = document.getElementById('solar-system');
        if (container) {
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #fff; text-align: center; padding: 20px;">
                    <h3>3D太阳系模型加载失败</h3>
                    <p>无法加载Three.js库，请检查网络连接或稍后重试</p>
                    <p>或使用其他浏览器访问本网站</p>
                </div>
            `;
        }
    }
    
    // WebGL支持检查函数
    function supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    // 检查WebGL支持
    if (!supportsWebGL()) {
        console.error('浏览器不支持WebGL，无法显示3D太阳系');
        showWebGLMessage();
        return;
    }
    
    // 检查OrbitControls是否已加载
    if (typeof THREE.OrbitControls === 'undefined') {
        console.error('OrbitControls未正确加载，尝试动态加载');
        
        // 使用备选方案：直接在代码中定义OrbitControls的简化版本
        console.log('使用简化版OrbitControls初始化3D太阳系');
        
        // 简化版OrbitControls实现
        THREE.OrbitControls = function (camera, domElement) {
            this.camera = camera;
            this.domElement = domElement || document;
            
            // 控制选项
            this.enabled = true;
            this.enableRotate = true;
            this.enableZoom = true;
            this.enablePan = true;
            
            // 旋转参数
            this.rotateSpeed = 1.0;
            this.zoomSpeed = 1.2;
            this.panSpeed = 0.3;
            
            // 鼠标状态
            this.mouseDown = false;
            this.mouseX = 0;
            this.mouseY = 0;
            
            // 相机状态
            this.target = new THREE.Vector3();
            this.position0 = this.camera.position.clone();
            this.target0 = this.target.clone();
            
            // 添加事件监听
            this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
            this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
            this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false);
            this.domElement.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);
            this.domElement.addEventListener('DOMMouseScroll', this.onMouseWheel.bind(this), false); // Firefox
            this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this), false);
            this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this), false);
            this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this), false);
            
            // 初始化相机目标
            this.update();
        };
        
        THREE.OrbitControls.prototype = {
            constructor: THREE.OrbitControls,
            
            onMouseDown: function (event) {
                if (!this.enabled || !this.enableRotate) return;
                
                this.mouseDown = true;
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;
                event.preventDefault();
            },
            
            onMouseMove: function (event) {
                if (!this.enabled || !this.mouseDown) return;
                
                const deltaX = event.clientX - this.mouseX;
                const deltaY = event.clientY - this.mouseY;
                
                // 旋转相机
                if (this.enableRotate) {
                    this.rotateCamera(deltaX, deltaY);
                }
                
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;
                this.update();
            },
            
            onMouseUp: function () {
                this.mouseDown = false;
            },
            
            onMouseWheel: function (event) {
                if (!this.enabled || !this.enableZoom) return;
                
                let delta = 0;
                if (event.wheelDelta !== undefined) {
                    // WebKit / Opera / Explorer 9
                    delta = event.wheelDelta;
                } else if (event.detail !== undefined) {
                    // Firefox
                    delta = -event.detail;
                }
                
                this.zoomCamera(delta);
                this.update();
                event.preventDefault();
            },
            
            onTouchStart: function (event) {
                if (!this.enabled) return;
                
                this.mouseDown = true;
                this.mouseX = event.touches[0].clientX;
                this.mouseY = event.touches[0].clientY;
            },
            
            onTouchMove: function (event) {
                if (!this.enabled || !this.mouseDown) return;
                
                const deltaX = event.touches[0].clientX - this.mouseX;
                const deltaY = event.touches[0].clientY - this.mouseY;
                
                // 旋转相机
                if (this.enableRotate) {
                    this.rotateCamera(deltaX, deltaY);
                }
                
                this.mouseX = event.touches[0].clientX;
                this.mouseY = event.touches[0].clientY;
                this.update();
            },
            
            onTouchEnd: function () {
                this.mouseDown = false;
            },
            
            rotateCamera: function (deltaX, deltaY) {
                const rotateSpeed = this.rotateSpeed * 0.005;
                
                // 计算旋转角度
                const rotateAngleX = deltaY * rotateSpeed;
                const rotateAngleY = deltaX * rotateSpeed;
                
                // 旋转相机
                const direction = this.camera.position.clone().sub(this.target).normalize();
                const up = this.camera.up.clone();
                
                // 计算旋转轴
                const axisX = new THREE.Vector3().crossVectors(up, direction).normalize();
                
                // 旋转相机位置
                this.camera.position.applyAxisAngle(axisX, rotateAngleX);
                this.camera.position.applyAxisAngle(up, rotateAngleY);
            },
            
            zoomCamera: function (delta) {
                const zoomSpeed = this.zoomSpeed * 0.01;
                const factor = Math.pow(0.95, delta * zoomSpeed);
                
                // 缩放相机距离
                const distance = this.camera.position.distanceTo(this.target);
                const direction = this.camera.position.clone().sub(this.target).normalize();
                
                // 更新相机位置
                this.camera.position.sub(direction.multiplyScalar(distance * (1 - factor)));
            },
            
            panCamera: function (deltaX, deltaY) {
                if (!this.enablePan) return;
                
                const panSpeed = this.panSpeed * 0.01;
                
                // 计算平移向量
                const up = this.camera.up.clone();
                const direction = this.camera.position.clone().sub(this.target).normalize();
                const right = new THREE.Vector3().crossVectors(direction, up).normalize();
                const pan = new THREE.Vector3();
                
                pan.add(right.multiplyScalar(-deltaX * panSpeed));
                pan.add(up.multiplyScalar(deltaY * panSpeed));
                
                // 平移相机和目标
                this.camera.position.add(pan);
                this.target.add(pan);
            },
            
            update: function () {
                // 更新相机朝向
                this.camera.lookAt(this.target);
            },
            
            reset: function () {
                // 重置相机位置和目标
                this.camera.position.copy(this.position0);
                this.target.copy(this.target0);
                this.update();
            }
        };
        
        console.log('简化版OrbitControls创建完成');
    }
    
    // 初始化3D太阳系
    console.log('=== 开始初始化3D太阳系 ===');
    
    let scene, camera, renderer, controls;
    let solarSystem;
    let planets = [];
    let rotationEnabled = true;
    let raycaster, mouse;

    function initSolarSystem() {
        
        // 创建场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a2a);
        
        // 获取容器
        const container = document.getElementById('solar-system');
        
        // 创建相机
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 80;
        
        // 创建渲染器
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.innerHTML = ''; // 清空容器
        container.appendChild(renderer.domElement);
        
        // 添加轨道控制
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 30;
        controls.maxDistance = 200;
        
        // 添加光源
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);
        
        // 创建射线检测器
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        
        // 创建太阳系
        createSolarSystem();
        
        // 窗口大小调整
        window.addEventListener('resize', onWindowResize);
        
        // 添加点击事件
        renderer.domElement.addEventListener('click', onCanvasClick);
        renderer.domElement.addEventListener('touchstart', onCanvasClick);
        
        // 控制按钮事件
        addControlButtonsEvent();
        
        // 动画循环
        animate();
    }
    
    function addControlButtonsEvent() {
        // 重置视图按钮
        const resetViewBtn = document.getElementById('reset-view');
        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', function() {
                controls.reset();
                camera.position.set(0, 0, 80);
            });
        }
        
        // 旋转控制按钮
        const toggleRotationBtn = document.getElementById('toggle-rotation');
        if (toggleRotationBtn) {
            toggleRotationBtn.addEventListener('click', function() {
                rotationEnabled = !rotationEnabled;
                this.innerHTML = rotationEnabled ? 
                    '<i class="fas fa-pause"></i> 暂停旋转' : 
                    '<i class="fas fa-play"></i> 继续旋转';
            });
        }
        
        // 关闭信息按钮
        const closeInfoBtn = document.getElementById('close-info');
        if (closeInfoBtn) {
            closeInfoBtn.addEventListener('click', function() {
                const planetInfo = document.getElementById('planet-info');
                if (planetInfo) {
                    planetInfo.classList.remove('active');
                }
            });
        }
    }
    
    function createSolarSystem() {
        solarSystem = new THREE.Group();
        scene.add(solarSystem);
        
        // 创建星空背景
        createStars3D();
        
        // 创建太阳
        const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.userData = {
            name: "太阳",
            description: "太阳是太阳系的中心天体，占据了太阳系总质量的99.86%。",
            details: [
                "直径: 1,392,684 公里",
                "表面温度: 5,500°C",
                "类型: G型主序星"
            ]
        };
        solarSystem.add(sun);
        
        // 行星数据
        const planetData = [
            { 
                name: "水星", 
                size: 0.4, 
                color: 0x8c8c8c, 
                distance: 10, 
                speed: 0.04,
                description: "水星是太阳系中最小和最靠近太阳的行星。",
                details: ["直径: 4,879 公里", "轨道周期: 88 天", "表面温度: -173°C 到 427°C"] 
            },
            { 
                name: "金星", 
                size: 0.9, 
                color: 0xe6b87e, 
                distance: 15, 
                speed: 0.015,
                description: "金星是太阳系中第二颗行星，以其浓厚的大气层和高温著称。",
                details: ["直径: 12,104 公里", "轨道周期: 225 天", "表面温度: 462°C"] 
            },
            { 
                name: "地球", 
                size: 1, 
                color: 0x1e90ff, 
                distance: 20, 
                speed: 0.01,
                description: "地球是太阳系中第三颗行星，也是目前已知唯一孕育和支持生命的天体。",
                details: ["直径: 12,742 公里", "轨道周期: 365 天", "表面温度: -88°C 到 58°C"] 
            },
            { 
                name: "火星", 
                size: 0.5, 
                color: 0xff4500, 
                distance: 25, 
                speed: 0.008,
                description: "火星是太阳系中第四颗行星，表面呈红色，被称为'红色星球'。",
                details: ["直径: 6,779 公里", "轨道周期: 687 天", "表面温度: -87°C 到 -5°C"] 
            },
            { 
                name: "木星", 
                size: 2, 
                color: 0xd8ca9d, 
                distance: 35, 
                speed: 0.004,
                description: "木星是太阳系中最大的行星，是一个气态巨行星。",
                details: ["直径: 139,820 公里", "轨道周期: 12 年", "类型: 气态巨行星"] 
            },
            { 
                name: "土星", 
                size: 1.7, 
                color: 0xf0d290, 
                distance: 45, 
                speed: 0.003,
                description: "土星是太阳系中第六颗行星，以其明显的行星环闻名。",
                details: ["直径: 116,460 公里", "轨道周期: 29 年", "光环: 是"] 
            },
            { 
                name: "天王星", 
                size: 1.4, 
                color: 0x4fd0e7, 
                distance: 55, 
                speed: 0.002,
                description: "天王星是太阳系中第七颗行星，是一个冰巨星。",
                details: ["直径: 50,724 公里", "轨道周期: 84 年", "自转轴: 倾斜98°"] 
            },
            { 
                name: "海王星", 
                size: 1.3, 
                color: 0x4b70dd, 
                distance: 65, 
                speed: 0.001,
                description: "海王星是太阳系中第八颗行星，是一个冰巨星。",
                details: ["直径: 49,244 公里", "轨道周期: 165 年", "风速: 高达2,100 km/h"] 
            }
        ];
        
        // 创建行星
        planetData.forEach(data => {
            // 创建行星
            const geometry = new THREE.SphereGeometry(data.size, 32, 32);
            const material = new THREE.MeshStandardMaterial({ color: data.color });
            const planet = new THREE.Mesh(geometry, material);
            
            // 设置行星位置
            planet.position.x = data.distance;
            
            // 添加用户数据
            planet.userData = {
                name: data.name,
                description: data.description,
                details: data.details,
                distance: data.distance,
                speed: data.speed,
                angle: Math.random() * Math.PI * 2 // 随机起始角度
            };
            
            // 添加到场景
            solarSystem.add(planet);
            planets.push(planet);
            
            // 为土星添加光环
            if (data.name === "土星") {
                const ringGeometry = new THREE.RingGeometry(data.size + 0.3, data.size + 1, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xf0d290, 
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2;
                planet.add(ring);
            }
            
            // 创建轨道线
            const orbitGeometry = new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x3a5a8a, 
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.3
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            solarSystem.add(orbit);
        });
    }
    
    function createStars3D() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 1000;
            positions[i3 + 1] = (Math.random() - 0.5) * 1000;
            positions[i3 + 2] = (Math.random() - 0.5) * 1000;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1,
            transparent: true,
            opacity: 0.8
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
    }
    
    function onCanvasClick(event) {
        // 阻止默认行为和冒泡
        event.preventDefault();
        event.stopPropagation();
        
        // 计算鼠标/触摸位置（相对于canvas）
        const rect = renderer.domElement.getBoundingClientRect();
        let clientX, clientY;
        
        // 处理触摸事件和鼠标事件
        if (event.type === 'touchstart' || event.type === 'touchend') {
            // 触摸事件
            if (event.touches && event.touches.length > 0) {
                clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY;
            } else if (event.changedTouches && event.changedTouches.length > 0) {
                clientX = event.changedTouches[0].clientX;
                clientY = event.changedTouches[0].clientY;
            } else {
                return; // 没有有效的触摸点
            }
        } else {
            // 鼠标事件
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        // 转换为标准化设备坐标 (-1 到 +1)
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        
        // 更新射线
        raycaster.setFromCamera(mouse, camera);
        
        // 检测与行星的交点
        const intersects = raycaster.intersectObjects(planets);
        
        if (intersects.length > 0) {
            const planet = intersects[0].object;
            showPlanetInfo(planet.userData);
            
            // 在移动设备上，点击行星后暂停旋转以便查看
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                rotationEnabled = false;
                document.getElementById('toggle-rotation').innerHTML = '<i class="fas fa-play"></i> 继续旋转';
            }
        }
    }
    
    function showPlanetInfo(planetData) {
        document.getElementById('planet-name').textContent = planetData.name;
        document.getElementById('planet-description').textContent = planetData.description;
        
        const detailsList = document.getElementById('planet-details');
        detailsList.innerHTML = '';
        planetData.details.forEach(detail => {
            const li = document.createElement('li');
            li.textContent = detail;
            detailsList.appendChild(li);
        });
        
        const planetInfo = document.getElementById('planet-info');
        planetInfo.classList.add('active');
        
        // 移动端优化：调整信息面板位置和样式
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            planetInfo.style.maxWidth = '250px';
            planetInfo.style.fontSize = '14px';
            planetInfo.style.padding = '15px';
            
            // 确保关闭按钮在移动端更容易点击
            const closeBtn = document.getElementById('close-info');
            if (closeBtn) {
                closeBtn.style.width = '30px';
                closeBtn.style.height = '30px';
                closeBtn.style.fontSize = '1.2rem';
            }
        }
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        if (rotationEnabled) {
            // 更新行星位置
            planets.forEach(planet => {
                const data = planet.userData;
                data.angle += data.speed;
                planet.position.x = Math.cos(data.angle) * data.distance;
                planet.position.z = Math.sin(data.angle) * data.distance;
                
                // 行星自转
                planet.rotation.y += data.speed * 2;
            });
            
            // 太阳自转
            solarSystem.rotation.y += 0.001;
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    function onWindowResize() {
        const container = document.getElementById('solar-system');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    // 初始化3D太阳系
    initSolarSystem();
    
    console.log('=== 3D太阳系模块初始化完成 ===');
}
