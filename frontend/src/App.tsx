import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ReportIssue from './pages/citizen/ReportIssue';
import MyReports from './pages/citizen/MyReports';
import NearbyReports from './pages/citizen/NearbyReports';
import ConfirmReports from './pages/citizen/ConfirmReports';
import ReportDetail from './pages/citizen/ReportDetail';
import ClusterList from './pages/authority/ClusterList';
import ClusterDetail from './pages/authority/ClusterDetail';
import AuthorityMapView from './pages/authority/AuthorityMapView';
import AuthorityUserManagement from './pages/authority/AuthorityUserManagement';
import AuthorityDashboard from './pages/authority/AuthorityDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import InfrastructureTypes from './pages/admin/InfrastructureTypes';
import Jurisdictions from './pages/admin/Jurisdictions';
import Authorities from './pages/admin/Authorities';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import Profile from './pages/citizen/Profile';
import NotificationsPage from './pages/citizen/NotificationsPage';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1e40af', // Deep Blue
            light: '#3b82f6',
            dark: '#1e3a8a',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#10b981', // Soft Green
            light: '#34d399',
            dark: '#059669',
        },
        error: {
            main: '#ef4444', // Soft Red
        },
        warning: {
            main: '#fb923c', // Soft Orange (Accent)
            light: '#fdba74',
            dark: '#f97316',
        },
        success: {
            main: '#10b981', // Soft Green
        },
        info: {
            main: '#3b82f6', // Light Blue
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a',
            secondary: '#64748b',
        },
    },
    shape: {
        borderRadius: 20, // Softer rounded cards
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        h1: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 600, letterSpacing: '-0.02em' },
        h2: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 600, letterSpacing: '-0.02em' },
        h3: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 600, letterSpacing: '-0.01em' },
        h4: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 600, letterSpacing: '-0.01em' },
        h5: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 600 },
        h6: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 600 },
        body1: { fontWeight: 400 },
        body2: { fontWeight: 400 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shadows: [
        'none',
        '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Very light shadow
        '0 2px 4px 0 rgba(0, 0, 0, 0.06)', // Light shadow
        '0 4px 8px 0 rgba(0, 0, 0, 0.08)', // Medium shadow
        '0 8px 16px 0 rgba(0, 0, 0, 0.1)', // Deeper shadow
        ...Array(20).fill('none'), // Placeholder for others
    ] as any,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '12px 24px',
                    borderRadius: 16, // Softer buttons
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: 'none',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                },
                containedSecondary: {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.06)', // Light shadow
                    border: '1px solid #e2e8f0',
                    borderRadius: 20,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20, // Soft rounded cards
                    padding: '24px',
                    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                    borderBottom: '1px solid #e2e8f0',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: '#ffffff',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1e40af',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1e40af',
                        },
                    },
                },
            },
        },
    },
});

const HomeRedirect = () => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const role = user?.role?.toLowerCase();
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'authority') return <Navigate to="/authority/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<Layout />}>
                        <Route path="/" element={<HomeRedirect />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/notifications" element={<NotificationsPage />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>

                        {/* Citizen Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
                            <Route path="/dashboard" element={<CitizenDashboard />} />
                            <Route path="/report" element={<ReportIssue />} />
                            <Route path="/report/:id" element={<ReportDetail />} />
                            <Route path="/my-reports" element={<MyReports />} />
                            <Route path="/nearby" element={<NearbyReports />} />
                            <Route path="/confirm" element={<ConfirmReports />} />
                        </Route>

                        {/* Authority & Admin Shared Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['authority', 'admin']} />}>
                            <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
                            <Route path="/authority/clusters" element={<ClusterList />} />
                            <Route path="/authority/assigned" element={<ClusterList />} />
                            <Route path="/authority/in-progress" element={<ClusterList />} />
                            <Route path="/authority/resolved" element={<ClusterList />} />
                            <Route path="/authority/analytics" element={<AuthorityDashboard />} />
                            <Route path="/authority/clusters/:id" element={<ClusterDetail />} />
                            <Route path="/authority/map" element={<AuthorityMapView />} />
                            <Route path="/authority/users" element={<AuthorityUserManagement />} />
                        </Route>

                        {/* Admin Specific Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/infra-types" element={<InfrastructureTypes />} />
                            <Route path="/admin/jurisdictions" element={<Jurisdictions />} />
                            <Route path="/admin/agencies" element={<Authorities />} />
                            <Route path="/admin/routing" element={<AdminDashboard />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
