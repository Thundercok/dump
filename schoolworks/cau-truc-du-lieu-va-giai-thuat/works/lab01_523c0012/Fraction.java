public class Fraction {
    private int numer = 0;
    private int denom = 1;

    public Fraction() {
        this.numer = 0;
        this.denom = 1;
    }

    public Fraction(int x, int y) {
        this.numer = x;
        this.denom = (y != 0) ? y : 1;
    }

    public Fraction(Fraction f) {
        if (f != null) {
            this.numer = f.numer;
            this.denom = f.denom;
        } else {
            this.numer = 0;
            this.denom = 1;
        }
    }

    @Override
    public String toString() {
        return numer + "/" + denom;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof Fraction) {
            Fraction other = (Fraction) obj;
            return this.numer * other.denom == this.denom * other.numer;
        }
        return false;
    }
}
