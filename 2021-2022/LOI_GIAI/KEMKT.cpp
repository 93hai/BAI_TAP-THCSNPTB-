#include<bits/stdc++.h>
using namespace std;

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s;
    int dem=0;
    cin >>s;
    for(int i=0;i<s.size();i++){
        if(s[i]=='A') dem++;
    }
    cout << dem;
    return 0;
}