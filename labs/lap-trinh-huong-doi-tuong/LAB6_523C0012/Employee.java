public class Employee {
    protected String ID;
    protected String fullName;
    protected int yearJoined;
    protected double coefficientsSalary;
    protected int numDaysOff;

    public Employee() {
        this.ID = "0";
        this.fullName = "";
        this.yearJoined = 2020;
        this.coefficientsSalary = 1.0;
        this.numDaysOff = 0;
    }

    public Employee(String ID, String fullName, double coefficientsSalary) {
        this.ID = ID;
        this.fullName = fullName;
        this.yearJoined = 2020;
        this.coefficientsSalary = coefficientsSalary;
        this.numDaysOff = 0;
    }

    // Constructor with full parameters

    public double getSenioritySalary() {
        int yearsOfWork = 2024 - yearJoined;
        if (yearsOfWork >= 5) {
            return yearsOfWork * 1150 / 100;
        }
        return 0.0;
    }

    public String considerEmulation() {
        if (numDaysOff <= 1) {
            return "A";
        } else if (numDaysOff <= 3) {
            return "B";
        } else {
            return "C";
        }
    }

    public double getSalary() {
        double basicSalary = 1150;
        double emulationCoefficient = 0.0;
        double senioritySalary = getSenioritySalary();
        String grade = considerEmulation();
        if (grade.equals("A")) {
            emulationCoefficient = 1.0;
        } else if (grade.equals("B")) {
            emulationCoefficient = 0.75;
        } else if (grade.equals("C")) {
            emulationCoefficient = 0.5;
        }
        return basicSalary + basicSalary * (coefficientsSalary + emulationCoefficient) + senioritySalary;
    }
}
