using Microsoft.AspNetCore.Mvc;
using BLL.Services;
using DAL.Models;

namespace WebUI.Controllers
{
    public class StudentController : Controller
    {
        private readonly StudentService _studentService;

        public StudentController(StudentService studentService)
        {
            _studentService = studentService;
        }

        // GET: /Student/
        public IActionResult Index()
        {
            var students = _studentService.GetAllStudents();
            return View(students);
        }

        // GET: /Student/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: /Student/Create
        [HttpPost]
        public IActionResult Create(Student student)
        {
            if (ModelState.IsValid)
            {
                _studentService.AddNewStudent(student);
                return RedirectToAction(nameof(Index));
            }
            return View(student);
        }
    }
}