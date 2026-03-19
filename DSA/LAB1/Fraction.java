public class Fraction {
    private int numer = 0;
    private int demon = 1;

    public Fraction() {
        this.numer = 0;
        this.demon = 1;
    }

    public Fraction(int numer, int demon) {
        this.numer = numer;
        this.demon = (demon != 0) ? demon : 1;
    }

    @Override
    public String toString() {
        return numer + "/" + demon;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Fraction other = (Fraction) obj;
        return this.numer * other.demon == this.demon * other.numer;
    }
}
