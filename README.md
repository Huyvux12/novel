# Light Novel Reader

Một trang web đọc Light Novel tĩnh được xây dựng với HTML, CSS và JavaScript, có thể triển khai trên GitHub Pages.

## Tính năng

- 📚 Đọc light novel/web novel với giao diện thân thiện
- 🔍 Tìm kiếm và lọc truyện theo thể loại
- 📖 Tải chương truyện từ file Markdown (.md)
- ⚙️ Tùy chỉnh trải nghiệm đọc (font chữ, cỡ chữ, màu nền)
- 🌙 Hỗ trợ nhiều giao diện (sáng, sepia, xám, tối)
- 📱 Responsive design cho mobile
- 💾 Lưu cài đặt và tiến độ đọc vào localStorage
- 🧭 Mục lục chương tự động tạo từ headings
- ⌨️ Hỗ trợ phím tắt (mũi tên trái/phải để chuyển chương)

## Cấu trúc dự án

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
│   ├── index.json        # Danh sách tất cả truyện
│   └── sample-novel/      # Truyện mẫu
│       ├── info.json     # Metadata truyện
│       ├── chap1.md      # Chương 1
│       ├── chap2.md      # Chương 2
│       └── chap3.md      # Chương 3
└── README.md
```

## Cách thêm truyện mới

1. **Tạo thư mục mới** trong `novels/` với tên ID của truyện (ví dụ: `novels/ten-truyen-moi/`)

2. **Tạo file info.json** với thông tin truyện:
```json
{
  "id": "ten-truyen-moi",
  "title": "Tên Truyện Mới",
  "author": "Tác giả",
  "description": "Mô tả đầy đủ về truyện...",
  "cover": "url_ảnh_bìa",
  "genres": ["Thể loại 1", "Thể loại 2"],
  "status": "Đang ra",
  "chapters": [
    {
      "number": 1,
      "title": "Chương 1: Tên chương",
      "file": "chap1.md",
      "date": "2025-01-01"
    }
  ]
}
```

3. **Tạo các file chương** (ví dụ: `chap1.md`, `chap2.md`, ...) với định dạng Markdown

4. **Cập nhật novels/index.json** thêm truyện vào danh sách:
```json
{
  "novels": [
    // ... các truyện khác
    {
      "id": "ten-truyen-moi",
      "title": "Tên Truyện Mới",
      "author": "Tác giả",
      "description": "Mô tả ngắn",
      "cover": "url_ảnh_bìa",
      "genres": ["Thể loại 1", "Thể loại 2"],
      "status": "Đang ra"
    }
  ]
}
```

## Cài đặt và chạy local

### Cách 1: Dùng Python

```bash
# Python 3
python -m http.server 8000
```

### Cách 2: Dùng Node.js

```bash
# Cài đặt http-server
npm install -g http-server

# Chạy server
http-server -p 8000
```

### Cách 3: Dùng VS Code Live Server Extension

1. Cài đặt extension "Live Server"
2. Click chuột phải vào `index.html` và chọn "Open with Live Server"

Sau đó mở trình duyệt và truy cập `http://localhost:8000`

## Triển khai trên GitHub Pages

1. **Tạo repository mới** trên GitHub

2. **Push code lên repository**:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/novel-reader.git
git push -u origin main
```

3. **Enable GitHub Pages**:
   - Vào Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Save

4. **Truy cập website** tại `https://username.github.io/novel-reader`

## Tùy chỉnh giao diện đọc

### Font chữ
Hỗ trợ các font: Arial, Times New Roman, Georgia, Verdana, Roboto

### Cỡ chữ
Từ 14px đến 24px, có thể tăng/giảm bằng buttons hoặc phím tắt

### Giao diện
- **Sáng**: Nền trắng, chữ đen
- **Sepia**: Nền vàng nhạt, chữ nâu
- **Xám**: Nền xám nhạt, chữ đen
- **Tối**: Nền đen, chữ trắng

## Phím tắt

- **←**: Chương trước
- **→**: Chương sau

## Lưu ý quan trọng

1. **Không sử dụng database**: Tất cả data được lưu trong JSON/Markdown
2. **GitHub Pages chỉ hỗ trợ static files**: Không có backend
3. **File size**: Mỗi file markdown nên < 1MB để load nhanh
4. **Caching**: Browser sẽ cache, có thể cần hard refresh (Ctrl+F5) khi cập nhật
5. **CORS**: Fetch local files phải qua HTTP/HTTPS, không chạy được với file://

## Thư viện sử dụng

- [markdown-it](https://github.com/markdown-it/markdown-it): Parse Markdown thành HTML
- [Font Awesome](https://fontawesome.com/): Icons
- [Google Fonts](https://fonts.google.com/): Fonts đẹp cho đọc truyện

## Tương thích trình duyệt

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - có thể sử dụng cho mục đích cá nhân hoặc thương mại

## Hỗ trợ

Nếu gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trên GitHub repository.