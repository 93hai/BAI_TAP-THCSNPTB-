#include<bits/stdc++.h>
using namespace std;

const int N = 500;
int d[N];

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    freopen("BIEUTHUC.INP", "r", stdin);
    freopen("BIEUTHUC.OUT", "w", stdout);
    
    string s;
    cin >> s;
    d[0] = s[0];
    long long p = 0;
    for(int i=1;i<s.size();i+=2){
        char dau = s[i];
        int sau = s[i+1] - '0';
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
    long long sum = 0;
    for(int i=0;i<=p;i++){
        sum += d[i];
    }
    cout << sum-'0';
    return 0;
}