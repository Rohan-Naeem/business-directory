# NexusBiz - Production Multi-Country Business Directory Platform

A modern, scalable, SEO-optimized business directory platform engineered with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL (Supabase)**.

NexusBiz is inspired by top modern directory portals (such as *bizbranches.pk* and *bizprimehub.com*) but designed from the ground up with an original identity, strict relational database integrity, dual-mode data architecture (in-memory stateful repository with automatic Supabase failover), multi-step listing submissions, moderation workflows, Schema.org `LocalBusiness` JSON-LD metadata, and multi-country geographic scaling.

---

## 🌟 Key Features

### 1. Multi-Country Geographic Architecture
- **Initial Supported Countries:**
  - 🇵🇰 **Pakistan** (Punjab, Sindh, Islamabad Capital Territory, Khyber Pakhtunkhwa)
  - 🇺🇸 **United States** (New York, California, Texas, Illinois, Florida)
  - 🇬🇧 **United Kingdom** (England, Scotland, Wales)
- Extensible relational architecture using internal stable IDs (`country_id`, `region_id`, `city_id`). Adding a 4th or 5th country requires zero architectural rewrites.
- Built-in **Geographic Dataset Importer** (`/admin/locations`) to import additional cities and regions dynamically.

### 2. High-Performance Multi-Dimensional Search
- **Instant Keyword & Service Search:** Query by business name, keywords, or specialties.
- **Dynamic Dependent Dropdowns:** Selecting a country filters available regions and cities instantly.
- **Parametric Filtering:** Filter simultaneously by category, subcategory, country, city, and minimum rating.
- **URL Query Sync:** Full state sync via query parameters (`/search?q=hospital&country=pakistan&city=lahore`).

### 3. Comprehensive Business Profiles & SEO
- **Stable SEO Slugs:** Canonical URLs formatted as `/business/[slug]`.
- **Structured Data:** Automated Schema.org `LocalBusiness` (or specialized sub-types like `MedicalBusiness`, `TechBusiness`, `FoodEstablishment`), `BreadcrumbList`, and `Organization` JSON-LD.
- **Real Verification & Moderation Status:** Real verification badges displayed only when `is_verified: true`.
- **Dynamic Business Hours:** Live opening/closing status indicator ("Open Now" / "Closed").
- **Customer Reviews & Moderation:** Real user review submission with star ratings and admin approval workflows.
- **Report Listing Flow:** Community reporting system for outdated addresses or phone numbers.

### 4. Robust 3-Step Add Business Workflow (`/add-business`)
- **Step 1:** Basic business profile & categorization.
- **Step 2:** Location, address, postal code, and country/region/city cascading selectors.
- **Step 3:** Contact info (Phone, Email, Website, WhatsApp), operating hours, and media.
- **Strict Server-Side Validation:** Validated via **Zod schemas** on submission.
- **Security & Integrity:** All user submissions are assigned `pending` status by default. Users cannot directly publish approved listings without administrator review.

### 5. Administrative Moderation Dashboard (`/admin`)
- **Dashboard Overview:** Metric cards (Total listings, Pending approvals, Active categories, Open reports).
- **Listing Management (`/admin/listings`):** Filter by status (`all`, `approved`, `pending`, `rejected`), approve/reject submissions with 1 click, toggle featured badges, or remove listings.
- **Location Management (`/admin/locations`):** Geographic explorer and bulk dataset import tools for Pakistan, USA, and UK.
- **Review Moderation (`/admin/reviews`):** Approve or reject customer reviews before they appear publicly.
- **Report Resolution (`/admin/reports`):** Review and resolve community reports regarding incorrect information.

### 6. Technical SEO & Core Web Vitals
- **Dynamic XML Sitemap:** Automatically generated at `/sitemap.xml` with `<lastmod>` timestamps, containing canonical URLs for directories, categories, and approved businesses.
- **Robots.txt:** Optimized directives at `/robots.txt` disallowing `/admin/`, `/dashboard/`, and private endpoints while allowing search crawlers access to public routes.
- **Server-Side Generation & Rendering:** Next.js App Router with ISR caching and lightning-fast TTFB.

