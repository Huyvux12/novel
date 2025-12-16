// Reader page logic for the novel reader

document.addEventListener('DOMContentLoaded', function() {
    // Initialize markdown parser
    const md = window.markdownit();
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const novelId = urlParams.get('novel');
    const chapterFile = urlParams.get('chapter');
    
    // Load reader settings
    loadSettings();
    
    // Load novel and chapter
    if (novelId && chapterFile) {
        loadNovelInfo(novelId, chapterFile);
        loadChapter(novelId, chapterFile, md);
    } else {
        showError('Thiếu thông tin truyện hoặc chương. Vui lòng quay lại trang chủ.');
    }
    
    // Setup event listeners
    setupEventListeners();
});

// Load novel information
async function loadNovelInfo(novelId, currentChapterFile) {
    try {
        const response = await fetch(`novels/${novelId}/info.json`);
        const novelInfo = await response.json();
        
        // Set novel title
        document.getElementById('novel-title').textContent = novelInfo.title;
        
        // Populate chapter select
        const chapterSelect = document.getElementById('chapter-select');
        chapterSelect.innerHTML = '';
        
        novelInfo.chapters.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter.file;
            option.textContent = chapter.title;
            if (chapter.file === currentChapterFile) {
                option.selected = true;
            }
            chapterSelect.appendChild(option);
        });
        
        // Setup chapter navigation
        setupChapterNavigation(novelInfo, currentChapterFile);
        
        // Store novel info for later use
        window.currentNovel = novelInfo;
        
    } catch (error) {
        console.error('Error loading novel info:', error);
        showError('Không thể tải thông tin truyện. Vui lòng thử lại sau.');
    }
}

// Load chapter content
async function loadChapter(novelId, chapterFile, md) {
    try {
        // Show loading indicator
        const chapterContent = document.getElementById('chapter-content');
        chapterContent.innerHTML = '<div style="text-align: center; padding: 50px;"><i class="fas fa-spinner fa-spin"></i> Đang tải chương...</div>';
        
        // Fetch chapter content
        const response = await fetch(`novels/${novelId}/${chapterFile}`);
        const markdown = await response.text();
        
        // Parse markdown to HTML
        const html = md.render(markdown);
        
        // Display content
        chapterContent.innerHTML = html;
        
        // Generate table of contents
        generateTableOfContents();
        
        // Apply current settings
        applySettings(getCurrentSettings());
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Save reading progress
        saveReadingProgress(novelId, chapterFile);
        
    } catch (error) {
        console.error('Error loading chapter:', error);
        showError('Không thể tải nội dung chương. Vui lòng thử lại sau.');
    }
}

// Generate table of contents from headings
function generateTableOfContents() {
    const chapterContent = document.getElementById('chapter-content');
    const headings = chapterContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
        return;
    }
    
    const tocList = document.getElementById('toc-list');
    tocList.innerHTML = '';
    
    headings.forEach((heading, index) => {
        // Add ID to heading for navigation
        const id = `heading-${index}`;
        heading.id = id;
        
        // Create TOC item
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = heading.textContent;
        
        // Set indentation based on heading level
        const level = parseInt(heading.tagName.substring(1));
        a.style.paddingLeft = `${(level - 1) * 15}px`;
        
        li.appendChild(a);
        tocList.appendChild(li);
    });
}

// Setup chapter navigation
function setupChapterNavigation(novelInfo, currentChapterFile) {
    const chapters = novelInfo.chapters;
    const currentIndex = chapters.findIndex(ch => ch.file === currentChapterFile);
    
    const prevBtn = document.getElementById('prev-chapter');
    const nextBtn = document.getElementById('next-chapter');
    const prevBtnFooter = document.getElementById('prev-chapter-footer');
    const nextBtnFooter = document.getElementById('next-chapter-footer');
    
    // Previous chapter
    if (currentIndex > 0) {
        const prevChapter = chapters[currentIndex - 1];
        const prevHandler = () => navigateToChapter(novelInfo.id, prevChapter.file);
        
        prevBtn.addEventListener('click', prevHandler);
        prevBtnFooter.addEventListener('click', prevHandler);
        prevBtn.disabled = false;
        prevBtnFooter.disabled = false;
    } else {
        prevBtn.disabled = true;
        prevBtnFooter.disabled = true;
    }
    
    // Next chapter
    if (currentIndex < chapters.length - 1) {
        const nextChapter = chapters[currentIndex + 1];
        const nextHandler = () => navigateToChapter(novelInfo.id, nextChapter.file);
        
        nextBtn.addEventListener('click', nextHandler);
        nextBtnFooter.addEventListener('click', nextHandler);
        nextBtn.disabled = false;
        nextBtnFooter.disabled = false;
    } else {
        nextBtn.disabled = true;
        nextBtnFooter.disabled = true;
    }
    
    // Chapter select change
    document.getElementById('chapter-select').addEventListener('change', (e) => {
        navigateToChapter(novelInfo.id, e.target.value);
    });
}

