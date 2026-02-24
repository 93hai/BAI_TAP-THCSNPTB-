#include<bits/stdc++.h>
using namespace std;

const int N = 100005;
int a[N];

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    freopen("TONGCHAN.INP", "r", stdin);
    freopen("TONGCHAN.OUT", "w", stdout);

    int n,le=0,chan=0;
    cin >> n;
    for(int i=0;i<n;i++){
        cin >> a[i];
        if(a[i]%2==0){
            chan++;
        }
        if(a[i]%2==1){
            le++;
        }
    }
    int sum = min(le,chan);
    cout << sum;
    return 0;
}
//xong