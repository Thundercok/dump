public class Person {
    private String name;
    private int birthYear;

    public Person(String name, int birthYear) {
        this.name = name;
        this.birthYear = birthYear;
    }

    // Getters and setters

    @Override
    public String toString() {
        return "Person{name='" + name + "', birthYear=" + birthYear + "}";
    }
}

public class Student extends Person {
    private int id;
    private double score;

    public Student(String name, int birthYear, int id, double score) {
        super(name, birthYear);
        this.id = id;
        this.score = score;
    }

    // Getters and setters

    @Override
    public String toString() {
        return "Student{" + super.toString() + ", id=" + id + ", score=" + score + "}";
    }
}

public class Employee extends Person {
    private int id;
    private double salary;

    public Employee(String name, int birthYear, int id, double salary) {
        super(name, birthYear);
        this.id = id;
        this.salary = salary;
    }

    // Getters and setters

    @Override
    public String toString() {
        return "Employee{" + super.toString() + ", id=" + id + ", salary=" + salary + "}";
    }
}

public class PersonModel<T> {
    private ArrayList<T> al = new ArrayList<T>();

    public void add(T obj) {
        al.add(obj);
    }

    public void display() {
        for (T obj : al) {
            System.out.println(obj);
        }
    }

    public static void main(String[] args) {
        // Test cases here
    }
}
