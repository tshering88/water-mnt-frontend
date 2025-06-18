import { Routes, Route } from "react-router-dom"

import Login from "../layout/Login"
import UserManagement from "../layout/UserManagement"
import ProtectedRoute from "./ProtectedRoute"
import Dashboard from "../layout/Dashboard"
// import DzongkhagDashboard from "./DzongkhagDashboard"
import Dzongkhag from "../layout/Dzongkhag"
import Gewog from "../layout/Gewog"
import NotFoundPage from "../layout/NotFound"
import ConsumerManagement from "../layout/consumers"


const AppRoute = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/adduser" element={<UserManagement />} />
        <Route path="/alldzongkhag" element={<Dzongkhag />} />
        <Route path="/allgewog" element={<Gewog />} />
        <Route path="/allconsumer" element={<ConsumerManagement />} />




      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoute
