import java.util.Scanner;

public class MyString2{

    public static int countWord(String paragraph){
        String[] sitring = paragraph.split(" ");
        return sitring.length;
    }

    public static int countSentences(String paragraph){

        char[] nguyenminhduc = paragraph.toCharArray();
        int count = 0;
        for (int i = 0; i < nguyenminhduc.length; i++){
            if (nguyenminhduc[i] == '.')
                count += 1;
        }
        return count;
    }

    public static int countAppear(String paragraph, String word){

        int count = 0;
        String[] sitring = paragraph.split(" ");
        for (int i = 0; i < sitring.length; i++)
            if (sitring[i].compareTo(word) == 0)
                count += 1;
        return count;
        }

    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        String string = "The Edge Surf is of course also a whole lot better, which will hopefully win Microsoft someconverts. It offers time trial, support for other input methods like touch and gamepads, accessibility improvements, high scores, and remastered visuals.";
        string = string.toLowerCase();

        string.replace(",", "");
        System.out.printf("Word count: %d\n", countWord(string));
        System.out.printf("Sentences count: %d\n", countSentences(string));

        System.out.print("Input word to count appear: ");
        String word = sc.nextLine();
        word = word.toLowerCase();
        sc.close();
        System.out.printf("Word Appear: %d", countAppear(string, word));
    }
}