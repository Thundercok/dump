import java.util.Arrays;
import java.util.Comparator;

class StudentComparatorA implements Comparator<Student> {
    @Override
    public int compare(Student s1, Student s2) {
        double diff = s1.getAvg() - s2.getAvg();
        if (diff > 0)
            return 1;
        if (diff < 0)
            return -1;
        return 0;
    }
}

class StudentComparatorD implements Comparator<Student> {
    @Override
    public int compare(Student s1, Student s2) {
        double diff = s2.getAvg() - s1.getAvg();
        if (diff > 0)
            return 1;
        if (diff < 0)
            return -1;
        return 0;
    }
}

public class StudentSort {
    public static void printStudents(Student[] arr) {
        for (Student s : arr)
            System.out.println(s);
        System.out.println();
    }

    public static void main(String[] args) {
        Student[] students = {
                new Student("Huynh", 9, 2, 5),
                new Student("Nhat", 2, 5, 8),
                new Student("Huy", 8, 9, 10),
                new Student("Do", 1, 1, 1),
                new Student("Mixi", 11, 11, 11),
                new Student("Tungtung", 2, 4, 1),
                new Student("Sahur", 10, 10, 10)
        };

        System.out.println("Og List: ");
        printStudents(students);

        // asc
        Arrays.sort(students, new StudentComparatorA());
        System.out.println("Sort Asc: ");
        printStudents(students);

        // dsr
        Arrays.sort(students, new StudentComparatorD());
        System.out.println("Sort Dst: ");
        printStudents(students);
    }
}
