# 🍱 #HNAG — Hôm Nay Ăn Gì?

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://homnayangi-vn.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-LongLeo287%2FHNAG-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LongLeo287/HNAG)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-198%20Passed-22c55e?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-90%20Passed-2ba02c?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)

> **"Trưa nay ăn gì?", "Tối nay uống gì?"** — Nỗi trăn trở muôn thuở của giới trẻ, dân văn phòng và nhóm bạn bè nay được giải quyết chỉ bằng một lần mở hòm! **#HNAG** là web app quyết định ẩm thực ngẫu nhiên phong cách **mở hòm CS:GO & Blindbox 3D Đa Chiều** đầu tiên dành riêng cho ẩm thực Việt Nam, hoạt động 100% trên trình duyệt và không cần cài đặt.

🌐 **Trải nghiệm trực tiếp ngay tại**: [https://homnayangi-vn.vercel.app](https://homnayangi-vn.vercel.app)

---

## 🎯 Điểm Nhấn Đột Phá

### 1. 📦 Hòm 3D Đa Chiều (Three.js Multi-Dimensional 3D Engine)
- **Tương tác đa chiều toàn diện**:
  - **Xoay Yaw 360° ngang**: Lướt xem toàn bộ các mặt trước, mặt sau và cạnh bên của hòm.
  - **Lật Pitch nghiêng đứng**: Kéo chuột hoặc vuốt ngón tay lên/xuống để ngắm nhìn trực diện nắp hòm từ trên cao hoặc đáy bục nâng phía dưới.
  - **Quán tính mượt mà (Inertia Damping)**: Khi thả tay kéo, hòm tiếp tục trượt xoay theo gia tốc vận tốc và giảm tốc êm ái (`damping = 0.92`).
  - **Phóng to / Thu nhỏ (Mouse Wheel Zoom)**: Cuộn bánh xe chuột hoặc bấm `+`/`-` để zoom cận cảnh chi tiết hoa văn kim loại, ốc tán và quai khoá.
  - **Thanh Preset góc nhìn nhanh**: Chuyển nhanh giữa các góc nhìn chuẩn: `📐 Góc 3D`, `🔝 Nhìn từ trên`, `🔲 Mặt trước`, `🔄 Mặt bên` và `↺ Đặt lại`.
- **Kiến trúc phân cấp Dual-Tier thông minh**:
  - **Thiết bị di động / Tiết kiệm pin**: Khóa 30fps mượt mà, tối ưu đổ bóng cơ bản, giảm nhiệt độ máy và tiết kiệm pin.
  - **Máy tính PC / Laptop hiệu năng cao**: 60fps đỉnh cao với bản đồ đổ bóng mềm PCF Soft Shadows, vật liệu PBR kim loại phản chiếu ánh sáng động thời gian thực.
  - **Fallback Canvas 2.5D**: Tự động chuyển đổi nếu trình duyệt hoặc phần cứng không hỗ trợ WebGL.

---

### 2. 🎮 Hệ Thống Điều Khiển Chuột & Bàn Phím Toàn Cầu
Toàn bộ ứng dụng hỗ trợ hệ thống phím tắt và thao tác chuột tiện lợi:

#### ⌨️ Bảng Phím Tắt (Keyboard Shortcuts)
| Phím | Chức năng | Phạm vi hoạt động |
| :--- | :--- | :--- |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | Mở hòm / Quay món ngẫu nhiên | Màn hình chính |
| <kbd>1</kbd> - <kbd>5</kbd> | Chọn nhanh hòm từ 1 đến 5 | Thanh chọn hòm (Crate Rack) |
| <kbd>←</kbd> / <kbd>→</kbd> | Chuyển đổi hòm trước / hòm kế tiếp | Thanh chọn hòm (Crate Rack) |
| <kbd>F</kbd> | Chuyển sang chế độ **Món Ăn** (Food Mode) | Toàn ứng dụng |
| <kbd>D</kbd> | Chuyển sang chế độ **Đồ Uống** (Drink Mode) | Toàn ứng dụng |
| <kbd>C</kbd> | Đổi kiểu mở hòm xoay vòng (Reel, Blindbox 3D, Vòng quay, Slot, Lật bài) | Menu kiểu mở |
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> | Điều khiển xoay hòm 3D đa chiều (nghiêng trên/dưới, quay trái/phải) | Hòm 3D (Blindbox) |
| <kbd>+</kbd> / <kbd>−</kbd> | Phóng to (Zoom in) / Thu nhỏ (Zoom out) camera hòm 3D | Hòm 3D (Blindbox) |
| <kbd>Home</kbd> / <kbd>R</kbd> | Đặt lại góc phối cảnh hòm 3D về mặc định | Hòm 3D (Blindbox) |
| <kbd>S</kbd> | Đóng / Mở Drawer **Cài đặt & Tuỳ chọn** | Toàn ứng dụng |
| <kbd>M</kbd> | Bật / Tắt âm thanh (Mute / Unmute) | Toàn ứng dụng |
| <kbd>O</kbd> | Đóng / Mở Modal **Tỉ lệ mở hòm & Cài đặt tỉ lệ** | Toàn ứng dụng |
| <kbd>P</kbd> | Đóng / Mở Drawer **Thực đơn của tôi (Custom Pool)** | Toàn ứng dụng |
| <kbd>R</kbd> | Quay tiếp (Re-spin) khi đang ở màn hình kết quả | Màn hình kết quả |
| <kbd>Enter</kbd> | Chốt món này (Accept & Close) | Màn hình kết quả |
| <kbd>Esc</kbd> | Đóng bất kỳ Drawer / Modal / Dialog đang mở | Toàn ứng dụng |
| <kbd>?</kbd> hoặc <kbd>/</kbd> | Bật Bảng tra cứu phím tắt HUD (Shortcuts Cheatsheet) | Toàn ứng dụng |

#### 🖱️ Thao Tác Chuột (Mouse Interactions)
- **Cuộn chuột đổi hòm**: Đặt con trỏ lên thanh hòm và lăn bánh xe chuột để lướt qua các hòm.
- **Cuộn chuột Zoom 3D**: Cuộn chuột trên hòm để zoom in/out mượt mà.
- **Kéo chuột tự do 3D**: Nhấp giữ và kéo theo bất kỳ phương nào để xoay ngắm hòm.
- **Hiệu ứng nghiêng 3D Parallax**: Rê chuột lên các thẻ hòm tạo góc nghiêng vật lý theo tọa độ con trỏ.
- **Âm thanh UI phản hồi**: Tiếng hover nhẹ vi mô, tiếng click nhấn nút và âm báo phím tắt từ bộ dao động Web Audio API.

---

### 3. 🧠 Ngữ Cảnh Thông Minh & Lịch Âm Việt Nam (100% Tự Động)
- 📅 **Lịch Âm UTC+7**: Thuật toán tính toán ngày âm lịch chuẩn xác theo thiên văn học Việt Nam.
- 🌅 **Nhận diện khung giờ bữa ăn tự nhiên**:
  - 🌅 **Buổi sáng (05:00 - 10:30)**: Ưu tiên bún, phở, bánh mì, xôi, cà phê sáng tràn đầy năng lượng.
  - ☀️ **Buổi trưa (10:30 - 14:00)**: Cơm tấm, cơm văn phòng, bún chả, mì xào no bụng, nạp năng lượng.
  - 🧋 **Buổi xế chiều (14:00 - 17:30)**: Trà sữa, chè, kem, bánh tráng và các món ăn vặt giải nhiệt.
  - 🍲 **Buổi tối (17:30 - 21:30)**: Bữa cơm ấm cúng, lẩu, nướng BBQ, tụ họp gia đình và bạn bè.
  - 🌙 **Ăn khuya (21:30 - 05:00)**: Cháo sườn đêm, mì xào khuya, ốc nóng, bánh mì dân tổ.
- 🌦️ **Thời tiết & Vị trí**: Tùy chọn định vị thiết bị & thời tiết Open-Meteo hoàn toàn bảo mật (xử lý 100% tại client, không lưu trữ dữ liệu cá nhân).

---

### 4. 🇻🇳 Kho Dữ Liệu 1.731 Món Ẩm Thực & 39 Đặc Sản Vùng Miền
- **1.731 món ăn và thức uống** chọn lọc kỹ lưỡng từ 36+ tỉnh thành khắp 3 miền Bắc - Trung - Nam (1.563 Món Ăn & 168 Đồ Uống).
- **39 Đặc sản vùng miền trứ danh** được cấp **Tem Vùng Miền**, hiệu ứng âm thanh chimes đặc trưng và hiệu ứng mở hòm độc bản.
- **Bộ lọc ăn kiêng & Ngân sách**: Hỗ trợ ăn chay, Halal, Eat Clean, Low-carb; phân cấp từ Bình dân, Trung bình đến Sang chảnh.

---

### 5. 📦 6 Loại Hòm Tác Chiến (Crates) Chuyên Biệt
Phân loại độc lập giữa **Món Ăn** và **Đồ Uống**:
- 🍱 **Hòm Bữa Chính**: Cơm tấm, bún bò, phở Hà Nội, bánh cuốn, mì xào no lâu.
- 🍢 **Hòm Ăn Vặt**: Bánh tráng nướng, nem chua rán, chè bưởi, kem xôi đường phố.
- 🍻 **Hòm Ăn Nhậu**: Lẩu Thái, nướng ngói, hải sản, ốc luộc thơm lừng cùng chiến hữu.
- 🥗 **Hòm Đồ Chay**: Lựa chọn thanh tịnh từ rau củ, nấm đậu tươi ngon thuần khiết.
- ☕ **Hòm Cà Phê & Trà**: Cà phê sữa đá, bạc xỉu, trà sen vàng, trà đào thanh mát.
- 🧋 **Hòm Trà Sữa & Đồ Uống Khác**: Trà sữa trân châu, nước ép, sinh tố tươi mát.

---

### 6. 📊 Bảng Tỷ Lệ Độ Hiếm Chuẩn Xác (Rarity Odds)
Hệ thống xác suất thích ứng theo thời gian thực:
- 🟢 **Thường** (Common) ~ 80%
- 🔵 **Hiếm** (Rare) ~ 16%
- 🟣 **Siêu Hiếm** (Epic) ~ 3.5%
- 🟡 **Huyền Thoại** (Legendary) ~ 0.5%
- 🏷️ **Đặc Sản Vùng Miền**: Tự động tính toán xác suất hiển thị theo ngữ cảnh địa phương và ngân sách đang chọn.

---

### 7. 🎰 5 Chế Độ Mở Kết Quả Đa Dạng
1. 🎯 **CS:GO Reel**: Dải băng cuộn dập dềnh hồi hộp phong cách mở hòm súng kinh điển.
2. 📦 **Blindbox 3D Đa Chiều**: Hòm 3D rung lắc vật lý, bung nắp và toả hào quang.
3. 🎡 **Vòng Xoay May Mắn**: Kim xoay đồng hồ với âm thanh gõ tạch tạch kích thích.
4. 🎰 **Slot Machine Bar**: 3 guồng quay nảy số phong cách máy đánh bạc retro.
5. 🃏 **Lật Thẻ Bài**: Hiệu ứng lật thẻ 3D lấp lánh bí ẩn.

---

### 8. 🛵 Kết Nối Trực Tiếp Ứng Dụng Giao Hàng & Bản Đồ
Sau khi trúng món, bạn có thể bấm ngay:
- 🟢 **GrabFood**: Mở ứng dụng GrabFood kèm từ khoá tên món đã trúng.
- 🟠 **ShopeeFood**: Tìm quán bán món trúng trên ShopeeFood.
- 🔴 **Gojek**: Tìm món trên Gojek.
- 📍 **Google Maps**: Tìm các quán ăn gần vị trí hiện tại của bạn nhất.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ | Phiên bản |
| :--- | :--- | :--- |
| **Giao diện & Logic** | React (Hooks, Context, Suspense, StrictMode) | 19.3.0 |
| **Đồ hoạ 3D** | Three.js (WebGL, PBR, PCF Shadow Map, Canvas Fallback) | 0.186.0 |
| **Ngôn ngữ** | TypeScript (Strict mode, full type-safe) | 6.0.3 |
| **Build Tool** | Vite | 8.3.0 |
| **Kiểu dáng (CSS)** | Tailwind CSS & Vanilla CSS Design System | 4.3.3 |
| **Xác thực Schema** | Zod | 4.6.2 |
| **Âm thanh** | Web Audio API (Synthesized Oscillators & Soundscape) | Native Web |
| **Kiểm thử Unit & Smoke** | Vitest & React Testing Library (198 tests) | 5.0.0 |
| **Kiểm thử E2E** | Playwright (Desktop, Mobile, Reduced Motion) | 1.63.0 |
| **Triển khai** | Vercel Serverless Edge Platform | v1.0.0 |

---

## 🚀 Cài Đặt & Chạy Cục Bộ (Getting Started)

### Yêu cầu môi trường:
- **Node.js**: `>= 24 < 25`
- **Package Manager**: `pnpm` (khuyến nghị `pnpm@12.x`)

### Các bước thực hiện:
```bash
# 1. Clone mã nguồn dự án
git clone https://github.com/LongLeo287/HNAG.git
cd HNAG

# 2. Cài đặt toàn bộ thư viện phụ thuộc
pnpm install

# 3. Khởi chạy máy chủ phát triển
pnpm dev
```
Mở trình duyệt tại đường dẫn `http://localhost:5173` để trải nghiệm ứng dụng.

---

## 📋 Danh Sách Lệnh (Scripts)

| Lệnh | Mô tả chi tiết |
| :--- | :--- |
| `pnpm dev` | Khởi chạy máy chủ phát triển Vite với Hot Module Replacement (HMR) |
| `pnpm build` | Biên dịch kiểm tra kiểu TypeScript (`tsc -b`) và đóng gói mã nguồn production |
| `pnpm preview` | Xem trước bản build production tại máy cục bộ |
| `pnpm typecheck` | Kiểm tra toàn bộ kiểu dữ liệu TypeScript không phát sinh lỗi (`tsc -b --noEmit`) |
| `pnpm lint` | Quét kiểm tra lỗi cú pháp và quy chuẩn mã nguồn với ESLint |
| `pnpm test` | Chạy toàn bộ 198 unit tests với Vitest (kiểm tra Randomizer, Context Engine, Lịch Âm, Three.js, Controls) |
| `pnpm test:watch` | Chạy Vitest ở chế độ theo dõi file thay đổi (Watch mode) |
| `pnpm e2e` | Chạy kiểm thử tự động hành vi người dùng toàn diện với Playwright (Desktop, Mobile, Accessibility) |
| `pnpm validate:catalog` | Kiểm tra tính toàn vẹn của 1.731 món ăn, dung lượng hình ảnh WebP và cấu trúc danh mục |
| `pnpm check:boundaries` | Kiểm tra biên giới kiến trúc module, đảm bảo logic lõi không bị phụ thuộc giao diện |
| `pnpm check:scope` | Chặn hiện tượng phình phạm vi và rò rỉ mã không mong muốn |
| `pnpm verify` | Chạy chuỗi kiểm tra chất lượng toàn diện trước khi phát hành (`typecheck -> lint -> test -> validate -> check -> build`) |

---

## 🧪 Đảm Bảo Chất Lượng (Quality Assurance)

Dự án tuân thủ tiêu chuẩn chất lượng khắt khe:
- ✅ **198/198 Unit & Integration Tests Passed** trên 32 test suites riêng biệt.
- ✅ **90/90 E2E Playwright Tests Passed** trên các trình duyệt Chromium, Firefox, WebKit và Mobile viewports.
- ✅ **100% Type-Safe**: Tuyệt đối không sử dụng `any`, xác thực dữ liệu thời gian chạy bằng `Zod`.
- ✅ **Phục hồi sự cố âm thanh (Audio-Unavailable Resilience)**: Ứng dụng hoạt động trơn tru ngay cả khi trình duyệt chặn quyền âm thanh tự động (Autoplay Policy).
- ✅ **Accessibility & Reduced Motion**: Hỗ trợ đầy đủ phím tắt bàn phím chuẩn ARIA và chế độ giảm hoạt họa cho người nhạy cảm với chuyển động (`prefers-reduced-motion`).

---

## ☁️ Hướng Dẫn Triển Khai Lên Vercel (Deployment)

Dự án đã cấu hình sẵn file [`vercel.json`](./vercel.json):
1. Đăng nhập tài khoản [Vercel](https://vercel.com/) và liên kết tài khoản GitHub của bạn.
2. Bấm **Add New...** > **Project** và chọn kho lưu trữ **`LongLeo287/HNAG`**.
3. Giữ nguyên các thông số cấu hình mặc định (Framework Preset: **Vite**, Build Command: `pnpm build`, Output Directory: `dist`).
4. Bấm **Deploy**. Vercel sẽ tự động build và cấp phát URL chính thức có chứng chỉ SSL miễn phí cùng tính năng tự động cập nhật khi có commit mới!

---

## 📜 Bản Quyền & Giấy Phép (License)

Dự án được sáng lập và phát triển bởi **[LongLeo287](https://github.com/LongLeo287)**.  
Dự án được xây dựng với mục đích phục vụ cộng đồng, hoàn toàn miễn phí và phi thương mại. Chúc bạn có những bữa ăn ngon miệng và không còn phải đau đầu vì câu hỏi: *"Hôm nay ăn gì?"*! 🍜