// Navigate to a specific chapter
function navigateToChapter(novelId, chapterFile) {
    const url = `reader.html?novel=${novelId}&chapter=${chapterFile}`;
    window.location.href = url;
}

// Setup event listeners
function setupEventListeners() {
    // Font size controls
    document.getElementById('font-decrease').addEventListener('click', () => {
        changeFontSize(-2);
    });
    
    document.getElementById('font-increase').addEventListener('click', () => {
        changeFontSize(2);
    });
    
    // Font family change
    document.getElementById('font-select').addEventListener('change', (e) => {
        changeFontFamily(e.target.value);
    });
    
    // Theme change
    document.getElementById('theme-select').addEventListener('change', (e) => {
        changeTheme(e.target.value);
    });
    
    // Toggle table of contents
    document.getElementById('toggle-toc').addEventListener('click', () => {
        const toc = document.getElementById('table-of-contents');
        toc.classList.toggle('hidden');
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Left arrow - previous chapter
        if (e.key === 'ArrowLeft' && !e.target.matches('input, textarea, select')) {
            const prevBtn = document.getElementById('prev-chapter');
            if (!prevBtn.disabled) {
                prevBtn.click();
            }
        }
        
        // Right arrow - next chapter
        if (e.key === 'ArrowRight' && !e.target.matches('input, textarea, select')) {
            const nextBtn = document.getElementById('next-chapter');
            if (!nextBtn.disabled) {
                nextBtn.click();
            }
        }
    });
}

// Change font size
function changeFontSize(delta) {
    const settings = getCurrentSettings();
    const newSize = Math.max(14, Math.min(24, settings.fontSize + delta));
    settings.fontSize = newSize;
    saveSettings(settings);
    applySettings(settings);
    updateFontSizeDisplay(newSize);
}

// Change font family
function changeFontFamily(fontFamily) {
    const settings = getCurrentSettings();
    settings.fontFamily = fontFamily;
    saveSettings(settings);
    applySettings(settings);
}

// Change theme
function changeTheme(theme) {
    const settings = getCurrentSettings();
    settings.theme = theme;
    
    // Set colors based on theme
    switch (theme) {
        case 'light':
            settings.backgroundColor = '#ffffff';
            settings.textColor = '#333333';
            break;
        case 'sepia':
            settings.backgroundColor = '#f4f1e8';
            settings.textColor = '#5c4a3a';
            break;
        case 'gray':
            settings.backgroundColor = '#f5f5f5';
            settings.textColor = '#333333';
            break;
        case 'dark':
            settings.backgroundColor = '#1a1a1a';
            settings.textColor = '#e0e0e0';
            break;
    }
    
    saveSettings(settings);
    applySettings(settings);
}

// Get current settings
function getCurrentSettings() {
    return JSON.parse(localStorage.getItem('readerSettings')) || {
        fontSize: 18,
        fontFamily: 'Roboto',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        theme: 'light'
    };
}

// Save settings to localStorage
function saveSettings(settings) {
    localStorage.setItem('readerSettings', JSON.stringify(settings));
}

// Load settings from localStorage
function loadSettings() {
    const settings = getCurrentSettings();
    applySettings(settings);
    
    // Update UI controls
    document.getElementById('font-select').value = settings.fontFamily;
    document.getElementById('theme-select').value = settings.theme;
    updateFontSizeDisplay(settings.fontSize);
}

// Apply settings to the page
function applySettings(settings) {
    const chapterContent = document.getElementById('chapter-content');
    chapterContent.style.fontSize = settings.fontSize + 'px';
    chapterContent.style.fontFamily = settings.fontFamily;
    chapterContent.style.backgroundColor = settings.backgroundColor;
    chapterContent.style.color = settings.textColor;
    
    // Apply theme class to body
    document.body.className = `reader-page theme-${settings.theme}`;
}

// Update font size display
function updateFontSizeDisplay(size) {
    document.getElementById('font-size-value').textContent = size + 'px';
}

// Save reading progress
function saveReadingProgress(novelId, chapterFile) {
    const progress = JSON.parse(localStorage.getItem('readingProgress')) || {};
    progress[novelId] = {
        chapter: chapterFile,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('readingProgress', JSON.stringify(progress));
}

// Show error message
function showError(message) {
    const chapterContent = document.getElementById('chapter-content');
    chapterContent.innerHTML = `
        <div style="text-align: center; padding: 50px; background-color: #f8d7da; color: #721c24; border-radius: 4px;">
            <i class="fas fa-exclamation-triangle"></i> ${message}
            <div style="margin-top: 20px;">
                <a href="index.html" class="btn-primary">Quay lại trang chủ</a>
            </div>
        </div>
    `;
}