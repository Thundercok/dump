public class Student{
    int ID;
    String firstName;
    String lastName;
    private Object name;

    public Student(int ID, String firstName, String lastName) {
        this.ID = ID;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    public int getID(){
        return ID;
    }
    public String getLastName() {
        return lastName;
    }
    public void setID(){
        this.ID = ID;
    }
    public void setFirstName(){
        this.firstName = firstName;
    }
    public void setLastName() { 
        this.lastName = lastName;
    }
    public String getName() {
        String name = firstName.concat(" " + lastName);
        return name;
    }
    public void setName(){
        this.name = name;
    }
    public String toString() {
        return "Student[ID: "+ ID + " firstName: "+ firstName + " lastName: "+ lastName + " name: " + name + "]";
    }
    public static void main(String args[]){
        Student JohnDoe = new Student(6, "John", "Doe");
        System.out.print(JohnDoe);
    }
}