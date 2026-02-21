#include<bits/stdc++.h>
using namespace std;

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    freopen("KIEUMOI.INP", "r", stdin);
    freopen("KIEUMOI.OUT", "w", stdout);

    int n;
    cin >> n;
    for(int i=0;i<n;i++){
        string s,d="";
        cin >> s;
        if(s[0] >= 'A' && s[0] <= 'Z'){
            d = (char)(s[0] + 32);
        }else{
            d = s[0];
        }
        for(int i=1;i<s.size();i++){
            if(s[i] >= 'A' && s[i] <= 'Z'){
                d += '_';
                d += (char)(s[i] + 32);
            }else{
                d += s[i];
            }
        }
        cout << d << "\n";
    }
    cout << "Time: " << (float)clock()/CLOCKS_PER_SEC << "s" << endl;
    return 0;
}
