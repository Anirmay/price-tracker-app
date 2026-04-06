# Frontend - Price Tracker UI

## Overview

Next.js React application for the Price Tracker frontend. Provides user interface for tracking prices, managing alerts, and receiving notifications.

## Features

- User authentication (login/register)
- Add products by URL
- View all tracked products
- Set and manage price alerts
- View notifications
- User profile management
- Responsive design
- Real-time updates (polling)

## Installation

```bash
npm install
```

## Environment Setup

Create `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running

**Development**:
```bash
npm run dev
```

**Production Build**:
```bash
npm run build
npm start
```

Application runs on `http://localhost:3000`

## Project Structure

### Pages
- `index.js` - Home page with features overview
- `login.js` - User login
- `register.js` - User registration
- `dashboard.js` - Main dashboard with products
- `profile.js` - User profile and preferences
- `_app.js` - App wrapper with global setup

### Components
- `Header.js` - Navigation header
- `ProductCard.js` - Product display card
- `AlertModal.js` - Alert creation modal

### Services
- `api.js` - API client with axios

### Hooks
- `store.js` - Zustand state management
- `useLocalStorage.js` - Local storage hook

### Styles
- `globals.css` - Global styles
- `Home.module.css` - Home page styles
- `Auth.module.css` - Login/Register styles
- `Dashboard.module.css` - Dashboard styles
- `Header.module.css` - Header styles
- `ProductCard.module.css` - Product card styles
- `AlertModal.module.css` - Modal styles

## Technology Stack

- **Next.js**: React framework for production
- **React**: UI library
- **Zustand**: Lightweight state management
- **Axios**: HTTP client
- **CSS Modules**: Component scoped styling
- **date-fns**: Date formatting

## Key Components

### Header
Navigation component with logo, user menu, and logout

### ProductCard
Displays product information:
- Product image
- Current price
- Price savings
- Stock status
- Last updated time
- Action buttons

### AlertModal
Modal form for creating price alerts:
- Alert type selection
- Target price input
- Percentage drop input
- Form submission

## State Management (Zustand)

### Auth Store
- `user` - Current user data
- `token` - JWT token
- `setUser()` - Update user
- `logout()` - Clear auth

### Product Store
- `products` - All tracked products
- `addProduct()` - Add to list
- `removeProduct()` - Delete from list
- `updateProduct()` - Update product

### Alert Store
- `alerts` - All alerts
- `addAlert()` - Add new alert
- `removeAlert()` - Delete alert
- `updateAlert()` - Update alert

## API Integration

### User Flow
1. Register → Get JWT token → Store locally
2. Login → Get JWT token → Store locally
3. Add token to all requests via axios interceptor

### Product Flow
1. User pastes URL
2. Submit to backend
3. Backend scrapes product details
4. Return product to frontend
5. Display in dashboard

### Alert Flow
1. User sets alert conditions
2. Submit to backend
3. Backend monitors price
4. Trigger alerts when conditions met
5. Send notifications to user

## Styling

- Responsive grid layout
- Mobile-first approach
- CSS Modules for component isolation
- Gradient backgrounds
- Smooth transitions
- Modern card-based design

## Performance

- Image lazy loading
- Component code splitting
- Efficient re-renders with Zustand
- Local storage for persistence
- Axios request/response interceptors

## Security

- JWT token in localStorage
- Protected routes (redirect to login)
- API token in request headers
- Secure password input fields
- CORS handling

## Forms

- Input validation
- Error messages
- Loading states
- Success feedback
- Auto-clear on submit

## Responsive Design

- Mobile: Single column layout
- Tablet: 2 column layout
- Desktop: 3+ column layout
- Breakpoints at 768px, 1024px

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# ESLint
npm run lint
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Fetching Data

All API calls use the centralized `api.js` service:

```javascript
import { productService } from '@/services/api';

const response = await productService.getProducts();
```

## Error Handling

- Try-catch blocks for API calls
- User-friendly error messages
- Error display in UI
- Console logging for debugging

## Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] Price charts with Chart.js
- [ ] Dark mode
- [ ] PWA capabilities
- [ ] Offline support
- [ ] Email notifications status
- [ ] Product sharing
- [ ] Advanced filters
- [ ] Search functionality
- [ ] Mobile app

## Deployment

See main README.md for Vercel deployment instructions

## Troubleshooting

### API Not Responding
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running on correct port
- Check CORS configuration on backend

### Token Issues
- Clear browser localStorage
- Re-login to get new token
- Check JWT expiry in backend

### Styling Issues
- Clear `.next` folder
- Rebuild with `npm run build`
- Check CSS Modules configuration

## Code Style

- ESLint configuration included
- Consistent naming conventions
- Component-based architecture
- Separation of concerns

## Contributing

1. Follow existing code structure
2. Use CSS Modules for styling
3. Add comments for complex logic
4. Test on mobile devices
5. Update documentation

## License

MIT
