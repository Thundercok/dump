class Student {
    String name;
    String address;
    char sex;
    int score;

    // Constructor
    public Student(String name, String address, char sex, int score) {
        this.name = name;
        this.address = address;
        this.sex = sex;
        this.score = score;
    }

    // Nested class StudentOperator
    class StudentOperator {
        void print() {
            System.out.println("Student [" + name + ", " + address + ", " + sex + ", " + score + "]");
        }

        String type() {
            if (score > 8)
                return "A";
            else if (score >= 5)
                return "B";
            else
                return "C";
        }
    }

    public static void main(String[] args) {
        Student student = new Student("Huy", "D1 Landmark18", 'M', 8);
        StudentOperator operator = student.new StudentOperator();
        operator.print();
        System.out.println("Type: " + operator.type());
    }
}
