public class Fraction {

    private int numerator;
    private int denominator;

    public Fraction() {
        this.numerator = 0;
        this.denominator = 1;
    }

    public Fraction(int numerator, int denominator) {
        if (denominator == 0) {
            System.out.println("Error: Denominator cannot be zero.");
            numerator = 0;
            denominator = 1;
        } else {
            this.numerator = numerator;
            this.denominator = denominator;
        }
    }

    public Fraction add(Fraction f) {
        int lcm = calculateLCM(this.denominator, f.denominator);
        int newNumerator = (lcm / this.denominator) * this.numerator + (lcm / f.denominator) * f.numerator;
        return new Fraction(newNumerator, lcm);
    }

    public Fraction sub(Fraction f) {
        return add(new Fraction(-f.numerator, f.denominator));
    }

    public Fraction mul(Fraction f) {
        int newNumerator = this.numerator * f.numerator;
        int newDenominator = this.denominator * f.denominator;
        return new Fraction(newNumerator, newDenominator);
    }

    public Fraction div(Fraction f) {
        if (f.numerator == 0) {
            System.out.println("Error: Division by zero.");
            return new Fraction(0, 1);
        }
        return mul(new Fraction(f.denominator, f.numerator)); // Flip and multiply
    }

    // Helper method to find Least Common Multiple (LCM)
    private int calculateLCM(int a, int b) {
        return (a * b) / gcd(a, b);
    }

    // Helper method to find Greatest Common Divisor (GCD)
    private int gcd(int a, int b) {
        if (b == 0) {
            return a;
        }
        return gcd(b, a % b);
    }
    @Override
    public String toString() {
        return numerator + "/" + denominator;
    }
}
