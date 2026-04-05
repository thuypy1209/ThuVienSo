# ThuVienSo
#  Đồ án: Web Thư Viện Số (Backend Node.js)

Dự án phát triển API Backend cho hệ thống quản lý Thư viện số, sử dụng kiến trúc MVC (trả về JSON).

## 🛠 Công nghệ sử dụng
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (sử dụng thư viện Mongoose)
- **Bảo mật:** JWT (JSON Web Token) phân quyền Admin/Độc giả
- **Upload File:** Multer

##  Hướng dẫn chạy dự án (Dành cho thành viên nhóm)

**Bước 1:** Clone code về máy.
**Bước 2:** Mở Terminal tại thư mục code, chạy lệnh cài đặt thư viện:
\`\`\`bash
npm install
\`\`\`
**Bước 3:** Mở phần mềm **MongoDB Compass** lên và bấm Connect (để nó chạy ngầm, hệ thống sẽ tự động tạo Database tên là `thuvienso`).
**Bước 4:** Khởi động Server:
\`\`\`bash
npm start
\`\`\`
*(Server sẽ chạy tại: http://localhost:3000)*

## 📂 Tiến độ Model (Sơ đồ Database)

 **Đã hoàn thành 8/12 Model (Bao gồm Full CRUD, Phân quyền JWT, Upload File):**
1. `User` (Quản lý tài khoản)
2. `Category` (Danh mục sách)
3. `Book` (Quản lý Sách)
4. `Author` (Tác giả)
5. `Publisher` (Nhà xuất bản)
6. `Review` (Đánh giá & Bình luận sách)
7. `BorrowRecord` (Quản lý mượn/trả sách)
8. `EbookFile` (Quản lý file sách số & Upload PDF/Ảnh)

 **Nhiệm vụ 4 Model còn lại (Các thành viên tự chia nhau, tham khảo code của 8 bảng trên):**
1. `Fine` (Quản lý tiền phạt)
2. `Reservation` (Đặt trước sách)
3. `Notification` (Hệ thống thông báo)
4. `Wishlist` (Tủ sách yêu thích của độc giả)
5. đây là ý kiến cá nhân có thể thay đổi hoặc thêm mới

*Lưu ý: Nhóm làm Backend chỉ test bằng Postman và xuất ảnh báo cáo, tuyệt đối không dùng thư mục views (MVC = 0đ theo yêu cầu giảng viên).*
>>>>>>> origin/dev
