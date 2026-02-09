namespace schedule_management
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            label1.Text = "";
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (label1.Text == "")
            {
                label1.Text = "Hello World";
            } else
            {
                label1.Text = "";
            }
        }
    }
}
