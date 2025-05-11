import java.util.Scanner;

public class ex3 {
    public static void main(String[] args) {
        
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Input a full name : ");
        String name = sc.nextLine();

        first_last(name);
        middle(name);
        capitalize(name);
        uvlc(name);
        sc.close();
    }
    public static void first_last(String name) {
        String[] split = name.split(" ");

        name = split[0] + " " + split[split.length-1];

        System.out.println("'"+name+"'");

    }
    public static void middle(String name) {
        String[] split = name.split(" ");
        name = "";
        for(int i = 1; i < split.length-1; i++){
            if(i > 1) {
                name = name + " " + split[i];
            } else {
                name = name + split[i];
            }
        }
        System.out.println("'"+name+"'");
    }
    public static void capitalize(String name) {
        String[] split = name.split(" ");
        name = "";
        for(int i = 0; i < split.length; i++) {
            name = name + split[i].substring(0, 1).toUpperCase();
            if(i < split.length - 1) {
                name = name + split[i].substring(1).toLowerCase() + " ";
            } else {
                name = name + split[i].substring(1).toLowerCase();
            }
        }
        System.out.println("'"+name+"'");
    }
    public static void uvlc(String name) {
        StringBuilder result = new StringBuilder();
        for(char c : name.toCharArray()) {
            if(isVowel(c)) {
                result.append(Character.toUpperCase(c));
            } else {
                result.append(Character.toLowerCase(c));
            }
        }
        result.toString();
        System.err.println("'" + result + "'");
    }
    public static boolean isVowel(char c) {
        c = Character.toLowerCase(c);
        return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
    }
}