import LandingPage from './components/LandingPage';
import GetStartedPage from './components/GetStartedPage';
import AllocationPage from './components/AllocationPage';
import MaintenancePage from './components/MaintenancePage';
import RepairPage from './components/RepairPage';
import DisposalPage from './components/DisposalPage';
const AppRoutes = [
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: '/get-started',
        element: <GetStartedPage />
    },
    {
        path: '/allocation',
        element: <AllocationPage /> // Add your AllocationPage component
    },
    {
        path: '/maintenance',
        element: <MaintenancePage /> // Add your MaintenancePage component
    },
    {
        path: '/repair',
        element: <RepairPage /> // Add your RepairPage component
    },
    {
        path: '/disposal',
        element: <DisposalPage /> // Add your DisposalPage component
    }
    // Add other routes as needed
];

export default AppRoutes;
