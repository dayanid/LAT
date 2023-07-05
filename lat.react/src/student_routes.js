
import Dashboard from "views/StudentDashboard";
import TryOut from "views/TryOut.js";
import Assessment from "views/Assessment.js";
import UserPage from "views/User.js";
import Credits from "views/Credits.js";
import ChangePassword from "views/changepassword";

var Studentroutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-trophy",
    component: Dashboard,
    layout: "/student"
  },{
    path: "/tryout",
    name: "TryOut",
    icon: "nc-icon nc-spaceship",
    component: TryOut,
    layout: "/student"
  },{
    path: "/assessment",
    name: "Assessment",
    icon: "nc-icon nc-single-copy-04",
    component: Assessment,
    layout: "/student"
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: UserPage,
    layout: "/student"
  },
  {
    path: "/credits",
    name: "Credits",
    icon: "nc-icon nc-satisfied",
    component: Credits,
    layout: "/student"
  },
  { path: "/change-password",
    name: "Change password",
    icon: "nc-icon nc-touch-id",
    component: ChangePassword,
    layout: "/student"
}
];
export default Studentroutes;
