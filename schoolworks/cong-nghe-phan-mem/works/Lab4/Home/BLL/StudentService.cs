using System.Collections.Generic;
using DAL;

namespace BLL;

public class StudentService
{
    private readonly StudentRepository _repository;

    public StudentService()
    {
        _repository = new StudentRepository();
    }

    public void AddStudent(Student student)
    {
        _repository.AddStudent(student);
    }

    public Student GetStudent(int id)
    {
        return _repository.GetStudentById(id);
    }

    public List<Student> GetAllStudents()
    {
        return _repository.GetAllStudents();
    }

    public void UpdateStudent(Student student)
    {
        _repository.UpdateStudent(student);
    }

    public void DeleteStudent(int id)
    {
        _repository.DeleteStudent(id);
    }
}