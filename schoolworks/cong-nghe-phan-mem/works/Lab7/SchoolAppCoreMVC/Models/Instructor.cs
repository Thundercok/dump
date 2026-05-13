using System;
using System.Collections.Generic;

namespace SchoolAppCoreMVC.Models;

public partial class Instructor
{
    public int InstructorId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public DateOnly HireDate { get; set; }
}
