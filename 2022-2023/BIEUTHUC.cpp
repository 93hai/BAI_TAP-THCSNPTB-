#include<bits/stdc++.h>
using namespace std;

const int N = 500;
int d[N];

int main(){
    string s;
    cin >> s;
    int d;
    d[0] = s[0]-'0';
    int p=0;
    for(int i=1;i<s.size();i+=2){
        char dau = s[i];
        long long sau = s[i+1] - '0';
        if(dau == '+'){
            p++;
            d[p] = sau;
        }else if(dau == '-'){
            p++;
            d[p] = -sau;
        }else if(dau == '*'){
            d[p] = d[p] * sau;
        }
    }
    long long sum=0;
    for(int i=0;i<=p;i++){
        sum += d[i];
    }
    cout << sum << "\n";
    cout << "Time: " << (float)clock()/CLOCKS_PER_SEC << "s" << endl;
    return 0;
}