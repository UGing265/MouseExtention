# 🐭 Mouse Quiz Extension

## 🎯 Giới thiệu

**Mouse Quiz** là một tiện ích mở rộng (Chrome Extension) giúp người dùng tự động phát hiện các câu hỏi trắc nghiệm xuất hiện trên trang web và sử dụng AI để gợi ý câu trả lời nhanh chóng, chính xác. Công cụ này đặc biệt hữu ích cho sinh viên, người học trực tuyến, hoặc bất kỳ ai thường xuyên làm quiz, test online.

---

## ⚙️ Công nghệ sử dụng

| Thành phần                | Mô tả                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| **Manifest v3**           | Cấu trúc chuẩn của Chrome Extension thế hệ mới.                                              |
| **JavaScript (ES6)**      | Logic chính để xử lý DOM, phát hiện câu hỏi, và gọi API AI.                                  |
| **HTML + CSS / Tailwind** | Giao diện popup thân thiện, dễ nhìn, dễ thao tác.                                            |
| **Chrome API**            | Sử dụng `chrome.scripting`, `chrome.storage`, và `chrome.tabs` để tương tác với trình duyệt. |
| **AI API (OpenAI / GPT)** | Dùng để xử lý ngôn ngữ tự nhiên và sinh câu trả lời thông minh.                              |

---

## 🧭 Hướng dẫn sử dụng

### 🔹 Bước 1: Cài đặt

1. Tải mã nguồn của extension về máy (hoặc clone repo).
2. Mở trình duyệt **Chrome** → Gõ `chrome://extensions/`.
3. Bật **Developer mode** (Chế độ nhà phát triển).
4. Chọn **Load unpacked** → Trỏ đến thư mục chứa `manifest.json`.

### 🔹 Bước 2: Sử dụng

* Truy cập trang quiz hoặc test bất kỳ.
* Mở popup bằng cách nhấn vào biểu tượng 🐭 **Mouse Quiz** trên thanh công cụ.
* Nhấn **Detect** để quét các câu hỏi trên trang.
* AI sẽ tự động gợi ý câu trả lời phù hợp.
* (Tuỳ chọn) Nhấn phím tắt `Alt + Shift + Q` để bật/tắt chế độ Auto Answer.

---

## 👨‍💻 Tác giả

**Người tạo:** [Shiroru](https://github.com/UGing265)
**Dự án:** Mouse Quiz — AI-powered Auto Answer Extension
**Phiên bản:** v1.1

---

## 🧩 Thư mục chính

```
MouseQuiz/
│
├── manifest.json           # Cấu hình extension
├── mouse.png               # Icon của tiện ích
├── src/
│   ├── main.html           # Giao diện popup
│   ├── button/auto-any.js  # Script tự động nhận dạng
│   └── utils/ai.js         # Kết nối AI API
└── output/result.html      # Hiển thị kết quả quiz
```

---

> 🧠 *"Mouse Quiz — Let the mouse do the thinking for you."*
