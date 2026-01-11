using Xunit;
using BasicMath;

namespace BasicMathTests {
    public class BasicMathsTests {
        [Theory]
        [InlineData(10, 5, 15)]
        [InlineData(-1, -1, -2)]
        public void Test_Add(double a, double b, double expected) {
            var bm = new BasicMaths();
            Assert.Equal(expected, bm.Add(a, b));
        }
    }
}