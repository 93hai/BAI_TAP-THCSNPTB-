#include<bits/stdc++.h>
using namespace std;

bool ngto(long long n){
    if(n < 2) return false;
    for(int i=2;i<=sqrt(n);i++){
        if(n%i==0) return false;
    }
    return true;
}

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long a;
    cin >> a;
    int i=1;
    while(true){
        if(ngto(a+i)) break;
        i++;
    }
    cout << i;
    return 0;
}