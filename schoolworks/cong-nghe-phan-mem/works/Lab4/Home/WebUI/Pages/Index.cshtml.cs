using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using BLL;
using DAL;
using System.Collections.Generic;

namespace WebUI.Pages;

public class IndexModel : PageModel
{
    private readonly StudentService _studentService = new StudentService();

    [BindProperty] public int InputId { get; set; }
    [BindProperty] public string InputName { get; set; }
    [BindProperty] public string InputEmail { get; set; }
    [BindProperty] public string InputMajor { get; set; }

    public List<Student> StudentsList { get; set; } = new List<Student>();

    public void OnGet()
    {
        BindGrid();
    }

    private void BindGrid()
    {
        StudentsList = _studentService.GetAllStudents();
    }

    public void OnPostAdd()
    {
        var student = new Student { Name = InputName, Email = InputEmail, Major = InputMajor };
        _studentService.AddStudent(student);
        BindGrid();
    }

    public void OnPostGet()
    {
        var student = _studentService.GetStudent(InputId);
        if (student != null)
        {
            InputName = student.Name;
            InputEmail = student.Email;
            InputMajor = student.Major;
        }
        BindGrid();
    }

    public void OnPostUpdate()
    {
        var student = new Student { Id = InputId, Name = InputName, Email = InputEmail, Major = InputMajor };
        _studentService.UpdateStudent(student);
        BindGrid();
    }

    public void OnPostDelete()
    {
        _studentService.DeleteStudent(InputId);
        BindGrid();
    }
}