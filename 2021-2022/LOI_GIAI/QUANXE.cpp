#include<bits/stdc++.h>
using namespace std;

const int N = 100005;
int c[N];

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    freopen("QUANXE.INP", "r", stdin);
    freopen("QUANXE.OUT", "w", stdout);

    int n,x,y;
    cin >> n;
    for(int i=0;i<n;i++){
        int a,b;
        cin >> a >> b;
        x = b;
        y = n - a + 1;
        c[x] = y;
    }
    for(int i=1;i<=n;i++){
        cout << i << " " << c[i] << "\n";
    }
    cout << "Time: " << (float)clock()/CLOCKS_PER_SEC << "s" << endl;
    return 0;
}
