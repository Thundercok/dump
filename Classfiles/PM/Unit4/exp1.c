#include <stdio.h>

void circle () {
 	printf("   ***   \n");
	printf(" *     * \n");
	printf(" *     * \n");
	printf("   ***   \n");
 }


void box () {
 	printf(" ******* \n");
	printf(" *     * \n");
    printf(" *     * \n");
	printf(" ******* \n");
 }


void triangle () {
 	printf("    *   \n");
	printf("   * *   \n");
	printf("  *   *  \n");
	printf(" ******* \n");
 }

void legs () {
 	printf("    *   \n");
	printf("   * *   \n");
	printf("  *   *  \n");
	printf(" *     * \n");
 }

void dude() {
    circle();
    box();
    legs();
}

void girl() {
    circle();
    triangle();
    legs();
}

void ship() {
    triangle();
    box();
    legs();
}

int main() {
    dude();
    printf("\n\n");
    girl();
    printf("\n\n");
    ship();
    printf("\n\n");
}
