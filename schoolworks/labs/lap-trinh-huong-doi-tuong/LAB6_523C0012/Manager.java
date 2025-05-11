public class Manager extends Employee {
    private String position;
    private double salaryCoefficientPosition;

    public Manager() {
        super();
        this.position = "Head of the Administrative Office";
        this.salaryCoefficientPosition = 5.0;
    }

    public Manager(String ID, String fullName, double coefficientsSalary, String position, double salaryCoefficientPosition) {
        super(ID, fullName, coefficientsSalary);
        this.position = position;
        this.salaryCoefficientPosition = salaryCoefficientPosition;
    }

    // Constructor with full parameters

    @Override
    public String considerEmulation() {
        return "A";
    }

    public double bonusByPosition() {
        double basicSalary = 1150;
        return basicSalary * salaryCoefficientPosition;
    }

    @Override
    public double getSalary() {
        double basicSalary = 1150;
        double emulationCoefficient = 1.0;
        double senioritySalary = getSenioritySalary();
        double positionBonus = bonusByPosition();
        return basicSalary + basicSalary * (coefficientsSalary + emulationCoefficient) + senioritySalary + positionBonus;
    }
}
