using System.Collections.Generic;
using System.Linq;
using DAL.Models;
using DAL.Context; // <--- This is the magic line that fixes the error!

namespace DAL.Repositories 
{
    public class TeacherRepository 
    {
        private readonly SchoolDbContext _context;

        public TeacherRepository(SchoolDbContext context) 
        {
            _context = context;
        }

        public List<Teacher> GetAll() => _context.Teachers.ToList();
        
        public Teacher GetById(int id) => _context.Teachers.Find(id);
        
        public void Add(Teacher teacher)
        {
            _context.Teachers.Add(teacher);
            _context.SaveChanges();
        }
    }
}