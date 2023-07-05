
import Dashboard from "views/AdminDashboard.js";
import QuestionList from "views/ListQuestions.js";
import ProgramsList from "views/ListAssessment.js";
import StudentsList from "views/ListStudents.js";

var Adminroutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/questionlist",
    name: "Question List",
    icon: "nc-icon nc-tile-56",
    component: QuestionList,
    layout: "/admin"
  },
  {
    path: "/studentslist",
    name: "Students List",
    icon: "nc-icon nc-tile-56",
    component: StudentsList,
    layout: "/admin"
  },
  {
    path: "/assessmentlist",
    name: "Programs List",
    icon: "nc-icon nc-tile-56",
    component: ProgramsList,
    layout: "/admin"
  }
];
export default Adminroutes;
