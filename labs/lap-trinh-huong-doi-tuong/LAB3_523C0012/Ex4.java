public class Ex4 {
    static public void main(String args[]){
        String str1 = "Huynh Nhat Huy 24/12";
        String str2 = "tacocat";
        System.out.print("\n Exercise 1\n");
        System.out.print(stringLength(str1));
        System.out.print("\n Exercise 2\n");
        System.out.print(charFind(str1));
        System.out.print("\n Exercise \n");
        System.out.print(Concatentate(str1,str2));
        System.out.print("\n Exercise 4\n");
        System.out.println(palindromeCheck(str2));

    }

    static public int stringLength(String str){
        int len = str.length();
        return len;
    }

    static public int charFind(String str){
        int count = 0;
        for(int i = 0; i < str.length(); i++){
            if (str.charAt(i) != ' ') {
                count++;
            }  
        }
        return  count;
    }

    static public String Concatentate(String str1, String str2){
        String concatString = str1.concat(str2);
        return concatString;
    }
    
    static public boolean palindromeCheck(String str){
        String rev = "";
        boolean isPalindrome = false;
        for(int i = str.length() - 1; i >=  0; i--){
            rev =  rev + str.charAt(i);
        }
        if (str.equals(rev)) {
            isPalindrome = true;
        }
        return isPalindrome;
    }
}


