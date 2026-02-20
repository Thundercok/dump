public class Ex1 {
    public static boolean removeElement(int[] arr, int element){
        int foundIndex = -1;

        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == element){
                foundIndex = i;
                break;
            }
        }
        if (foundIndex == 1) {
            return false;
        }
        for (int i = foundIndex; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr[arr.length - 1] = 0;
        return true;
    }

    public static  void insertElement(int[] arr, int element, int position){
        if (position < arr.length) { 
        for(int i = arr.length - 1; i > position; i--){
            arr[i] = arr[i - 1];
        }
        arr[position] = element;
        arr[arr.length - 1] = arr[position - 1];
        }   else {
            arr[arr.length - 1] = element;
        }
    }
    public static int[] duplicateFind(int[] arr){
        int[] unique = new int[arr.length];
        int[] duplicates = new int[arr.length];

        int uniqueCount = 0;
        int duplicateCount = 0;
        for(int i = 0; i < arr.length; i++) {
            boolean found = false;
            for (int j =0; j < uniqueCount; j++) {
                if(arr[i] == unique[j]){
                    found = true;
                    break;
                }
            }
            if(!found) {
                unique[uniqueCount++] = arr[i];
            }   else    {
                boolean added = false;
                for ( int j = 0 ; j < duplicateCount; j++){
                    if (arr[i] == duplicates[j]) {
                        added = true;
                        break;
                    }
                }
                if(!added) {
                    duplicates[duplicateCount++] = arr[i]; 
                }
            }
        }
        int[] actualDuplicates = new int[duplicateCount];
        System.arraycopy(duplicates, 0, actualDuplicates, 0, duplicateCount);
        return actualDuplicates;
    }
    public static void removeDuplicates(int[] arr) {
        
        int uniqueIndex = 0;
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] != arr[uniqueIndex]) {
                uniqueIndex++;
                arr[uniqueIndex] = arr[i];
            }
        }

    }
    
    public static void main(String[] args){
        int arr[] = {1, 2, 3, 4, 5};
        int arrWDups[] = {1, 2, 1, 4, 6, 5};
        int key = 3;
        int pos = 2;
        System.out.print("E 1.1\n");
        System.out.print(removeElement(arr.clone(),  key));
        System.out.print("\nE 1.2\n");
        int[] arrCloned = arr.clone();
        insertElement(arrCloned, key, pos);
        for(int i = 0; i< arrCloned.length; i++){
            System.out.print(arrCloned[i] + " ");
        }
        System.out.print("\nE 1.3\n");
        int arr2[] =  duplicateFind(arrWDups);
        for(int i = 0; i < arr2.length; i++){
            System.out.print(arr2[i] + " ");
        }
        System.out.print("\nE 1.4\n");
        removeDuplicates(arrWDups);
        for(int i = 0; i < arrWDups.length; i++){
            System.out.print(arrWDups[i] + " ");
        }
    }
}