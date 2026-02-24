#include<bits/stdc++.h>
using namespace std;

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    freopen("TAMGIAC.INP", "r", stdin);
    freopen("TAMGIAC.OUT", "w", stdout);
    long long a,b;
    cin >> a >> b;
    long long lon = a+b;
    long long sum = (max(a,b)-min(a,b)) +1;
    cout << lon - sum;
    return 0;
}