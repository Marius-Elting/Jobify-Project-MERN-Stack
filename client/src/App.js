import './App.css';
import { Landing, Error, Register, ProtectedRoute } from './pages';
import { AllJobs, Profile, SharedLayout, Stats, AddJob } from './pages/dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'



function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <SharedLayout />
          </ProtectedRoute>
        } >
          <Route index element={<Stats />} />
          <Route path='all-jobs' element={<AllJobs />}></Route>
          <Route path='add-job' element={<AddJob />}></Route>
          <Route path='profile' element={<Profile />}></Route>
        </Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/landing" element={<Landing />}></Route>
        <Route path="*" element={<Error></Error>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
