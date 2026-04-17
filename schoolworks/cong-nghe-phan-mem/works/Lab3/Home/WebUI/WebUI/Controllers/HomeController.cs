using Microsoft.AspNetCore.Mvc;
using BLL.Services; // Add this using statement!

namespace WebUI.Controllers
{
    public class HomeController : Controller
    {
        private readonly StudentService _studentService;

        // Inject the service into the constructor
        public HomeController(StudentService studentService)
        {
            _studentService = studentService;
        }

        public IActionResult Index()
        {
            // 1. Get the data from the database
            var students = _studentService.GetAllStudents();
            
            // 2. Pass the data into the View!
            return View(students); 
        }
        
        // ... (keep your other methods like Error() down here)
    }
}