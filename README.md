# How to Run Project

## Step 1: Install Node_modules

```bash
npm install
```

## Step 2: Run

- **Make sure json-server is version 0.17.4 to avoid being configured with json-server-auth because version 0.17.4 is the old version and also the most stable version**.
- **If the version is not correct, please follow the following** :

```bash
npm uninstall json-server
npm install json-server@0.17
```

### Method 1: Run Server and Project Separately

1. **Run Server on Port 3001**:

Use the following command to start the server :

```bash
json-server src/data/db.json -m ./node_modules/json-server-auth --port 3001
```

2. **Run Project on Port 3000**:

Use the following command to start the project:

```bash
npm start
```

### Method 2: Run Server and Project at the same time

1. **Use the following command to start both server and project**:

```bash
npm run dev
```

# Resources account

## Admin

- **Email : admin@gmail.com**

- **Password : admin**

## User

- **You can create yourself**

# Project Description

## Functions

### 1. Register, log in for user and admin.

- **Login: "/Admin/Login"**
- **Register: "/Admin/Register"**

### 2. Admin
- **Manage products with add, edit, delete functions**.

### 3. User
- **Can view shop items**.

- **Search products by name**.

- **View product details**.

- **Add products to cart (can add discount codes { code sale 20% : "bigsale", code sale 10% : "sale" } to reduce purchase amount)**.

- **CheckOut products**

### In addition, the product is also responsive to suit all devices, UX interface design to optimize user experience
