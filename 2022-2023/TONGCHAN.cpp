#include<bits/stdc++.h>
using namespace std;

const int N = 100005;
int a[N];

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    freopen("TONGCHAN.INP", "r", stdin);
    freopen("TONGCHAN.OUT", "w", stdout);
    
    long long n,chan=0,le=0;
    cin >> n;
    for(int i=0;i<n;i++){
        cin >> a[i];
        if(a[i]%2==0) chan++;
        if(a[i]%2==1) le++;
    }
    int kq = min(chan,le);
    cout << kq << "\n";
    cout << "Time: " << (float)clock()/CLOCKS_PER_SEC << "s" << endl;
    return 0;
}