
# Cách Chạy Project

## Bước 1: Install Node_modules

```bash
npm install
```

## Bước 2 : Chạy

- **Đảm bảo json-server phải là bản 0.17.4 tránh trường hợp bị config với json-server-auth vì bản 0.17.4 là bản cũ và cũng là bản ổn định nhất**.
- **Nếu chưa đúng bản hãy làm theo như sau** : 

```bash
npm uninstall json-server
npm install json-server@0.17
```

### Cách 1: Chạy Server và Project Riêng Biệt

1. **Chạy Server trên Port 3001**:

   Sử dụng lệnh sau để khởi động server :

   ```bash
   json-server src/data/db.json -m ./node_modules/json-server-auth --port 3001
   ```

2. **Chạy Project trên Port 3000**:

    Sử dụng lệnh sau để khởi động project:

    ```bash
    npm start
    ```
    
### Cách 2: Chạy Server và Project đồng thời

1. **Sử dụng câu lệnh sau để khởi động cả server và project**:

    ```bash
    npm run dev
    ```

# Tài khoản

## Admin 

- **Email : admin@gmail.com**

- **Password : admin**

## User 

- **Bạn có thể tự tạo**

# Project Description 

## Các chức năng 

### 1. Đăng ký, đăng nhập.

### 2. Admin
- **Quản lý sản phẩm với các chức năng thêm, sửa, xoá**.

### 3. User
- **Có thể xem các mặt hàng của shop**.
- **Tìm kiếm sản phẩm theo tên**.
- **Xem các thông tin chi tiết của sản phẩm**.
- **Thêm sản phẩm vào giỏ hàng ( có thể thêm mã giảm giá để giảm số tiền mua )**.
- **CheckOut sản phẩm**

### Ngoài ra sản phẩm còn được responsive để phù hợp với mọi thiết bị, thiết kế giao diện UX để tối ưu hoá trai nghiệm của người dùng

