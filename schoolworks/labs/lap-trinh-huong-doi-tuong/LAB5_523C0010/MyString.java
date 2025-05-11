import java.util.Scanner;

public class MyString {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine();
        sc.close();

        System.out.printf("shortName: %s\n", shortName(str));
        System.out.printf("hashtagName: %s\n", hashtagName(str));
        System.out.printf("upperCaseAllVowel: %s\n", upperCaseAllVowel(str));
        System.out.printf("upperCaseAllN: %s\n", upperCaseAllN(str));
    }

    public static String shortName(String str){
        String[] name = str.split(" ");
        return name[name.length - 1] + " " + name[0];
    }

    public static String hashtagName(String str){
        String[] name = str.split(" ");
        return "#" + name[name.length - 1] + name[0];
    }

    public static String upperCaseAllN(String str){
        StringBuilder res = new StringBuilder();
        for (int c : str.toCharArray()){
            if (c == 'n'){
                c = Character.toUpperCase(c); 
            }
            res.append(c);
        }
        return res.toString();
    }

    public static String upperCaseAllVowel(String str) {
        StringBuilder res = new StringBuilder();

        for(int c : str.toCharArray()) {
            if(Character.isLetter(c)) {
                if("ueoaiUEOAI".contains(String.valueOf(c))) {
                    res.append(Character.toUpperCase(c));
                } else {
                    res.append(c);
                }
            } else {
                res.append(c);
            }
        }
        return res.toString();
    }
}