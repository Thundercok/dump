import java.util.Scanner;

class Ex7 {
    public static void main (String[] args){
        Scanner input = new Scanner(System.in);
        char ch = input.next().charAt(0);
        if ((ch >= 'a' && ch <= 'z')||(ch >= 'A' && ch <='Z')||(ch >= '0' && ch <= '9')) {
            System.out.println("That's alphanumeric");
        }       else    {
            System.out.println("That's not alphanumeric");
        }
        input.close();
    }
}