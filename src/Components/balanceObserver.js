class BalanceSubject {
    constructor() {
      this.observers = [];
      this.balance = 0;
    }
  
    addObserver(observer) {
      this.observers.push(observer);
    }
  
    removeObserver(observer) {
      this.observers = this.observers.filter((obs) => obs !== observer);
    }

    notify(balance) {
    this.observers.forEach((observer) => observer.update(balance));
  }
  
    notifyObservers() {
      this.observers.forEach((observer) => {
        observer.updateBalance(this.balance);
      });
    }
  
    setBalance(balance) {
      this.balance = balance;
      this.notifyObservers();
    }
  }
  
  class BalanceObserver {
    constructor() {
      this.balance = 0;
    }
  
    updateBalance(balance) {
      this.balance = balance;
      console.log('Updated balance:', this.balance);
    }
  }
  
  const balanceSubject = new BalanceSubject();
  
  export { BalanceSubject, BalanceObserver, balanceSubject };
