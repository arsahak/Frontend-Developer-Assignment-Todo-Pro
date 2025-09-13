import { useEffect } from "react";
import { Provider } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TodosPage } from "./pages/TodosPage";
import { store } from "./store";
import { useAppDispatch } from "./store/hooks";
import { checkAuth } from "./store/slices/authSlice";

function AppContent() {
  const dispatch = useAppDispatch();

  // PWA registration and update handling
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error: any) {
      console.log("SW registration error", error);
    },
  });

  useEffect(() => {
    // Check if user is authenticated on app load
    dispatch(checkAuth());
  }, [dispatch]);

  // Theme is handled by Redux slice - no need for manual DOM manipulation here

  return (
    <>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/todos" element={<TodosPage />} />
                    <Route
                      path="/"
                      element={<Navigate to="/app/todos" replace />}
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/app/todos" replace />} />
        </Routes>
      </Router>

      {/* PWA Update Notification */}
      {needRefresh && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-center space-x-3">
            <div>
              <h4 className="font-semibold">Update Available</h4>
              <p className="text-sm opacity-90">A new version is available!</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => updateServiceWorker(true)}
                className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
              >
                Update
              </button>
              <button
                onClick={() => setNeedRefresh(false)}
                className="text-white/80 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="dark:bg-gray-800 dark:text-white"
      />
    </Provider>
  );
}

export default App;
