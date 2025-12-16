// Main application logic for the novel reader homepage

document.addEventListener('DOMContentLoaded', function() {
    // Load novels data
    loadNovels();
    
    // Setup event listeners
    setupEventListeners();
});

// Load novels from JSON file
async function loadNovels() {
    try {
        const response = await fetch('novels/index.json');
        const data = await response.json();
        displayNovels(data.novels);
    } catch (error) {
        console.error('Error loading novels:', error);
        showError('Không thể tải danh sách truyện. Vui lòng thử lại sau.');
    }
}

// Display novels in the grid
function displayNovels(novels) {
    const novelsGrid = document.getElementById('novels-grid');
    novelsGrid.innerHTML = '';
    
    novels.forEach(novel => {
        const novelCard = createNovelCard(novel);
        novelsGrid.appendChild(novelCard);
    });
}

// Create a novel card element
function createNovelCard(novel) {
    const card = document.createElement('div');
    card.className = 'novel-card';
    card.dataset.id = novel.id;
    
    // Create genre tags HTML
    const genreTags = novel.genres.map(genre => 
        `<span class="genre-tag">${genre}</span>`
    ).join('');
    
    // Determine status class
    const statusClass = novel.status === 'Hoàn thành' ? 'status-completed' : 'status-ongoing';
    
    card.innerHTML = `
        <div class="novel-cover">
            <img src="${novel.cover}" alt="${novel.title}" loading="lazy">
        </div>
        <div class="novel-info">
            <h3 class="novel-title" title="${novel.title}">${novel.title}</h3>
            <p class="novel-author">${novel.author}</p>
            <div class="novel-genres">${genreTags}</div>
            <p class="novel-status ${statusClass}">${novel.status}</p>
        </div>
    `;
    
    // Add click event to show novel details
    card.addEventListener('click', () => showNovelDetails(novel));
    
    return card;
}

// Show novel details in modal
async function showNovelDetails(novel) {
    try {
        // Load novel info
        const response = await fetch(`novels/${novel.id}/info.json`);
        const novelInfo = await response.json();
        
        // Populate modal with novel info
        document.getElementById('modal-cover').src = novelInfo.cover;
        document.getElementById('modal-title').textContent = novelInfo.title;
        document.getElementById('modal-author').textContent = novelInfo.author;
        document.getElementById('modal-genres').textContent = novelInfo.genres.join(', ');
        document.getElementById('modal-status').textContent = novelInfo.status;
        document.getElementById('modal-description').textContent = novelInfo.description;
        
        // Load chapters list
        loadChaptersList(novelInfo);
        
        // Set up read button
        document.getElementById('read-btn').addEventListener('click', () => {
            if (novelInfo.chapters.length > 0) {
                openReader(novelInfo.id, novelInfo.chapters[0].file);
            }
        });
        
        // Show modal
        document.getElementById('novel-modal').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading novel details:', error);
        showError('Không thể tải thông tin truyện. Vui lòng thử lại sau.');
    }
}

// Load chapters list in the modal
function loadChaptersList(novelInfo) {
    const chaptersList = document.getElementById('chapters-list');
    chaptersList.innerHTML = '';
    
    novelInfo.chapters.forEach(chapter => {
        const li = document.createElement('li');
        li.textContent = chapter.title;
        li.addEventListener('click', () => {
            openReader(novelInfo.id, chapter.file);
        });
        chaptersList.appendChild(li);
    });
}

// Open reader with specific novel and chapter
function openReader(novelId, chapterFile) {
    const readerUrl = `reader.html?novel=${novelId}&chapter=${chapterFile}`;
    window.open(readerUrl, '_self');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Filter functionality
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active class from all tags
            filterTags.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tag
            tag.classList.add('active');
            // Filter novels
            filterNovels(tag.dataset.genre);
        });
    });
    
    // Modal close button
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        document.getElementById('novel-modal').style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('novel-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Perform search
async function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    
    if (!searchTerm) {
        loadNovels();
        return;
    }
    
    try {
        const response = await fetch('novels/index.json');
        const data = await response.json();
        
        const filteredNovels = data.novels.filter(novel => 
            novel.title.toLowerCase().includes(searchTerm) ||
            novel.author.toLowerCase().includes(searchTerm) ||
            novel.description.toLowerCase().includes(searchTerm) ||
            novel.genres.some(genre => genre.toLowerCase().includes(searchTerm))
        );
        
        displayNovels(filteredNovels);
        
        if (filteredNovels.length === 0) {
            document.getElementById('novels-grid').innerHTML = 
                '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Không tìm thấy truyện nào phù hợp.</p>';
        }
    } catch (error) {
        console.error('Error searching novels:', error);
        showError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
    }
}

// Filter novels by genre
async function filterNovels(genre) {
    try {
        const response = await fetch('novels/index.json');
        const data = await response.json();
        
        let filteredNovels = data.novels;
        
        if (genre !== 'all') {
            filteredNovels = data.novels.filter(novel => 
                novel.genres.includes(genre)
            );
        }
        
        displayNovels(filteredNovels);
        
        if (filteredNovels.length === 0) {
            document.getElementById('novels-grid').innerHTML = 
                '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Không có truyện nào trong thể loại này.</p>';
        }
    } catch (error) {
        console.error('Error filtering novels:', error);
        showError('Có lỗi xảy ra khi lọc truyện. Vui lòng thử lại sau.');
    }
}

// Show error message
function showError(message) {
    const novelsGrid = document.getElementById('novels-grid');
    novelsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 20px; background-color: #f8d7da; color: #721c24; border-radius: 4px;">
            <i class="fas fa-exclamation-triangle"></i> ${message}
        </div>
    `;
}