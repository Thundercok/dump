public class Student {
    private String name;
    private double mathematics;
    private double programming;
    private double dsa1;

    public Student(String name, double mathematics, double programming, double dsa1) {
        this.name = name;
        this.mathematics = mathematics;
        this.programming = programming;
        this.dsa1 = dsa1;
    }

    public double getAvg() {
        return (mathematics + programming + dsa1) / 3.0;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return String.format("%-12s | Math: %.1f | DSA1: %.1f | Avg: %.2f",
                name, mathematics, programming, dsa1, getAvg());
    }
}
