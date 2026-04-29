
Japan Travel AI Backend
=======================

Description
-----------

Simple backend API for the "Japan Travel AI" project. Provides authentication, profile, and itinerary endpoints.

Quickstart
----------

- Requirements: `Node.js` v18+ and `npm` or `pnpm`.
- Install dependencies:

```bash
npm install
```

- Run the application (development):

```bash
npm run dev
```

Testing
-------

- Run unit tests with `vitest`:

```bash
npm test
```

Configuration
-------------

- Copy environment variables from `.env.example` (if available) and set up database and email configuration in `config/`.

Project Structure
-----------------

- `src/` : source code
- `src/controllers` : endpoint logic
- `src/routes` : route definitions
- `src/services` : services such as email sending
- `src/models` : data models

Contact
-------

For questions, open an issue in the repository or contact the project owner.

License
-------

See the `LICENSE` file if available.
