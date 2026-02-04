using DAL.Models;
using DAL.Repositories;
using System.Collections.Generic;

namespace BLL.Services
{
    public class StudentService
    {
        private readonly StudentRepository _repository;

        public StudentService(StudentRepository repository)
        {
            _repository = repository;
        }

        public List<Student> GetAllStudents()
        {
            return _repository.GetAll();
        }

        public void AddNewStudent(Student student)
        {
            // Example Business Logic: Prevent empty names
            if (string.IsNullOrWhiteSpace(student.FullName))
            {
                throw new System.Exception("Student name cannot be empty.");
            }
            
            _repository.Add(student);
        }
    }
}