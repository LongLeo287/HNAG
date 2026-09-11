# #HNAG — Hôm Nay Ăn Gì?

Không biết ăn/uống gì? Chọn vài bộ lọc, mở hộp, để #HNAG chốt giúp bạn — một game random
đồ ăn/uống kiểu blindbox, chạy hoàn toàn phía trình duyệt.

Đây là bản build M0 (nền tảng) + M1 (bản chơi được đầu tiên) theo đặc tả trong bảng kế hoạch
`#HNAG`. Xem [`CLAUDE.md`](./CLAUDE.md) cho các ràng buộc bắt buộc và
[`docs/implementation-plan.md`](./docs/implementation-plan.md) cho việc ánh xạ code ↔ spec ID.

## Chạy thử

Yêu cầu Node.js 24.x + pnpm 12.3.4 (xem `docs/decisions.md` nếu máy bạn dùng phiên bản khác).
Không cần file `.env` — M1 không có backend/API/DB nào.

```bash
pnpm install
pnpm dev       # http://localhost:5173
```

## Scripts

| Script | Việc gì |
|---|---|
| `pnpm dev` | Chạy dev server (Vite) |
| `pnpm build` | Build production (static output) |
| `pnpm preview` | Xem bản build |
| `pnpm typecheck` | `tsc -b --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest — unit/property/statistical tests cho randomizer, pool, preferences, UI |
| `pnpm e2e` | Playwright — chạy `pnpm exec playwright install` một lần trước khi dùng lần đầu |
| `pnpm validate:catalog` | Kiểm tra dữ liệu món ăn/uống đóng gói sẵn |
| `pnpm check:boundaries` | Chặn import sai hướng (vd: randomizer domain import React) |
| `pnpm check:scope` | Chặn phình phạm vi M2+ (DB/auth/Maps/provider/commerce) |
| `pnpm verify` | Chạy toàn bộ các bước trên + build |

## Cơ chế cốt lõi

1. Chọn **Ăn/Uống** + bộ lọc (loại món, chay, ngân sách) — tuỳ chọn, không bắt buộc.
2. Bấm **Mở hộp / Quay** — kết quả được chốt ngay lập tức (thuật toán thuần túy, không phụ
   thuộc animation), rồi mới phát hoạt ảnh case-reel.
3. Xem hoạt ảnh quay (hoặc phản hồi nhanh nếu bật "giảm chuyển động").
4. **Chốt món này** hoặc **Quay tiếp** (loại trừ đúng món vừa ra, nếu còn món khác đủ điều kiện).

Toàn bộ dữ liệu (bộ lọc, món tuỳ chỉnh, món đã tắt, âm thanh bật/tắt) lưu cục bộ trong trình
duyệt — không tài khoản, không đồng bộ, không server.

## Không có trong M0/M1 (có chủ đích)

Không database, không API server, không đăng nhập, không GPS/Google Maps/Places, không tích hợp
GrabFood/ShopeeFood/beFood/Xanh SM, không giỏ hàng/thanh toán/đặt đơn ở bất kỳ giai đoạn nào. Xem
`CLAUDE.md` và tab `27_BUILD_READINESS` trong bảng kế hoạch để biết lý do.
