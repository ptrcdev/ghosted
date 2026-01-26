# 👻 Ghosted

**Ghosted** is a privacy-first job application tracker that helps job seekers stay organized and regain control in a hiring process that often lacks transparency. Built as a full-stack project with a strong focus on **security, correctness, and clean architecture**.

---

## ✨ Features

- 🔐 **Secure Authentication** – Email/password authentication via Supabase Auth
- 📋 **Application Tracking** – Monitor job applications with customizable statuses, URLs, dates, and notes
- 📎 **CV Management** – Upload and associate CVs (PDFs) with specific applications
- 🛡️ **Row-Level Security** – Database-enforced access control ensuring users can only access their own data
- 🚦 **Rate Limiting** – Protected API endpoints to prevent abuse
- 📘 **API Documentation** – Auto-generated Swagger docs for easy integration and testing

---

## 🧱 Tech Stack

### Frontend
- **Vite** – Fast React + TypeScript development environment
- **shadcn/ui** – Accessible, composable UI components built on Radix
- **Axios** – Type-safe HTTP client for API communication

### Backend
- **NestJS** – Scalable Node.js framework with TypeScript
- **Supabase JWT validation** – Secure authentication using Supabase-issued tokens
- **API Versioning** – URI-based versioning for backward compatibility
- **Rate Limiting** – `@nestjs/throttler` for request throttling
- **Swagger/OpenAPI** – Automated API documentation

### Database & Storage
- **Supabase**
  - **PostgreSQL** with Row-Level Security (RLS)
  - **Supabase Auth** for user management
  - **Supabase Storage** for secure file uploads

---

## 🏗️ Architecture Overview

### Backend Structure
```
src/
├── job_application/
│   ├── job_application.controller.ts
│   ├── job_application.service.ts
│   ├── job_application.module.ts
│   └── dtos/
├── db/
│   ├── db.module.ts
│   └── db.service.ts           # Supabase client + database operations
├── storage/
│   ├── storage.module.ts
│   └── storage.service.ts      # File upload & storage operations
├── auth/
│   └── decorators/
│       └── user.decorator.ts  # Extract user ID from JWT
│   └── guards/
│       └── jwt.auth.guard.ts   # Validate JWT and extract user info
│   └── startegies/
        └── supabase.strategy.ts
└── main.ts
```

### Key Architectural Principles

- **Zero Trust Client Input** – User IDs are never accepted from the client
- **JWT-Derived Identity** – User identity is extracted exclusively from validated JWTs
- **Defense in Depth** – Authorization enforced at both API and database layers
- **Separation of Concerns** – Clear boundaries between authentication, business logic, and data access

---

## 🔐 Authentication & Security

### Flow
1. Users authenticate through **Supabase Auth** (email/password)
2. Frontend receives a JWT from Supabase
3. Frontend includes JWT in API requests via `Authorization: Bearer` header
4. Backend validates JWT using Supabase's public JWKS endpoint
5. Database queries use `auth.uid()` in RLS policies to enforce data isolation

### Security Guarantees
- ✅ No cross-user data access
- ✅ Server-side JWT validation
- ✅ Client cannot spoof user identity
- ✅ Database-level access control via RLS
- ✅ No sensitive credentials stored in frontend

---

## 📎 File Upload System

### CV Upload Flow
- PDFs uploaded via **multipart/form-data** requests
- Files stored in **Supabase Storage**
- Storage bucket policies restrict access to file owner only

### Validation
- Server-side MIME type validation
- File size limits enforced
- Sanitized filenames to prevent path traversal

---

## 🚀 Deployment

The application is deployed on **Vercel** with a custom domain.

### 🧪 Try the Demo

Explore the live application using the demo account:

```
Email: testacc@ptrclmd.dev
Password: TestAccountPassword!
```

> ⚠️ **Note:** Demo data may be reset periodically.

---

## 📚 API Documentation

Interactive API documentation is available in development mode:

```
http://localhost:3000/api
```

Swagger UI provides:
- Complete endpoint reference
- Request/response schemas
- Interactive API testing
- Authentication examples

---

## ⚙️ Environment Variables

### Frontend (`.env`)
```bash
VITE_BACKEND_URL=https://api.yourdomain.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (`.env`)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
PORT=3000
```

See `.env.example` files in respective directories for complete configuration options.

---

## 🧠 Design Philosophy

Ghosted was built with these core principles:

- **🔒 Security First** – RLS policies, JWT validation, and zero-trust architecture
- **🎯 Clear Separation of Concerns** – Modular codebase with single-responsibility modules
- **📦 Production-Ready MVP** – Minimal but complete feature set with proper error handling
- **🔧 Extensibility** – Clean interfaces designed for future enhancements
- **📖 Documentation** – Self-documenting code with comprehensive API docs

---

## 🛣️ Roadmap

### Potential Future Enhancements
- 📊 **Analytics Dashboard** – Visualize application success rates and timelines
- ⏰ **Smart Reminders** – Automated follow-up notifications
- 🤖 **AI-Powered Insights** – Pattern detection in hiring processes
- 📧 **Email Integration** – Track applications automatically from inbox
- 🌐 **Job Board Integrations** – Import applications from popular job sites
- 📱 **Mobile App** – Native iOS/Android applications

---

## 📌 Project Status

**Ghosted** is currently an MVP built as a solo project. The application is fully functional and deployed, with a clean foundation for incremental feature additions.

---

## 👤 Author

Built by **Patrícia Almeida**  
[GitHub](https://github.com/ptrcdev) • [Website](https://ptrclmd.dev)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **Supabase** – For the excellent PostgreSQL + Auth platform
- **NestJS** – For the robust backend framework
- **shadcn/ui** – For beautiful, accessible components
- **Vercel** – For seamless deployment infrastructure