public class ex5 {

    public static void main(String[] args) {
        String str = "Whales are a widely distributed and diverse group of fully aquatic placental marine mammals. As an informal and colloquial grouping, they correspond to large members of the infraorder Cetacea, i.e. all cetaceans apart from dolphins and porpoises. Dolphins and porpoises may be considered whales from a formal, cladistic perspective. Whales, dolphins and porpoises belong to the order Cetartiodactyla, which consists of even-toed ungulates. Their closest non-cetacean living relatives are the hippopotamuses, from which they and other cetaceans diverged about 54 million years ago. The two parvorders of whales, baleen whales (Mysticeti) and toothed whales (Odontoceti), are thought to have had their last common ancestor around 34 million years ago. Mysticetes include four extant (living) families: Balaenopteridae (the rorquals), Balaenidae (right whales), Cetotheriidae (the pygmy right whale), and Eschrichtiidae (the grey whale). Odontocetes include the Monodontidae (belugas and narwhals), Physeteridae (the sperm whale), Kogiidae (the dwarf and pygmy sperm whale), and Ziphiidae (the beaked whales), as well as the six families of dolphins and porpoises which are not considered whales in the informal sense.";
        System.out.println(str);
        for (int i = 0; i < str.length(); i++) {
            if (!Character.isLetter(str.charAt(i)) && str.charAt(i) != ' ') {
                String b = "";
                b += str.charAt(i);
                str = str.replace(b, "");
                i--;
            }
        }

        String[] c = str.split(" ");
        String[][] d = new String[c.length + 1][2];
        int count = 1;
        d[0][0] = c[0];
        d[0][1] = "1";
        boolean unique;
        for (int i = 1; i < c.length; i++) {
            unique = true;
            for (int j = 0; j < count; j++) {
                if (c[i].equalsIgnoreCase(d[j][0])) {
                    d[j][1] = String.valueOf(Integer.parseInt(d[j][1]) + 1);
                    unique = false;
                    break;
                }
            }
            if (unique) {
                d[count][0] = c[i];
                d[count][1] = "1";
                count++;
            }

        }
        for (int i = 0; d[i][0] != null; i++) {
            System.out.printf("'%s' : %s", d[i][0], d[i][1]);
            if (d[i + 1][0] != null) {
                System.out.println(",");
            }
        }
    }

}