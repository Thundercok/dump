using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using Xunit;

namespace LoginAutomation
{
    public class LoginTests
    {
        [Fact]
        public void Login_WithValidCredentials_ShouldWork()
        {
            // 1. Open Chrome
            using (IWebDriver driver = new ChromeDriver())
            {
                // 2. GO TO YOUR FILE (Change the path below to your actual path!)
                driver.Navigate().GoToUrl("file:///C:/Users/YourName/Desktop/login.html");

                // 3. Find elements and type
                driver.FindElement(By.Id("username")).SendKeys("admin");
                driver.FindElement(By.Id("password")).SendKeys("password123");

                // 4. Click the button
                driver.FindElement(By.Id("loginButton")).Click();

                // Wait 2 seconds so you can see it happened before it closes
                System.Threading.Thread.Sleep(2000);
            }
        }
    }
}