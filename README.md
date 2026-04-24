# Pet Connect Plus

My system will provide improved operational efficiency for shelters and pet owners. The target users are adopters/pet owners and admin shelter staff, depending on the process needed at the time. The platform also ensures that pets receive services in a timely manner based on their needs.

## Description

**Problem Statement:** My proposal is for a Pet Adoption Connect and Owner to Sitter platform for my Capstone Project. Animal shelters often rely on manual or outdated systems to manage pet records and adoption applications, which creates inefficiencies, delayed responses to adopters, and difficulty tracking post-adoption follow-ups. Additionally, owners need an effective way to communicate daily care needs to pet sitters and track the tasks required of them.

**Proposed Solution:** Pet Adoption/Owner Connect is a full-stack web application that streamlines the adoption process. The platform enables users to browse available pets, and provides administrators tools to manage pet records, review applications, and schedule follow-up reminders. Owners can also create tasks for pet sitters to manage during the care process, creating a connection between owners and the service centers that care for pets after adoption.

## Getting Started

### Dependencies

* Node.js 18+
* npm 9+
* Spring Boot backend running on `localhost:8080`
* Git

### Installing

1. Clone the repository:

```bash
git clone https://github.com/AMJ0h531/petconnect--client
cd petconnect--client
```

1. Install dependencies:

```bash
npm install
```

1. Create your `.env` file:

```bash
cp .env.example .env
# .env already points to localhost:8080 for local dev
```

### Executing program

1. Make sure your Spring Boot backend is running on `localhost:8080`.

1. Start the development server:

```bash
npm run dev
```

1. Open your browser and navigate to:

```text
http://localhost:5173
```

## Help

**Backend not running:** Ensure your Spring Boot backend is started before launching the frontend. The app will load but API calls will fail if the backend is unreachable.

**Port already in use:** If port 5173 is taken, Vite will automatically try the next available port — check your terminal output for the actual URL.

**Dependency issues:** If you encounter install errors, try deleting `node_modules` and reinstalling:

```bash
rm -rf node_modules
npm install
```

**Environment variables not loading:** Make sure your `.env` file exists at the project root and that variable names start with `VITE_` to be accessible in the app.

## Authors

**Anna Marie Johnson**
ajohnson53169@gmail.com

## Version History

* 0.1
  * Initial Release

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

* [React](https://react.dev/) - Frontend UI library
* [Vite](https://vitejs.dev/) - Build tool and dev server
* [Bootstrap](https://getbootstrap.com/) - CSS framework
* [React Router](https://reactrouter.com/) - Client-side routing
* [Axios](https://axios-http.com/) - HTTP client

## Running Pet Connect Plus Locally

### Prerequisites

* Node.js 18+
* Your Spring Boot backend running on `localhost:8080`

### Setup

1. Clone the frontend repo:

```bash
git clone https://github.com/AMJ0h531/petconnect--client
cd petconnect--client
```

1. Install dependencies:

```bash
npm install
```

1. Create your `.env` file:

```bash
cp .env.example .env
# .env already points to localhost:8080 for local dev
```

1. Start the development server:

```bash
npm run dev
```

Open <http://localhost:5173>

### Building for AWS Deployment

```bash
# Sets VITE_API_URL to your EC2 address, outputs to dist/
VITE_API_URL=http://your-ec2-ip:8080/api npm run build

# Upload dist/ folder to S3
aws s3 sync dist/ s3://your-bucket-name --delete
```

### Demo Credentials (Local Seed Data Only)

> **Note:** These credentials are for local development only. Do not use them in any production or publicly accessible environment.

| Role  | Username      | Password |
|-------|---------------|----------|
| Admin | shelter_admin | admin123 |
| User  | user_anna     | admin123 |
