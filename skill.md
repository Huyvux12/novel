# Hướng dẫn tạo trang web đọc Light Novel tĩnh với GitHub Pages

## Mục tiêu dự án
Tạo một trang web đọc truyện tĩnh (static website) triển khai trên GitHub Pages, cho phép:
- Đọc light novel/web novel với giao diện thân thiện
- Quản lý nhiều bộ truyện và chương truyện
- Tải chương truyện thủ công qua file Markdown (.md)
- Tùy chỉnh trải nghiệm đọc (font chữ, cỡ chữ, màu nền)
- Tham khảo giao diện: docln.sbs

## Cấu trúc thư mục dự án

```
novel-reader/
├── index.html              # Trang chủ - danh sách truyện
├── reader.html             # Trang đọc truyện
├── css/
│   └── style.css          # CSS chính
├── js/
│   ├── app.js             # Logic chính
│   ├── reader.js          # Logic trang đọc
│   └── markdown-it.min.js # Thư viện parse Markdown
├── novels/                # Thư mục chứa truyện
│   ├── truyen-1/
│   │   ├── info.json     # Metadata truyện
│   │   ├── chap1.md      # Chương 1
│   │   ├── chap2.md      # Chương 2
│   │   └── ...
│   ├── truyen-2/
│   │   ├── info.json
│   │   ├── chap1.md
│   │   └── ...
│   └── index.json        # Danh sách tất cả truyện
└── README.md
```

## File cấu hình

### 1. novels/index.json
File này chứa danh sách tất cả truyện:

```json
{
  "novels": [
    {
      "id": "truyen-1",
      "title": "Tên Truyện 1",
      "author": "Tác giả",
      "description": "Mô tả ngắn",
      "cover": "url_ảnh_bìa",
      "genres": ["Huyền huyễn", "Tu tiên"],
      "status": "Đang ra"
    },
    {
      "id": "truyen-2",
      "title": "Tên Truyện 2",
      "author": "Tác giả 2",
      "description": "Mô tả",
      "cover": "url_ảnh_bìa_2",
      "genres": ["Kiếm hiệp"],
      "status": "Hoàn thành"
    }
  ]
}
```

### 2. novels/truyen-1/info.json
Metadata cho từng truyện:

```json
{
  "id": "truyen-1",
  "title": "Tên Truyện 1",
  "author": "Tác giả",
  "description": "Mô tả đầy đủ về truyện...",
  "cover": "url_ảnh_bìa",
  "genres": ["Huyền huyễn", "Tu tiên"],
  "status": "Đang ra",
  "chapters": [
    {
      "number": 1,
      "title": "Chương 1: Bắt đầu",
      "file": "chap1.md",
      "date": "2025-01-01"
    },
    {
      "number": 2,
      "title": "Chương 2: Tiếp tục",
      "file": "chap2.md",
      "date": "2025-01-02"
    }
  ]
}
```

### 3. Ví dụ file chương (chap1.md)

```markdown
# Chương 1: Bắt đầu

Nội dung chương truyện ở đây...

Có thể sử dụng **in đậm**, *in nghiêng*, và các định dạng Markdown khác.

## Tiêu đề phụ

Tiếp tục nội dung...
```

## Tính năng chính cần implement

### 1. Trang chủ (index.html)
- Hiển thị danh sách truyện dạng grid/card
- Filter theo thể loại
- Tìm kiếm truyện
- Click vào truyện → hiển thị danh sách chương

### 2. Trang đọc (reader.html)
- Parse và hiển thị nội dung Markdown
- Navigation: chương trước/sau
- Thanh công cụ đọc truyện gồm:
  - **Chọn font chữ**: Arial, Times New Roman, Georgia, Verdana, Roboto
  - **Cỡ chữ**: 14px - 24px (slider hoặc buttons)
  - **Màu nền**: Trắng, Vàng nhạt (sepia), Xám, Đen
  - **Màu chữ**: Tự động theo màu nền
  - **Chế độ ban đêm/ban ngày**
- Lưu settings vào localStorage
- Mục lục chương (table of contents)
- Responsive design cho mobile

### 3. LocalStorage Settings
Lưu các thiết lập người dùng:

```javascript
{
  "fontSize": 18,
  "fontFamily": "Georgia",
  "backgroundColor": "#f4f1e8",
  "textColor": "#333",
  "theme": "light"
}
```

## Thư viện cần dùng

