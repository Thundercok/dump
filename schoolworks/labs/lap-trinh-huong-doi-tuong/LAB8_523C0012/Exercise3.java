import java.util.ArrayList;

abstract class Student {
    protected String sName;
    protected double gpa;

    public Student(String sName, double gpa) {
        this.sName = sName;
        this.gpa = gpa;
    }

    public abstract String getRank();
}

class ITStudent extends Student {
    private int sID;

    public ITStudent(String sName, double gpa, int sID) {
        super(sName, gpa);
        this.sID = sID;
    }

    @Override
    public String getRank() {
        if (gpa <= 5) {
            return "C";
        } else if (gpa <= 8) {
            return "B";
        } else {
            return "A";
        }
    }
}

class MathStudent extends Student {
    private String sID;

    public MathStudent(String sName, double gpa, String sID) {
        super(sName, gpa);
        this.sID = sID;
    }

    @Override
    public String getRank() {
        return (gpa >= 5) ? "Passed" : "Failed";
    }
}

public class Exercise3 {
    public static ArrayList<Student> findStudent(ArrayList<Student> lstStu) {
        ArrayList<Student> result = new ArrayList<>();
        for (Student stu : lstStu) {
            if (stu.getRank().equals("A") || stu.getRank().equals("Passed")) {
                result.add(stu);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        ArrayList<Student> students = new ArrayList<>();
        students.add(new ITStudent("John", 7.5, 123));
        students.add(new MathStudent("Alice", 4.8, "M456"));
        students.add(new ITStudent("Bob", 9.2, 456));
        students.add(new MathStudent("Eve", 6.2, "M789"));

        ArrayList<Student> passedStudents = findStudent(students);
        System.out.println("Students with rank A or Passed:");
        for (Student stu : passedStudents) {
            System.out.println(stu.sName + " - " + stu.getRank());
        }
    }
}
