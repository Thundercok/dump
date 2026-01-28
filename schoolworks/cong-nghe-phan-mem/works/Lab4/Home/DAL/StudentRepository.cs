using System.Collections.Generic;
using System.Linq;

namespace DAL;

public class StudentRepository
{
    private readonly SchoolDbContext _context;

    public StudentRepository()
    {
        _context = new SchoolDbContext();
        _context.Database.EnsureCreated(); // Creates the DB automatically on Mac
    }

    public void AddStudent(Student student)
    {
        _context.Students.Add(student);
        _context.SaveChanges();
    }

    public Student GetStudentById(int id)
    {
        return _context.Students.FirstOrDefault(s => s.Id == id);
    }

    public List<Student> GetAllStudents()
    {
        return _context.Students.ToList();
    }

    public void UpdateStudent(Student student)
    {
        var existing = _context.Students.FirstOrDefault(s => s.Id == student.Id);
        if (existing != null)
        {
            existing.Name = student.Name;
            existing.Email = student.Email;
            existing.Major = student.Major;
            _context.SaveChanges();
        }
    }

    public void DeleteStudent(int id)
    {
        var student = _context.Students.FirstOrDefault(s => s.Id == id);
        if (student != null)
        {
            _context.Students.Remove(student);
            _context.SaveChanges();
        }
    }
}