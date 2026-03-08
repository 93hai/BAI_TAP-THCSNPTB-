console.log('🌟 Fireflies effect script loaded!');

const starContainer = document.querySelector('.stars-background');

if (!starContainer) {
    console.error('❌ Stars background container not found!');
} else {
    console.log('✅ Stars background container found');
}

// Tạo 150 đom đóm với màu sắc đa dạng và hiệu ứng glow
const colors = [
    { name: 'white', class: '' },
    { name: 'yellow', class: 'yellow' },
    { name: 'blue', class: 'blue' }
];

for (let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const colorChoice = colors[Math.floor(Math.random() * colors.length)];
    if (colorChoice.class) {
        star.classList.add(colorChoice.class);
    }
    
    // Size tăng lên (1-5px)
    const size = Math.random() * 4 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    
    // Duration từ 2-6 giây
    star.style.setProperty('--duration', (Math.random() * 4 + 2) + 's');
    
    starContainer.appendChild(star);
}

console.log('✅ Created 150 fireflies!');

// Hiệu ứng shooting stars xuất hiện ngẫu nhiên
setInterval(() => {
    if (Math.random() < 0.15) { // 15% chance mỗi 4 giây
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        // Random vị trí bắt đầu từ trên xuống
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight * 0.3; // Top 30%
        
        shootingStar.style.left = startX + 'px';
        shootingStar.style.top = startY + 'px';
        
        starContainer.appendChild(shootingStar);
        
        console.log('⭐ Shooting star created!');
        
        // Xóa shooting star sau khi hoàn thành animation
        setTimeout(() => {
            shootingStar.remove();
        }, 1500);
    }
}, 4000);

console.log('✅ Fireflies effect initialization complete!');