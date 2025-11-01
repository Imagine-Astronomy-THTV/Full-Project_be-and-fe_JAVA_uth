# MathBridge Project

Dự án học toán trực tuyến với kiến trúc Full-stack: Spring Boot (Backend) + Next.js (Frontend)

## Cấu trúc dự án

```
Project_Java_WebMath/
├── be_project/          # Backend - Spring Boot
├── fe_next_project/     # Frontend - Next.js
└── README.md
```

## Yêu cầu hệ thống

### Backend
- Java 21+
- Maven 3.6+
- SQL Server (hoặc SQL Server Express)
- Port: 8081

### Frontend
- Node.js 18+
- npm hoặc yarn
- Port: 3000

## Hướng dẫn chạy Backend

1. **Cấu hình Database:**
   - Mở file `be_project/src/main/resources/application.yml`
   - Cập nhật thông tin kết nối SQL Server:
     ```yaml
     spring:
       datasource:
         url: jdbc:sqlserver://localhost:1433;databaseName=elearning
         username: sa
         password: 123456
     ```

2. **Tạo database:**
   ```sql
   CREATE DATABASE elearning;
   ```

3. **Chạy Backend:**
   ```bash
   cd be_project
   ./mvnw spring-boot:run
   # Hoặc trên Windows:
   mvnw.cmd spring-boot:run
   ```

4. **Kiểm tra:**
   - Backend chạy tại: http://localhost:8081
   - Swagger UI: http://localhost:8081/swagger-ui.html

## Hướng dẫn chạy Frontend

1. **Cài đặt dependencies:**
   ```bash
   cd fe_next_project
   npm install
   ```

2. **Cấu hình API URL (tùy chọn):**
   - Tạo file `.env.local` trong `fe_next_project/`:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8081
     ```
   - Nếu không có file này, mặc định sẽ dùng `http://localhost:8081`

3. **Chạy Frontend:**
   ```bash
   npm run dev
   ```

4. **Kiểm tra:**
   - Frontend chạy tại: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Users
- `GET /api/users` - Lấy danh sách users
- `GET /api/users/{id}` - Lấy user theo ID
- `POST /api/users` - Tạo user mới

### Students
- `GET /api/students` - Lấy danh sách students
- `GET /api/students/{id}` - Lấy student theo ID
- `POST /api/students/create` - Tạo student mới

### Tutors
- `GET /api/tutors` - Lấy danh sách tutors
- `GET /api/tutors/{id}` - Lấy tutor theo ID
- `POST /api/tutors` - Tạo tutor mới

### Sessions
- `GET /api/sessions` - Lấy danh sách sessions
- `GET /api/sessions/{id}` - Lấy session theo ID
- `POST /api/sessions` - Tạo session mới

## Lưu ý

1. **CORS:** Backend đã được cấu hình để cho phép requests từ `http://localhost:3000`
2. **JWT:** Sau khi đăng nhập thành công, token sẽ được lưu trong localStorage của browser
3. **Database:** Backend sử dụng SQL Server, đảm bảo SQL Server đang chạy trước khi start backend

## Xử lý lỗi thường gặp

1. **Lỗi kết nối database:**
   - Kiểm tra SQL Server đã chạy chưa
   - Kiểm tra thông tin kết nối trong `application.yml`

2. **Lỗi CORS:**
   - Đảm bảo backend đang chạy trên port 8081
   - Kiểm tra cấu hình CORS trong `SecurityConfig.java`

3. **Lỗi Frontend không kết nối được Backend:**
   - Kiểm tra biến môi trường `NEXT_PUBLIC_API_URL`
   - Đảm bảo backend đã start thành công
