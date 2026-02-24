#include<bits/stdc++.h>
using namespace std;

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    freopen("TROCHOI.INP", "r", stdin);
    freopen("TROCHOI.OUT", "w", stdout);

    long long m,n;
    cin >> n >> m;
    cout << (m+1)*n+(n+1)*m;
    return 0;
}