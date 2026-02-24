#include<bits/stdc++.h>
using namespace std;

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    freopen("BOI.INP", "r", stdin);
    freopen("BOI.OUT", "w", stdout);
    long long P,N,X,dem=0;
    cin >> P >> N;
    X=9;
    for(int i=1;i<=N;i++){
        if(X%P==0){
            dem++;
        }
        X = (X * 10 + 9)%P;
    }
    cout << dem;
    return 0;
}