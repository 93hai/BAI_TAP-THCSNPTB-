#include<bits/stdc++.h>
using namespace std;

int le(long long n){
    int d,sum=0;
    while(n>0){
        d = n % 10;
        sum += d;
        n /= 10;
    }
    return sum;
}

long long check(long long x){
    long long res = x / 2;
    if(x % 2==0){
        if(le(x) % 2!=0){
            res++;
        }
    }else{
        res = (x + 1)/2;
    }
    return res;
}

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    freopen("SOLE.INP", "r", stdin);
    freopen("SOLE.OUT", "w", stdout);
    int a,b;
    cin >> a >> b;
    cout << check(b) - check(a-1) << "\n";
    cout << "Time: " << (float)clock()/CLOCKS_PER_SEC << "s" << endl;
    return 0;
}