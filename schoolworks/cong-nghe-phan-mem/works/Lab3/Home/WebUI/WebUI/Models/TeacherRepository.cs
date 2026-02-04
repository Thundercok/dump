using DAL.Context;
using DAL.Models;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories
{
    public class StudentRepository
    {
        private readonly SchoolDbContext _context;

        public StudentRepository(SchoolDbContext context)
        {
            _context = context;
        }

        public List<Student> GetAll() => _context.Students.ToList();
        
        public Student GetById(int id) => _context.Students.Find(id);
        
        public void Add(Student student)
        {
            _context.Students.Add(student);
            _context.SaveChanges();
        }
    }
}