### 1. Markdown Parser
- **markdown-it** (CDN): Để convert Markdown → HTML
```html
<script src="https://cdn.jsdelivr.net/npm/markdown-it@13/dist/markdown-it.min.js"></script>
```

### 2. Optional Libraries
- **Bootstrap 5** hoặc **Tailwind CSS**: Styling và responsive
- **Font Awesome**: Icons
- **Google Fonts**: Fonts đẹp cho đọc truyện

## Triển khai GitHub Pages

### Bước 1: Tạo repository
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/novel-reader.git
git push -u origin main
```

### Bước 2: Enable GitHub Pages
1. Vào Settings → Pages
2. Source: Deploy from branch `main`
3. Folder: `/ (root)`
4. Save

### Bước 3: Thêm chương mới
Khi muốn thêm chương mới:
1. Tạo file `chapX.md` trong thư mục truyện tương ứng
2. Cập nhật `info.json` thêm metadata chương mới
3. Commit và push:
```bash
git add .
git commit -m "Add chapter X"
git push
```

Website tự động cập nhật sau vài phút.

## Sample Code Snippets

### JavaScript để load và parse Markdown

```javascript
// reader.js
const md = window.markdownit();

async function loadChapter(novelId, chapterFile) {
  try {
    const response = await fetch(`novels/${novelId}/${chapterFile}`);
    const markdown = await response.text();
    const html = md.render(markdown);
    document.getElementById('chapter-content').innerHTML = html;
  } catch (error) {
    console.error('Error loading chapter:', error);
  }
}

// Load settings from localStorage
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('readerSettings')) || {
    fontSize: 18,
    fontFamily: 'Georgia',
    backgroundColor: '#ffffff',
    textColor: '#333333'
  };
  applySettings(settings);
}

function applySettings(settings) {
  const content = document.getElementById('chapter-content');
  content.style.fontSize = settings.fontSize + 'px';
  content.style.fontFamily = settings.fontFamily;
  content.style.backgroundColor = settings.backgroundColor;
  content.style.color = settings.textColor;
}

function saveSettings(settings) {
  localStorage.setItem('readerSettings', JSON.stringify(settings));
  applySettings(settings);
}
```

### CSS cho trang đọc

```css
.reader-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.8;
}

.reader-toolbar {
  position: sticky;
  top: 0;
  background: #fff;
  padding: 15px;
  border-bottom: 1px solid #ddd;
  z-index: 100;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.theme-light {
  background-color: #ffffff;
  color: #333333;
}

.theme-sepia {
  background-color: #f4f1e8;
  color: #5c4a3a;
}

.theme-dark {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

#chapter-content {
  padding: 30px 20px;
  transition: all 0.3s ease;
}

#chapter-content h1, 
#chapter-content h2 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

#chapter-content p {
  margin-bottom: 1em;
  text-align: justify;
}
```

## Workflow thêm truyện mới

1. **Tạo thư mục**: `novels/ten-truyen-moi/`
2. **Tạo info.json** với metadata
3. **Thêm các file chương**: `chap1.md`, `chap2.md`, ...
4. **Cập nhật novels/index.json** thêm truyện vào danh sách
5. **Commit và push** lên GitHub

## Features nâng cao (optional)

- Bookmark/Đánh dấu vị trí đọc
- Lịch sử đọc
- Dark mode tự động theo giờ
- PWA (Progressive Web App) để đọc offline
- Comments bằng GitHub Issues hoặc Disqus
- Search full-text trong truyện
- Export chapter ra PDF/EPUB

## Lưu ý quan trọng

1. **Không sử dụng database**: Tất cả data trong JSON/Markdown
2. **GitHub Pages chỉ hỗ trợ static files**: Không có backend
3. **File size**: Mỗi file markdown nên < 1MB để load nhanh
4. **Caching**: Browser sẽ cache, có thể cần hard refresh (Ctrl+F5)
5. **CORS**: Fetch local files phải qua HTTP/HTTPS, không chạy được file://

## Testing local

Dùng Python SimpleHTTPServer hoặc VS Code Live Server:

```bash
# Python 3
python -m http.server 8000

# Hoặc dùng VS Code extension: Live Server
```

## Tham khảo

- GitHub Pages Docs: https://pages.github.com/
- Markdown-it: https://github.com/markdown-it/markdown-it
- LocalStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Example: docln.sbs (tham khảo UI/UX)

---

**Lưu ý**: File này là hướng dẫn cho Claude AI để tạo source code hoàn chỉnh. Khi implement, cần tạo tất cả các file HTML, CSS, JS theo cấu trúc trên.
