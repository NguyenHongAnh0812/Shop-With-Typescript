
# Cách Chạy Project

## Bước 1: Install Node_modules

```bash
npm install
```

## Bước 2 : Chạy

### Cách 1: Chạy Server và Project Riêng Biệt

1. **Chạy Server trên Port 3001**:

   Sử dụng lệnh sau để khởi động server (nếu json-server không phải bản 0.17.4 thì hãy uninstall và cài lại npm i json-server@0.17) :

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
