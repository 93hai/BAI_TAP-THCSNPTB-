#include<bits/stdc++.h>
using namespace std;

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    freopen("KHUYENMAI.INP", "r", stdin);
    freopen("KHUYENMAI.OUT", "w", stdout);
    long long a,b,c,n;
    cin >> a >> b >> c >> n;
    long long sum = n / (a+b);
    long long tong = n % (a+b);
    sum = sum * (c*a);
    if(tong>0){
        tong = tong * c;
    }
    cout << sum + tong;
    return 0;
}
// xongs