#include<bits/stdc++.h>
using namespace std;

const int N = 1000005;
int a[N];

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    freopen("DEMSO.INP", "r", stdin);
    freopen("DEMSO.OUT", "w", stdout);
    int n,dem=0;
    cin >> n;
    for(int i=0;i<n;i++){
        cin >> a[i];
        if(a[i]%3==0 && a[i]%9!=0){
            dem++;
        }
    }
    cout << dem << "\n";
    cout << "Time: " << (float)clock()/CLOCKS_PER_SEC << "s" << endl;
    return 0;
}