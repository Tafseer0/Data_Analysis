# Excel Workbook Analysis Dashboard

## Overview

An analytical dashboard application for parsing and visualizing Excel workbook data. The application provides comprehensive analysis across multiple worksheet types (USR, ATSM, PSSM, PSMP), offering insights into URL statuses, market distributions, content ownership, and removal rates. Users can upload Excel files through a drag-and-drop interface and interact with dynamic filters to explore their data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing

**UI Component System**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library following the "New York" style variant
- Tailwind CSS with custom design tokens defined in CSS variables
- Design system inspired by Linear, Vercel Analytics, and Notion (as documented in design_guidelines.md)

**State Management**
- TanStack Query (React Query) for server state management and caching
- Local React state (useState) for UI-specific state like filters and selections
- No global state management library - component composition and prop drilling suffice for current complexity

**Data Handling**
- Client-side Excel parsing utilities in `excel-utils.ts` for data transformation
- Filtering and aggregation computed on-demand from uploaded workbook data
- Memoization (useMemo) used to optimize expensive calculations

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with TypeScript
- HTTP server (not using WebSockets despite ws dependency present)
- Middleware stack: JSON parsing, URL encoding, request logging

**File Upload Processing**
- Multer middleware for multipart/form-data handling
- 50MB file size limit for Excel uploads
- XLSX library (SheetJS) for server-side Excel file parsing
- Supports .xlsx, .xls, and .csv formats

**API Design**
- Single endpoint architecture: `/api/upload` for file processing
- RESTful conventions with POST for file uploads
- JSON response format for parsed workbook data

**Session Management**
- In-memory storage implementation (`MemStorage` class)
- No persistent database - data exists only during application runtime
- Session storage through connect-pg-simple configured (though not actively used without database)

### Data Storage Solutions

**Current Implementation**
- In-memory storage only via `MemStorage` class in `storage.ts`
- No database persistence - uploaded workbook data is lost on server restart
- Single workbook at a time - new uploads replace previous data

**Database Configuration (Prepared but Not Active)**
- Drizzle ORM configured for PostgreSQL via `@neondatabase/serverless`
- Schema defined in `shared/schema.ts` using Zod for validation
- Migration setup ready in `drizzle.config.ts`
- Note: Database connection will be established when `DATABASE_URL` environment variable is provided

**Data Models**
- `WorkbookAnalysis`: Top-level container for all parsed data
- `SheetData`: Individual worksheet data with records and statistics
- `SheetRecord`: Individual row with url, status, market, month, contentOwner
- `MarketData`: Aggregated statistics per market/country
- `ContentOwnerData`: Aggregated statistics per content owner

### External Dependencies

**UI & Styling**
- Radix UI component primitives (20+ packages for dialogs, dropdowns, etc.)
- Tailwind CSS with PostCSS for processing
- Google Fonts (Inter typeface)
- class-variance-authority and clsx for conditional styling

**File Processing**
- xlsx (SheetJS) for Excel file parsing
- multer for file upload handling
- react-dropzone for drag-and-drop upload UI

**Form & Validation**
- Zod for schema validation
- @hookform/resolvers for React Hook Form integration
- drizzle-zod for schema-to-Zod conversions

**Development Tools**
- tsx for TypeScript execution in development
- esbuild for production builds
- Replit-specific plugins (@replit/vite-plugin-*) for development environment integration

**HTTP & API**
- TanStack Query for data fetching and caching
- Native fetch API for HTTP requests
- CORS support available but not explicitly configured

**Date Handling**
- date-fns for date manipulation and formatting

**Potential Future Integrations**
- Stripe (installed but not implemented)
- Passport with passport-local (installed but not implemented)
- Nodemailer (installed but not implemented)
- OpenAI and Google Generative AI (installed but not implemented)