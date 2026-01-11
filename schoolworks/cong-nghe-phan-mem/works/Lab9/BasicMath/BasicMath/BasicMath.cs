namespace BasicMath {
    public class BasicMaths {
        public double Add(double n1, double n2) => n1 + n2;
        public double Divide(double n1, double n2) {
            if (n2 == 0) throw new System.DivideByZeroException();
            return n1 / n2;
        }
    }
}