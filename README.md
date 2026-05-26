# Japan Travel AI Backend

## Description

Simple backend API for the "Japan Travel AI" project. Provides authentication, profile, and itinerary endpoints.

## Quickstart

- Requirements: `Node.js` v18+ and `npm` or `pnpm`.
- Install dependencies:

```bash
npm install
```

- Run the application (development):

```bash
npm run dev
```

- Access API Swagger documentation:
  - **Swagger UI:** http://localhost:5000/api-docs

### API Endpoints Summary

- **Authentication**: Register, Login, Email Verification, Password Reset
- **Users** (Admin only): List, Create, Read, Update, Delete
- **Profile**: Get, Update, Delete current user
- **Itinerary**: Generate, Save, List, Get, Update, Delete

## Testing

- Run unit tests with `vitest`:

```bash
npm test
```

## Configuration

- Copy environment variables from `.env.example` and set up database and email configuration`.

## Project Structure

- `src/` : source code
- `src/controllers` : endpoint logic
- `src/routes` : route definitions with Swagger documentation
- `src/services` : services such as email sending
- `src/models` : data models
- `src/docs` : Swagger configuration files

## Contact

For questions, open an issue in the repository or contact the project owner.

## License

This project is licensed under the MIT License.
