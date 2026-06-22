document.addEventListener("DOMContentLoaded", () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxCounter = document.querySelector('.lightbox-counter');
    
    const closeBtn = document.querySelector('.lightbox-close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;
    let visibleItems = Array.from(galleryItems);

    // 1. Smooth Category Filters Animation
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetFilter = btn.getAttribute('data-filter');
            visibleItems = [];

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (targetFilter === 'all' || itemCategory === targetFilter) {
                    item.classList.remove('hide');
                    // Chota sa delay fake sequential fade effect ke liye
                    setTimeout(() => item.classList.remove('fade-out'), 50);
                    visibleItems.push(item);
                } else {
                    item.classList.add('fade-out');
                    item.classList.add('hide');
                }
            });
        });
    });

    // 2. Open Lightbox Engine
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            currentIndex = visibleItems.indexOf(item);
            syncLightboxData();
            lightbox.classList.add('active');
        });
    });

    // 3. Sync Content into Lightbox dynamically
    function syncLightboxData() {
        if (visibleItems.length === 0) return;
        
        const currentItem = visibleItems[currentIndex];
        const originalImg = currentItem.querySelector('.gallery-img');
        const originalTitle = currentItem.querySelector('h3').innerText;
        const originalCategory = currentItem.getAttribute('data-category');

        // Dynamic elements insertion
        lightboxImg.src = originalImg.src;
        lightboxTitle.innerText = originalTitle;
        lightboxCategory.innerText = originalCategory;
        lightboxCounter.innerText = `${currentIndex + 1} / ${visibleItems.length}`;
    }

    // 4. Navigation Controls
    function showNextImage() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        syncLightboxData();
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        syncLightboxData();
    }

    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });

    // Close Actions
    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });

    // Smart Keyboard Shortcuts for Better UX
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'Escape') lightbox.classList.remove('active');
    });
});
