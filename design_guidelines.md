# Design Guidelines: Excel Workbook Analysis Dashboard

## Design Approach
**Reference-Based Approach** drawing from modern analytical dashboards:
- **Primary Inspiration**: Linear (clean data presentation), Vercel Analytics (clear metrics cards), Notion (organized information hierarchy)
- **Core Principle**: Data clarity and scanability over visual flourish - every element serves analytical purpose

## Typography System
- **Primary Font**: Inter or system-ui (via Google Fonts)
- **Hierarchy**:
  - Dashboard Title: text-2xl font-bold
  - Section Headers: text-xl font-semibold
  - Card Titles/Metrics: text-lg font-medium
  - Data Labels: text-sm font-medium
  - Body/Table Text: text-sm
  - Small Labels/Badges: text-xs font-medium

## Layout System
- **Spacing Primitives**: Tailwind units of 3, 4, 6, 8, 12 (p-4, gap-6, mb-8, etc.)
- **Container**: max-w-7xl mx-auto with px-6
- **Section Spacing**: mb-8 between major sections
- **Card Padding**: p-6 for cards, p-4 for smaller components
- **Grid Systems**: 
  - Summary cards: grid-cols-2 lg:grid-cols-4
  - Sheet cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
  - Tables: full-width with proper cell padding (px-4 py-3)

## Component Library

### Header Section (Section 1)
- Full-width with border-b, bg-white, sticky top-0 z-50
- Two-row layout: Title row + Filter row
- Title: Bold with subtle subtitle (text-gray-600)
- Filter bar: flex justify-between with gap-4
- Dropdowns: Rounded select inputs with icons
- Upload button: Primary action button, right-aligned

### Summary Cards (Sections 2, 3, 5, 6)
- **Gradient Cards**: Subtle gradient backgrounds with white text overlays where appropriate
- Card structure: Rounded-lg with shadow-sm, border
- Metric display: Large number (text-3xl font-bold) with label below (text-sm)
- Status indicators: Colored dot or badge prefix
- Progress bars: Rounded, height h-2, with smooth fill animation

### Data Tables (Sections 4, 7)
- **Modern Table Design**: 
  - Header row: bg-gray-50 with font-medium text-xs uppercase tracking-wide
  - Body rows: hover:bg-gray-50 transition
  - Cell alignment: Left for text, right for numbers
  - Borders: border-b on rows (not full grid)
- **Badges**: Inline pill-shaped badges for counts and statuses
- **Tab Navigation**: Underline-style tabs with active state indicator

### Sheet Tabs Pattern
- Horizontal tab list with border-b
- Active tab: border-b-2 with offset positioning
- Tab labels show sheet abbreviations (USR, ATSM, PSSM, PSMP)
- Click interaction changes active state and filters content

### File Upload Zone
- Large dropzone area (min-h-64) with dashed border
- Icon: Upload cloud icon (from Heroicons)
- Text hierarchy: Primary instruction + supported formats list
- Drag-over state: border style change
- File type validation: .xlsx, .xls, .csv displayed prominently

### Filter Components
- **Dropdown Filters**: Custom select with chevron icon
- Filter chips: Removable pills showing active filters
- "Clear All" action when filters applied
- Filter count badge on dropdown when active

### Rankings & Lists (Section 6)
- Numbered list with circle badges (1, 2, 3...)
- Two-column layout: Name + Count/Percentage
- Visual separators between list items
- Percentage bars or badges for relative comparison

## Interaction Patterns
- **Loading States**: Skeleton screens for data tables, pulse animation on cards
- **Empty States**: Centered message with upload icon when no file loaded
- **Error States**: Inline validation messages, error banners for file issues
- **Hover Effects**: Subtle bg-gray-50 on interactive elements
- **Transitions**: duration-200 for smooth state changes

## Data Visualization Guidelines
- **Progress Bars**: Show percentage visually with precise number label
- **Status Badges**: Pill-shaped with icons (checkmark for active, x for removed)
- **Count Displays**: Large numbers with context labels
- **Comparison Cards**: Side-by-side layout for category comparisons (USR&ATSM vs PSSM&PSMP)

## Responsive Behavior
- **Desktop-First**: Optimized for desktop viewing (1280px+)
- **Breakpoints**: 
  - Mobile: Stack all cards, full-width tables with horizontal scroll
  - Tablet: 2-column grids
  - Desktop: Full 4-column layouts
- Tables: Horizontal scroll on mobile with sticky first column

## Icons
- **Library**: Heroicons (outline style) via CDN
- **Usage**: Upload, filter, check/x status, chevron for dropdowns, document icons for sheets

## Performance Considerations
- Virtualized tables for large datasets (100+ rows)
- Lazy load non-visible sections
- Debounced filter inputs
- Progressive data loading indicators