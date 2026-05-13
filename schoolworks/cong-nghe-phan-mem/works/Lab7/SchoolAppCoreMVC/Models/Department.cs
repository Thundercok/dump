using System;
using System.Collections.Generic;

namespace SchoolAppCoreMVC.Models;

public partial class Department
{
    public int DepartmentId { get; set; }

    public string Name { get; set; } = null!;

    public double Budget { get; set; }

    public DateOnly StartDate { get; set; }

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();
}