---

## 🎨 Visual Identity & Color Palette

- **Primary Brand Color:** Deep Emerald Green (`#065F46` / `emerald-800`)
- **Accent Action Color:** Emerald (`#10B981` / `emerald-600`)
- **Secondary Highlight:** Warm Amber (`#FBBF24` / `amber-400`)
- **Primary Text:** Dark Navy (`#172B45`)
- **Secondary Text:** Slate Gray (`#64748B`)
- **Backgrounds:** Pure White (`#FFFFFF`) and Soft Slate (`#F7F9FC`)

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Validation** | Zod |
| **Database** | PostgreSQL via Supabase (with stateful in-memory failover repository) |
| **Auth** | Supabase Auth (Email/Password) |
| **Deployment** | Vercel Ready |

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Node.js 18.x or 20.x+
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env.local
```

> **Note:** The directory is architected with a **dual-mode data repository**. If you do not configure Supabase credentials right away, NexusBiz runs automatically in **Local Repository Mode** with pre-seeded data, instant in-memory CRUD operations, and 100% of features functional out of the box!

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🗄️ Database Setup (Supabase PostgreSQL)

If you wish to connect your own Supabase cloud database:

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Run the migration script located at:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
   This will create all tables, indexes, constraints, and Row Level Security (RLS) policies.
4. Run the seed script:
   ```
   supabase/seed.sql
   ```
5. Obtain your project credentials from **Project Settings > API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Add them to `.env.local` and restart the server.

---

## 🔐 Creating the Initial Administrator Account

In Supabase:
1. Navigate to **Authentication > Users** in the Supabase Dashboard.
2. Click **Add User** and create an account with your desired email and password.
3. Open the **SQL Editor** and run:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE id = '<USER_UUID_FROM_AUTH_USERS>';
   ```
4. You can now sign in at `/auth/login` and access `/admin`.

---

## 📁 Key File Structure

```
├── src/
│   ├── app/
│   │   ├── (public pages)
│   │   ├── directories/          # Country & city directories
│   │   ├── business/[slug]/      # Business profiles with JSON-LD
│   │   ├── categories/           # Category taxonomies
│   │   ├── search/               # Search engine with faceted filters
│   │   ├── add-business/         # 3-step listing submission
│   │   ├── admin/                # Admin moderation dashboard
│   │   ├── api/                  # REST APIs (businesses, reviews, reports, admin)
│   │   ├── sitemap.xml/route.ts  # Dynamic XML sitemap generator
│   │   └── robots.txt/route.ts   # Robots.txt generator
│   ├── components/
│   │   ├── business/             # BusinessCard, Profile, ReviewModal, ReportModal
│   │   ├── search/               # HeroSearch, SearchPageClient
│   │   ├── layout/               # Header, Footer, Breadcrumbs
│   │   └── home/                 # CategoryGrid, CountryExplorer, HowItWorks, FAQ
│   ├── lib/
│   │   ├── data/                 # DirectoryRepository, initial-data, geo-data
│   │   ├── supabase/             # Browser & server Supabase clients
│   │   ├── types.ts              # Global TypeScript models
│   │   └── utils.ts              # Business hours logic, formatting helpers
├── supabase/
│   ├── migrations/               # PostgreSQL schema & RLS policies
│   └── seed.sql                  # Initial seed data
└── scripts/
    ├── test-endpoints.mjs        # Automated route status test suite
    └── test-functional-flows.mjs # Automated business submission & admin approval test suite
```

---

## 🧪 Testing the Application

Automated test scripts are included in `scripts/`:

1. **Verify All HTTP Endpoints:**
   ```bash
   node scripts/test-endpoints.mjs
   ```
2. **Verify Business Submission, Admin Approval & Moderation:**
   ```bash
   node scripts/test-functional-flows.mjs
   ```

---

## 🚢 Deployment to Vercel

1. Push this repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Under **Environment Variables**, set:
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.com`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**. Vercel will build the optimized production bundle automatically.
