# ShareVault

![Java 21](https://img.shields.io/badge/Java-21-ED8B00)
![Spring Boot 3.5.4](https://img.shields.io/badge/Spring%20Boot-3.5.4-6DB33F)
![React 19.1.1](https://img.shields.io/badge/React-19.1.1-61DAFB)
![Vite 7.1.2](https://img.shields.io/badge/Vite-7.1.2-646CFF)

ShareVault is a full-stack file-sharing application for individuals and teams that need to upload, organize, and share files securely. It combines Clerk authentication, MongoDB metadata storage, Cloudflare R2 object storage, access-controlled sharing, and subscription-based storage credits in one web application.

## Prerequisites

- Git
- Node.js 20.19+ or 22.12+
- npm
- Java Development Kit (JDK) 21
- A MongoDB instance, local or hosted
- A Cloudflare R2 bucket and API credentials
- A Clerk application for authentication
- A Razorpay account and test keys if subscription payments are enabled
- Windows, macOS, or Linux

The backend includes Maven wrappers, so a separate Maven installation is not required.

## Architecture

## Visuals

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ShareVault
```

### 2. Configure the backend

Create `Backend/src/main/resources/application.properties`. Do not commit real credentials. Use your own values for the placeholders below:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/sharevault
spring.data.mongodb.auto-index-creation=true

server.servlet.context-path=/api/v1.5
frontend.url=http://localhost:5173

spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=25MB

clerk.issuer=https://<your-clerk-domain>
clerk.jwks-url=https://<your-clerk-domain>/.well-known/jwks.json
clerk.webhook.secret=<your-clerk-webhook-secret>

r2.endpoint=https://<your-account-id>.r2.cloudflarestorage.com
r2.access-key-id=<your-r2-access-key>
r2.secret-access-key=<your-r2-secret-key>
r2.bucket-name=<your-r2-bucket>
r2.account-id=<your-cloudflare-account-id>

razorpay.key.id=<your-razorpay-key-id>
razorpay.key.secret=<your-razorpay-key-secret>
```

The existing `Backend/src/main/resources/env.txt` contains environment-specific values. Treat those values as sensitive, rotate them if they have been exposed, and use a private `application.properties` for local development.

### 3. Install frontend dependencies

```bash
cd Frontend
npm ci
```

Create `Frontend/.env.local`:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=pk_test_<your-clerk-publishable-key>
VITE_RAZORPAY_KEY=rzp_test_<your-razorpay-key-id>
```

### 4. Point the frontend at the local backend

For local development, update `Frontend/src/util/apiendpoints.js`:

```javascript
const BASE_URL = "http://localhost:8080/api/v1.5";
```

The file currently contains the deployed API URL. Keep that URL when you intend to use the hosted backend instead.

### 5. Build the backend

From the repository root:

```bash
cd Backend
./mvnw clean package
```

On Windows PowerShell, use:

```powershell
cd Backend
.\mvnw.cmd clean package
```

## Usage

### Start the application locally

Start the backend in one terminal:

```bash
cd Backend
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd Backend
.\mvnw.cmd spring-boot:run
```

Start the frontend in a second terminal:

```bash
cd Frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in a browser.

### Available frontend routes

- `/` — landing page
- `/sign-in` and `/sign-up` — Clerk authentication
- `/dashboard` — storage overview and recent files
- `/upload` — upload up to five files at a time
- `/my-files` — manage uploaded files
- `/saved-files` — view saved files
- `/subscription` — purchase additional storage credits
- `/transactions` — view payment transactions
- `/file/:fileId` — open a shared file link

### Upload a file through the API

Authenticated API requests require a Clerk bearer token. Replace the token and file path in this example:

```bash
curl -X POST "http://localhost:8080/api/v1.5/files/upload" \
  -H "Authorization: Bearer <clerk-session-token>" \
  -F "files=@/path/to/document.pdf"
```

Fetch the current user’s files with:

```bash
curl "http://localhost:8080/api/v1.5/files/my" \
  -H "Authorization: Bearer <clerk-session-token>"
```

### Quality checks

Run the frontend lint and production build:

```bash
cd Frontend
npm run lint
npm run build
```

Run the backend test lifecycle:

```bash
cd Backend
./mvnw test
```

The repository does not currently include an automated coverage or CI configuration.
