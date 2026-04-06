
You are a senior backend engineer with many years of experience

1. Tổng quan Dự án (Project Overview)
Dự án có tên là ThuVienSo (Thư viện số), một hệ thống quản lý và đọc sách trực tuyến.

Mục tiêu: Cho phép người dùng đăng ký, đăng nhập, tìm kiếm sách, đọc sách trực tuyến và thảo luận trên diễn đàn.

Phân quyền: Gồm 2 nhóm chính là Admin/Thủ thư (Quản lý sách, danh mục, người dùng) và Độc giả (Xem sách, mượn sách, đánh giá).

2. Kiến trúc Kỹ thuật (Tech Stack)
Backend (Mô hình MVC - Trả về JSON API)
Runtime: Node.js & Express.js.

Database: MongoDB (Mongoose ODM).

Authentication: JWT (JSON Web Token) với SECRET_KEY = "ThuVienSo_Hutech_Secret".

Cấu trúc thư mục: schemas/ (Model), controllers/, routes/, middlewares/.

Frontend (React hiện đại)
Công cụ: Vite + React 19.

Routing: react-router-dom v7.

Styling: CSS thuần (biến :root).

3. Cấu trúc Database & API (Backend Context)
Hệ thống hiện đã hoàn thành các Model và API sau:

User: username, password, fullName, role (Admin/Librarian/Reader).

Category: Quản lý danh mục sách (đã có CRUD).

Book: Thông tin sách, liên kết với Category.

BorrowRecord: Quản lý mượn/trả sách.

Review: Đánh giá và bình luận.

Realtime: Đã tích hợp Socket.io cho tính năng chat/diễn đàn.

4. Cấu trúc Frontend (Frontend Context)
Hiện tại dự án đã có các Route chính trong App.jsx:

/: Trang Auth (Login/Register).

/home: Trang chủ (Hiển thị danh sách sách).

/doc-sach/:id: Trình đọc sách PDF/Epub.

/quan-ly-sach: Giao diện Admin quản lý kho sách.

/forum: Diễn đàn thảo luận thời gian thực.

5. Quy tắc Code (Coding Guidelines for Agent)
API Calling: Luôn sử dụng URL http://localhost:3000 (Backend port).

Security: Mọi request cần đính kèm Header Authorization: Bearer <token> sau khi đăng nhập.

UI/UX: Ưu tiên sử dụng CSS biến (var(--accent), var(--bg)) có sẵn trong index.css để giữ tính đồng bộ.

State Management: Sử dụng useState và useEffect của React 19.

6. Nhiệm vụ ưu tiên (Next Tasks)
Auth Logic: Hoàn thiện kết nối API Đăng nhập/Đăng ký từ AuthPage vào Backend. Lưu Token vào localStorage.

Protected Routes: Tạo Component bọc để ngăn người dùng chưa đăng nhập vào /home.

Book List: Fetch dữ liệu từ API /books và hiển thị Grid sách tại trang Home.

Admin Dashboard: Xây dựng bảng quản lý CRUD cho sách và danh mục.

Lưu Ý: Hãy đọc kỹ cấu trúc các file App.jsx, package.json và các Controller Backend trước khi đề xuất code mới. Luôn giữ phong cách giải thích code bằng tiếng Việt gần gũi, không thêm icon MD tùa ý khi  tạo chú thích 
